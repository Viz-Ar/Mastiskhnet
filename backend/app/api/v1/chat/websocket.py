from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Depends
)

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.services.socket_manager import manager
from app.database.session import get_db
from app.models.chat import ChatMessage


router = APIRouter(
    prefix="/chat",
    tags=["Realtime Chat"]
)


# =====================================================
# Chat History
# =====================================================

@router.get("/history/{user1}/{user2}")
def chat_history(
    user1: int,
    user2: int,
    db: Session = Depends(get_db)
):

    messages = (
        db.query(ChatMessage)
        .filter(
            or_(
                and_(
                    ChatMessage.sender_id == user1,
                    ChatMessage.receiver_id == user2
                ),
                and_(
                    ChatMessage.sender_id == user2,
                    ChatMessage.receiver_id == user1
                )
            )
        )
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    return [
        {
            "id": message.id,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "message": message.message,
            "created_at": message.created_at
        }
        for message in messages
    ]


# =====================================================
# WebSocket Chat
# =====================================================

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(

    websocket: WebSocket,

    user_id: int,

    db: Session = Depends(get_db)

):

    await manager.connect(
        user_id,
        websocket
    )

    try:

        while True:

            data = await websocket.receive_json()
            
            print("========== MESSAGE RECEIVED ==========")
            print(data)

            receiver_id = data.get("receiver_id")
            message_text = data.get("message")

            if receiver_id is None or not message_text:

                await websocket.send_json({
                    "error": "Invalid message format"
                })

                continue

            # ==================================
            # Save Message
            # ==================================

            chat_message = ChatMessage(

                sender_id=user_id,

                receiver_id=receiver_id,

                message=message_text

            )

            db.add(chat_message)

            db.commit()

            db.refresh(chat_message)

            # ==================================
            # Message Response
            # ==================================

            response = {

                "id": chat_message.id,

                "sender_id": chat_message.sender_id,

                "receiver_id": chat_message.receiver_id,

                "message": chat_message.message,

                "created_at": str(chat_message.created_at)

            }

            # Send to receiver
            await manager.send_message(
                receiver_id,
                response
            )

            # Send back to sender
            await websocket.send_json({
                "status": "sent",
                "data": response
            })

    except WebSocketDisconnect:

        manager.disconnect(user_id)