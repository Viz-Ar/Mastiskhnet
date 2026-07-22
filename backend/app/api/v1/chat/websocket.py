from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Depends
)

from sqlalchemy.orm import Session

from app.services.socket_manager import manager
from app.database.session import get_db

from app.models.chat import ChatMessage



router = APIRouter(
    prefix="/chat",
    tags=["Realtime Chat"]
)




@router.websocket("/ws/{user_id}")
async def websocket_endpoint(

    websocket: WebSocket,

    user_id: int,

    db: Session = Depends(get_db)

):


    # Connect user

    await manager.connect(
        user_id,
        websocket
    )



    try:


        while True:


            data = await websocket.receive_json()



            receiver_id = data.get(
                "receiver_id"
            )


            message_text = data.get(
                "message"
            )



            if not receiver_id or not message_text:

                await websocket.send_json({

                    "error":
                    "Invalid message format"

                })

                continue




            # ==============================
            # Save Message To Database
            # ==============================


            chat_message = ChatMessage(

                sender_id=user_id,

                receiver_id=receiver_id,

                message=message_text

            )


            db.add(
                chat_message
            )


            db.commit()


            db.refresh(
                chat_message
            )





            # ==============================
            # Send Real Time Message
            # ==============================


            response = {


                "id":
                chat_message.id,


                "sender_id":
                user_id,


                "receiver_id":
                receiver_id,


                "message":
                message_text,


                "created_at":
                str(chat_message.created_at)


            }




            await manager.send_message(

                receiver_id,

                response

            )



            # Send confirmation back

            await websocket.send_json({

                "status":
                "sent",

                "data":
                response

            })




    except WebSocketDisconnect:


        manager.disconnect(

            user_id

        )