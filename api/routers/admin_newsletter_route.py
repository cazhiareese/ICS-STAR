from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, Query
from requests import Session

from api.util.admin_newsletter_util import create_util
from config.database import get_db
from models.usermodel import User
from models.newsletter_model import Newsletter


newsletter_router = APIRouter(
    prefix="/api/admin/newsletter",
    tags=["Admin Newsletter"],
    responses={404: {"description": "Not found"}},
)

def clean_input(value):
    print(value)
    if isinstance(value, list) and len(value) == 1:
        if "," in value[0]:
            return [v.strip() for v in value[0].split(",") if v.strip()]
        else:
            return [value[0].strip()] if value[0].strip() else []
    return value

newsletter_router.post("create")
async def create_news(
        db: Session = Depends(get_db),
        title: str = Form(...),
        image: Optional[UploadFile] = None, 
        content: str = Form(...),
        links: Optional[List[str]]= None,
        tags: Optional[List[str]] = None,
        sendAll: Optional[bool] = False,
        sendtoBatch: Optional[List[str]] = None, 
        sendEmployment: Optional[List[str]] = None,
        sendtoJob: Optional[List[str]] = None, 
):
    tags=clean_input(tags)
    sendtoBatch=clean_input(sendtoBatch)
    sendEmployment=clean_input(sendEmployment)
    sendtoJob=clean_input(sendtoJob)

    try:
        created_news = create_util(
            db = db, 
            title = title,
            image=image, 
            content=content,
            sendAll=sendAll,
            sendtoBatch=sendtoBatch,
            sendEmployment=sendEmployment,
            sendtoJob=sendtoJob
        )

        return {
            "message": "success",
            "id": created_news
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
