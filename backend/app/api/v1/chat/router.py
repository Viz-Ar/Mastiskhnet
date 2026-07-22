from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)


from app.api.v1.chat.websocket import manager



router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)



@router.websocket("/{user_id}")
async def websocket_chat(
    websocket: WebSocket,
    user_id:int
):


    await manager.connect(
        user_id,
        websocket
    )


    try:

        while True:


            data = await websocket.receive_json()


            receiver_id = data["receiver_id"]

            message = data["message"]



            await manager.send_message(
                receiver_id,
                message
            )


    except WebSocketDisconnect:


        manager.disconnect(
            user_id
        )