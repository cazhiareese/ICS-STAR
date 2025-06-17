from datetime import timedelta
from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Annotated, Optional
from config.config import ACCESS_TOKEN_EXPIRE_MINUTES
from config.database import get_db
from schemas.user import CurrentUser, EmailRequest, UserOut

from util.userutil import register_user, get_current_user, get_current_active_user, require_student, require_alum, require_admin, authenticate_user, create_access_token, get_email, get_studno, register_with_google
from util.reports_logic import logic_login_log, logic_logout_log

from schemas.user import UserOut
from models.usermodel import User, UserGradSemEnum, UserTypeEnum

router = APIRouter()

@router.get("/get-email")
async def check_email(email: str, db: Session = Depends(get_db)):
    return await get_email(email, db)

@router.get("/get-studno")
async def check_student_number(student_number: str, db: Session = Depends(get_db)):
    return await get_studno(student_number, db)

@router.post("/get-email")
async def check_email(request: EmailRequest, db: Session = Depends(get_db)):
    return await get_email(request.email, db)


@router.post("/register")
async def register(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: Optional[str] = Form(None),
    student_number: str = Form(...),
    user_type: str = Form(...),
    verification_file: UploadFile = File(None),
    graduation_year: str = Form(None),
    graduation_semester: UserGradSemEnum = Form(None),
    db: Session = Depends(get_db),
):
    return await register_user(
        first_name, last_name, email, password, student_number, user_type, verification_file, graduation_year, graduation_semester, db
    )

@router.post("/auth/google/register")
async def google_register(
    token: str = Form(...),
    db: Session = Depends(get_db)
):
    return await register_with_google(
        token=token,
        db=db
    )


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

    
    # Once verified, add new login log
    logic_login_log(db, str(user.user_id))


    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.user_type.value, "is_onboarded": user.is_onboarded, "is_verified": user.is_verified, "is_banned": user.is_banned}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me/", response_model=CurrentUser)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return CurrentUser.model_validate(current_user)

@router.get("/check-password-null")
def check_if_password_null(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    query = text("SELECT password FROM users WHERE user_id = :user_id") # No password in SQLAlchemy User Schema so query directly using PostgreSQL
    result = db.execute(query, {"user_id": current_user.user_id})
    row = result.first()

    # print(row)
    
    return row[0] is None
