from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationService:

    def __init__(self, db: Session):
        self.db = db

    # ===========================================
    # Create Notification
    # ===========================================

    def create(
        self,
        user_id: int,
        title: str,
        message: str,
        notification_type: str = "info",
        scan_id: int | None = None,
    ):

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            scan_id=scan_id,
        )

        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)

        return notification

    # ===========================================
    # Get User Notifications
    # ===========================================

    def get_user_notifications(self, user_id: int):

        return (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .all()
        )

    # ===========================================
    # Mark as Read
    # ===========================================

    def mark_as_read(self, notification_id: int):

        notification = (
            self.db.query(Notification)
            .filter(Notification.id == notification_id)
            .first()
        )

        if notification:

            notification.is_read = True

            self.db.commit()

            self.db.refresh(notification)

        return notification