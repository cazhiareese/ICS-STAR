from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, Query
from datetime import date, datetime
import pytz
from sqlalchemy import asc, desc, func
from models.usermodel import User, UserTypeEnum
from models.event_model import Event, EventConfirmedBy, EventDate, EventLink, EventTag, EventVisibleTo
from uuid import UUID
from sqlalchemy.orm import Session

from util.admin_events_util import create_event_util, edit_event_util, get_demographics, get_event_by_id_util, send_email_util
from config.database import get_db

event_router = APIRouter(
    prefix="/api/admin/events",
    tags=["Admin Events"],
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
    batch: Optional[List[str]] = Form(None),
    affiliation:Optional[List[str]] = Form(None),
    employmentStatus: Optional[str] = Form(None),
    job: Optional[List[str]] = Form([]), #can handle multi jobs  
    sendEmail: Optional[bool] = Form(False),
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
        affiliation = clean_input(affiliation)
        batch = clean_input(batch)

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
                        affliation=affiliation,
                        sendEmail=sendEmail,
                        employmentStatus=employmentStatus,
                        job=job  )
        return {"message" : "success", "data": event}
    except Exception as e:
        return {"message": str(e)}

@event_router.put("/edit/{event_id}")
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
    batch: Optional[List[str]] = Form(None),
    affiliation:Optional[List[str]] = Form(None),
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
            
        batch = clean_input(batch)
        tags = clean_input(tags)
        links = clean_input(links)
        job = clean_input(job)
        affiliation = clean_input(affiliation)
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
                affliation=affiliation,
                employmentStatus=employmentStatus,
                job=job
        )
        return {"message": "success", "data": event}
    except Exception as e:
        return {"message": str(e)}

@event_router.get("/event-by-id/{eventId}")
async def get_event_by_id(eventId: UUID, db:Session=Depends(get_db)):
    return {"message": "success", "data": get_event_by_id_util(eventId=eventId, db=db)
    }

@event_router.put("/close/{event_id}")
async def close_event(event_id: UUID, db: Session = Depends(get_db)):

    event = db.query(Event).filter(Event.event_id == event_id).first()
    event.is_closed = True
    db.commit()
    db.refresh(event)
    return {"message": "success closing event", "id": event.event_id}

@event_router.put("/delete/{event_id}")
async def delete_event(event_id: UUID, db: Session=Depends(get_db)):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    event.is_deleted= True
    db.commit()
    db.refresh(event)
    return {"message": "success deleting event", "id": event.event_id}

@event_router.get("/getRSVPs/{event_id}")
async def get_rsvps_by_id(event_id: UUID, db:Session=Depends(get_db), page: int=1):

    ITEMS_PER_PAGE = 10

    query = db.query(EventConfirmedBy.user_id).filter(EventConfirmedBy.event_id==event_id)
    count_query = query.statement.with_only_columns(func.count()).order_by(None)
    total_items = db.execute(count_query).scalar()
    total_pages = max((total_items + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE, 1)

    offset = (page - 1) * ITEMS_PER_PAGE
    query = query.offset(offset).limit(ITEMS_PER_PAGE)
    confirmed = query.all()

    confirm_list = [str(conf[0]) for conf in confirmed]
    if not confirmed:
        return []

    user_details = []
    for people in confirm_list:
        user = db.query(User.user_id,User.first_name, User.last_name, User.email, func.split_part(User.student_number, '-', 1).label("batch")).filter(User.user_id==people).first()
        if not user:
            raise HTTPException(status_code=404, detail="User is not found")
        user_details.append({
            "user_id": user.user_id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "batch": user.batch
        })
    
    return {"message":"success", "page": page, "total_pages": total_pages, "data": user_details}

@event_router.get("/all-open-events")
async def get_open_events(title: Optional[str] = "", order_by: Optional[str] = "", db: Session = Depends(get_db), page:int=1):
    ITEMS_PER_PAGE = 10

    try:
        query = db.query(
            Event.event_id,
            Event.title,
            Event.image,
            Event.location,
            func.count(func.distinct(EventConfirmedBy.user_id)).label("attendee_count"),
            func.array_agg(func.distinct(EventDate.date)).label("event_dates"),
            func.max(EventDate.date).label("latest_date"),
            Event.is_closed
        )\
        .filter(Event.is_concluded == False, Event.is_deleted==False, Event.title.ilike(f"%{title}%") )\
        .outerjoin(EventConfirmedBy, Event.event_id == EventConfirmedBy.event_id)\
        .outerjoin(EventDate, Event.event_id == EventDate.event_id)\
        .group_by(Event.event_id, Event.title, Event.image, Event.location)

        subq = query.subquery()
        total_items = db.query(func.count()).select_from(subq).scalar()
        total_pages = max((total_items + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE, 1)

        if order_by:
            order_parts = order_by.lower().split('_')
            order_field = order_parts[0]
            order_direction = order_parts[1] if len(order_parts) > 1 else 'asc'
            if order_field == 'date':
                order_column = func.max(EventDate.date)
            elif order_field == 'title':
                order_column = Event.title
            elif order_field == 'created':
                order_column = Event.created_at

            if order_direction == 'desc':
                query = query.order_by(desc(order_column))
            else:
                query = query.order_by(asc(order_column))
        else:
            query = query.order_by(asc("latest_date"))

        offset = (page - 1) * ITEMS_PER_PAGE
        query = query.offset(offset).limit(ITEMS_PER_PAGE)
        result = query.all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

    processed_events = []
    for event in result:
        dates_list = []
        for date in event.event_dates:
            if date is not None: 
                dt = datetime.fromisoformat(str(date))
                formatted = dt.strftime("%Y-%m-%d %H:%M")
                dates_list.append(formatted)

        processed_events.append({
            "event_id": event.event_id,
            "title": event.title,
            "image": event.image,
            "location": event.location,
            "datetime": dates_list,
            "attendees": event.attendee_count, 
            "is_closed": event.is_closed
        })
    
    return {"message": "success", "total_pages": total_pages, "page": page, "data": processed_events}

@event_router.get("/all-concluded-events")
async def get_concluded_events(title: Optional[str] = "", order_by: Optional[str] = "", db: Session = Depends(get_db), page: int=1):
    ITEMS_PER_PAGE = 10
    try:
        query = db.query(
            Event.event_id,
            Event.title,
            func.count(func.distinct(EventConfirmedBy.user_id)).label("attendee_count"),
            func.array_agg(EventDate.date).label("event_dates"),
            func.array_agg(EventTag.tag).label("event_tags"),
            Event.updated_at.label("Date Concluded")
        )\
        .filter(Event.is_concluded == True, Event.is_deleted==False, Event.title.ilike(f"%{title}%") )\
        .outerjoin(EventConfirmedBy, Event.event_id == EventConfirmedBy.event_id)\
        .outerjoin(EventDate, Event.event_id == EventDate.event_id)\
        .outerjoin(EventTag, Event.event_id == EventTag.event_id)\
        .group_by(Event.event_id, Event.title, Event.image, Event.location)\
        
        subq = query.subquery()
        total_items = db.query(func.count()).select_from(subq).scalar()
        total_pages = max((total_items + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE, 1)


        if order_by:
            order_parts = order_by.lower().split('_')
            order_field = order_parts[0]
            order_direction = order_parts[1] if len(order_parts) > 1 else 'asc'
            if order_field == 'concluded':
                order_column = Event.updated_at
            elif order_field == 'count':
                order_column = func.count(EventConfirmedBy.user_id)

            if order_direction == 'desc':
                query = query.order_by(desc(order_column))
            else:
                query = query.order_by(asc(order_column))
        else:
            query = query.order_by(desc(Event.updated_at))
        
        offset = (page - 1) * ITEMS_PER_PAGE
        query = query.offset(offset).limit(ITEMS_PER_PAGE)
        result = query.all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

    processed_events = []
    for event in result:
        dates_list = []
        for date in event.event_dates:
            if date is not None: 
                dt = datetime.fromisoformat(str(date))
                formatted = dt.strftime("%Y-%m-%d %H:%M")
                dates_list.append(formatted)

        processed_events.append({
            "event_id": event.event_id,
            "title": event.title,
            "attendees": event.attendee_count,
            "datetime": dates_list,
            "tags": [ev for ev in event.event_tags if ev is not None]
        })
    
    return {"message": "success", "total_pages":total_pages, "page":page, "data": processed_events}


@event_router.get("/rsvp-clicks-count/{event_id}")
def rsvp_clicks_count(event_id: UUID, db: Session = Depends(get_db)):
    
    rsvp_count = db.query(EventConfirmedBy.user_id).filter(EventConfirmedBy.event_id == event_id).count()
    event = db.query(Event).filter(Event.event_id == event_id, Event.is_deleted == False).one()
    
    return {"event": event.title, "rsvp_count": rsvp_count, "user_clicks": event.user_clicks}

@event_router.get("/demographics/{event_id}")
def demographics_by_batch(
    event_id: UUID,
    db: Session = Depends(get_db),
    sort_by: Literal["batch", "rsvp"] = Query("batch", description="Sort by batch or rsvp"),
    order: Literal["asc", "desc"] = Query("asc", description="Sort order asc or desc")
):
    try:
        result = get_demographics(event_id, db, sort_by, order)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@event_router.get("/get-tags")
def get_tags(db: Session = Depends(get_db)):

    
    query = db.query(EventTag.tag).distinct().all()
    if not query:
        raise HTTPException(status_code=404, detail="No tags to fetch!")
    
    return{"message": "success", "data": [tag[0] for tag in query if tag is not None]}

@event_router.post("/send-email/{event_id}")
def send_email(event_id: UUID, db: Session=Depends(get_db)):
    event = db.query(Event.is_all).filter(Event.event_id == event_id).first()

    if event.is_all:
        details = []
        users = db.query(User.first_name, User.last_name, User.email).filter(User.user_type == UserTypeEnum.alumni, User.is_verified == True).all()
        for user in users:
            details.append({
                "name": f"{user.first_name} {user.last_name}",
                "email": user.email
            })
    
    else:
        user_ids = db.query(EventVisibleTo.user_id).filter(EventVisibleTo.event_id == event_id).all()
        details = []
        for user in user_ids:
            recipients = db.query(User.first_name, User.last_name, User.email).filter(User.user_id == user.user_id).first()
            details.append({
                "name": f"{recipients.first_name} {recipients.last_name}",
                "email": recipients.email
            })

    try:
        response = send_email_util(eventId=event_id, recipients=details, db=db)
        return response 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
