from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.core.dependencies import get_database
from app.models.user import User



oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)



def get_current_user(

    token: str = Depends(oauth2_scheme),

    db: Session = Depends(get_database)

):

    payload = decode_token(token)


    if payload is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


    user_id = payload.get("sub")


    if user_id is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid token payload"
        )


    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()



    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    return user