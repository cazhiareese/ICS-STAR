from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File, Query
from sqlalchemy.orm import Session
from config.database import get_db
from typing import List

from util.userutil import upload_profile, get_current_user

from models.usermodel import User, UserScholarship, UserAffiliation

router = APIRouter()

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    file_path = await upload_profile(file, user, db)
    if file_path.error:
        raise HTTPException(status_code=500, detail="Error uploading file")

    return {"message": "Profile picture uploaded successfully"}

@router.post("/add-scholarships")
async def add_scholarships(
    scholarships: List[str] = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    new_scholarships = [
        UserScholarship(user_id=user.user_id, scholarship=scholarship)
        for scholarship in scholarships
    ]
    
    db.add_all(new_scholarships)
    db.commit()
    
    return {"message": "scholarships added successfully"}
