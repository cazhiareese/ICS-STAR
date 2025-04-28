from datetime import timedelta
from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated, Optional
from config.config import ACCESS_TOKEN_EXPIRE_MINUTES
from config.database import get_db
from schemas.user import UserOut

from util.userutil import register_user, get_current_active_user, require_student, require_alum, require_admin, authenticate_user, create_access_token, get_email, get_studno, register_with_google
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

@router.post("/register")
async def register(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
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
    student_number: str = Form(...),
    user_type: UserTypeEnum = Form(...),
    graduation_year: Optional[str] = Form(None),
    graduation_semester: Optional[UserGradSemEnum] = Form(None),
    verification_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    return await register_with_google(
        token=token,
        student_number=student_number,
        user_type=user_type,
        graduation_year=graduation_year,
        graduation_semester=graduation_semester,
        verification_file=verification_file,
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
        data={"sub": str(user.user_id), "role": user.user_type.value, "is_onboarded": user.is_onboarded, "is_verified": user.is_verified}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me/", response_model=UserOut)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return UserOut.model_validate(current_user)

