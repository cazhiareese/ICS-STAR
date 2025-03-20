from datetime import timedelta
from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated
from config.config import ACCESS_TOKEN_EXPIRE_MINUTES
from util.userutil import get_current_active_user, require_student, require_alum, require_admin, get_db, authenticate_user, create_access_token
from schemas.user import UserOut
from models.usermodel import User

router = APIRouter()

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": str(user.user_type)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me/", response_model=UserOut)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return UserOut.model_validate(current_user)

@router.get("/dashboard/student")
async def student_dashboard(current_user: User = Depends(require_student)):
    return {"message": f"Welcome to the student dashboard"}

@router.get("/dashboard/alum")
async def alum_dashboard(current_user: User = Depends(require_alum)):
    return {"message": f"Welcome to the alumni dashboard"}

@router.get("/dashboard/admin")
async def admin_dashboard(current_user: User = Depends(require_admin)):
    return {"message": f"Welcome to the admin dashboard"}
