

from typing import List, Optional
from fastapi import Depends, Form, HTTPException, UploadFile
from requests import Session
from api.models.newsletter_model import Newsletter
from config.config import STORAGE_STRING, supabase_client, SUPABASE_BUCKET
from api.config.database import get_db

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024
def create_util(
        db: Session ,
        title: str,
        image: Optional[UploadFile], 
        content: str,
        links: Optional[List[str]],
        tags: Optional[List[str]],
        sendAll: Optional[bool],
        sendtoBatch: Optional[List[str]], 
        sendEmployment: Optional[List[str]],
        sendtoJob: Optional[List[str]], 
):
    
    if image:
        file = image.file.read()
        if len(file) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
        if image.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="File type not allowed.")
        file_extension = image.filename.split(".")[-1].lower()
        file_name = f"newsletters/{title.replace(' ', '_')}.{file_extension}"
        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(file_name, file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image. Error: {str(e)}")
        
        image_url = f"{STORAGE_STRING}{file_name}"

    else:
        image_url = None

    try:
        newsletter = Newsletter(
            title = title,
            content=content,
            user_id = "61984760-9a95-42ec-a1f6-67f71370e1a5",
            
        )
    return newsletter