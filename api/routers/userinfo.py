from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from config.database import get_db

from util.userutil import upload_profile, get_current_user

from models.usermodel import User

router = APIRouter()

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    file_path = await upload_profile(file, user, db)

    return {"message": "Profile picture uploaded successfully"}
