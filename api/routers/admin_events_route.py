

from typing import List, Optional
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from datetime import date, datetime
import pytz

from uuid import UUID
from sqlalchemy.orm import Session

from util.admin_events_util import create_event_util, edit_event_util
from config.database import get_db

event_router = APIRouter(
    prefix="/api/admin/events",
    tags=["Admin Events"],
    responses={404: {"description": "Not found"}},
)
def clean_input(value):
    if isinstance(value, list) and len(value) == 1:
        if "," in value[0]:
            return [v.strip() for v in value[0].split(",") if v.strip()]
        else:
            return [value[0].strip()] if value[0].strip() else []
    return value

@event_router.post( "/create")
# INCLUDE TIME
async def create_event(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = None, 
    location: str = Form (...),
    date: List[str] = Form (...),
    time: List[str] = Form(...),
    tags: Optional[List[str]] = Form([]),
    links: Optional[List[str]] = Form([]),
    isAll: Optional[bool] = Form(False),
    batch: Optional[str] = Form(None),
    affliation:Optional[List[str]] = Form(None),
    employmentStatus: Optional[str] = Form(None),
    job: Optional[List[str]] = Form([]), #can handle multi jobs  
    db: Session = Depends(get_db)
):
    try:
        flat_dates = []
        flat_times = []

        if date and isinstance(date, list) and len(date) == 1 and "," in date[0]:
            for entry in date:
                flat_dates.extend([d.strip() for d in entry.split(',') if d.strip()])
        else:
            flat_dates = date

        if time and isinstance(time, list) and len(time) == 1 and "," in time[0]:
            for entry in time:
                flat_times.extend([t.strip() for t in entry.split(',') if t.strip()])
        else:
            flat_times = time

        if len(flat_dates) != len(flat_times):
            raise HTTPException(status_code=400, detail="Mismatch between number of dates and times.")

        try:
            utc = pytz.UTC
            event_datetimes = [
                utc.localize(datetime.strptime(f"{d} {t}", "%Y-%m-%d %H:%M"))
                for d, t in zip(flat_dates, flat_times)
            ]
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid date/time format: {e}")
            
        
        tags = clean_input(tags)
        links = clean_input(links)
        job = clean_input(job)
        affliation = clean_input(affliation)

        event = await create_event_util(
                        db=db, 
                        title=title, 
                        description=description, 
                        image=image, location=location, 
                        dates=event_datetimes, 
                        tags=tags, 
                        links=links, 
                        isAll=isAll,
                        batch=batch,
                        affliation=affliation,
                        employmentStatus=employmentStatus,
                        job=job  )
        return {"message" : "success", "data": event}
    except Exception as e:
        return {"message": str(e)}

@event_router.put("/edit")
async def edit_event(
    event_id: UUID,
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = None, 
    location: str = Form (...),
    date: List[str] = Form (...),
    time: List[str] = Form(...),
    tags: Optional[List[str]] = Form([]),
    links: Optional[List[str]] = Form([]),
    isAll: Optional[bool] = Form(False),
    batch: Optional[str] = Form(None),
    affliation:Optional[List[str]] = Form(None),
    employmentStatus: Optional[str] = Form(None),
    job: Optional[List[str]] = Form([]),
    db: Session = Depends(get_db)
):
    try:
        flat_dates = []
        flat_times = []

        if date and isinstance(date, list) and len(date) == 1 and "," in date[0]:
            for entry in date:
                flat_dates.extend([d.strip() for d in entry.split(',') if d.strip()])
        else:
            flat_dates = date

        if time and isinstance(time, list) and len(time) == 1 and "," in time[0]:
            for entry in time:
                flat_times.extend([t.strip() for t in entry.split(',') if t.strip()])
        else:
            flat_times = time

        if len(flat_dates) != len(flat_times):
            raise HTTPException(status_code=400, detail="Mismatch between number of dates and times.")

        try:
            utc = pytz.UTC
            event_datetimes = [
                utc.localize(datetime.strptime(f"{d} {t}", "%Y-%m-%d %H:%M"))
                for d, t in zip(flat_dates, flat_times)
            ]
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid date/time format: {e}")
            
        
        tags = clean_input(tags)
        links = clean_input(links)
        job = clean_input(job)
        affliation = clean_input(affliation)
        event = await edit_event_util(
                db=db, 
                event_id=event_id,
                title=title, 
                description=description, 
                image=image, location=location, 
                dates=event_datetimes, 
                tags=tags, 
                links=links, 
                isAll=isAll,
                batch=batch,
                affliation=affliation,
                employmentStatus=employmentStatus,
                job=job
        )
        return {"message": "success", "data": event}
    except Exception as e:
        return {"message": str(e)}
