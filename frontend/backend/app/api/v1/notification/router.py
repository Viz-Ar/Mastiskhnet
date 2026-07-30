from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_database, get_current_user
from app.models.user import User
from app.services.notification_service import NotificationService

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


# ===========================================
# Get My Notifications
# ===========================================

@router.get("/")
def my_notifications(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)

    return service.get_user_notifications(current_user.id)


# ===========================================
# Mark Notification Read
# ===========================================

@router.put("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)

    notification = service.mark_as_read(notification_id)

    if notification is None:
        raise HTTPException(
            status_code=404,
            detail="Notification not found",
        )

    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return notification