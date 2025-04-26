from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, Query
from requests import Session
from uuid import UUID

from util.admin_newsletter_util import create_util, edit_util, get_util, delete_util
from config.database import get_db
from models.usermodel import User
from models.newsletter_model import Newsletter


newsletter_router = APIRouter(
    prefix="/api/admin/newsletter",
    tags=["Admin Newsletter"],
    responses={404: {"description": "Not found"}},
)

def clean_input(value):

    if isinstance(value, list) and len(value) == 1:
        if "," in value[0]:
            return [v.strip() for v in value[0].split(",") if v.strip()]
        else:
            return [value[0].strip()] if value[0].strip() else []
    return value

@newsletter_router.post("/create")
async def create_news(
        db: Session = Depends(get_db),
        title: str = Form(...),
        image: Optional[UploadFile] = None, 
        content: str = Form(...),
        links: Optional[List[str]]= Form(None),
        sendEmail: Optional[bool] = Form(False),
        tags: Optional[List[str]] = Form(None),
        sendAll: Optional[bool] = Form(False),
        sendtoBatch: Optional[List[str]] = Form(None), 
        sendEmployment: Optional[List[str]] = Form(None),
        sendtoJob: Optional[List[str]] = Form(None), 
):
    tags=clean_input(tags)
    sendtoBatch=clean_input(sendtoBatch)
    sendEmployment=clean_input(sendEmployment)
    sendtoJob=clean_input(sendtoJob)
    links=clean_input(links)

    try:
        print("befire")
        created_news = create_util(
            db = db, 
            title = title,
            image=image, 
            content=content,
            sendAll=sendAll,
            links=links,
            sendEmail=sendEmail,
            sendtoBatch=sendtoBatch,
            sendEmployment=sendEmployment,
            sendtoJob=sendtoJob,
            tags=tags
        )

        return {
            "message": "success",
            "id": created_news
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@newsletter_router.put("/edit/{newsletter_id}")
async def edit_news(
        newsletter_id: UUID,
        db: Session = Depends(get_db),
        title: str = Form(...),
        image: Optional[UploadFile] = None, 
        content: str = Form(...),
        links: Optional[List[str]]= Form(None),
        sendEmail: Optional[bool] = Form(False),
        tags: Optional[List[str]] = Form(None),
        sendAll: Optional[bool] = Form(False),
        sendtoBatch: Optional[List[str]] = Form(None), 
        sendEmployment: Optional[List[str]] = Form(None),
        sendtoJob: Optional[List[str]] = Form(None), 
):
    tags=clean_input(tags)
    sendtoBatch=clean_input(sendtoBatch)
    sendEmployment=clean_input(sendEmployment)
    sendtoJob=clean_input(sendtoJob)
    links=clean_input(links)

    try:
        print("befire")
        edited_news = edit_util(
            newsletter_id=newsletter_id,
            db = db, 
            title = title,
            image=image, 
            content=content,
            sendAll=sendAll,
            links=links,
            sendEmail=sendEmail,
            sendtoBatch=sendtoBatch,
            sendEmployment=sendEmployment,
            sendtoJob=sendtoJob,
            tags=tags
        )

        return {
            "message": "success",
            "id": edited_news
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@newsletter_router.get("/get")
async def get_news(
        db: Session = Depends(get_db)
):
    try:
        news = get_util(
            db = db
        )

        return {
            "message": "success",
            "news": news
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    
@newsletter_router.delete("/delete/{newsletter_id}")
async def delete_news(
        db: Session = Depends(get_db),
        newsletter_id: UUID = Form(...)
):
    try:
        delete_util(
            db = db,
            newsletter_id=newsletter_id
        )

        return {
            "message": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")