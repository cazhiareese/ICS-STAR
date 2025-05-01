
from datetime import date, datetime
from typing import List, Optional, Literal
import brevo_python
from brevo_python.rest import ApiException
from sqlalchemy import UUID, func, or_
from util.emailing.invitation import invitation
from models.usermodel import User, UserAffiliation
from config.config import STORAGE_STRING, supabase_client, SUPABASE_BUCKET, brevo_configuration, email_sender
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from schemas.events_schema import DemographicsOut
from models.event_model import Event, EventConfirmedBy, EventDate, EventLink, EventTag, EventVisibleTo


ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png"}

MAX_FILE_SIZE = 10 * 1024 * 1024
async def create_event_util(
    title: str ,
    description: Optional[str] ,
    image: Optional[UploadFile] , 
    location: str ,
    dates: List[str] ,
    tags: Optional[List[str]],
    links: Optional[List[str]],
    isAll: Optional[bool],
    batch: Optional[str],
    affliation:Optional[List[str]],
    employmentStatus: Optional[str],
    job: Optional[List[str]], #can handle multi jobs
    sendEmail: Optional[bool],  
    db: Session 
):
    print(batch)
    print(affliation)
    print(job)
    if image:
        file = image.file.read()
        if len(file) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
        if image.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="File type not allowed.")
        file_extension = image.filename.split(".")[-1].lower()
        file_name = f"events/{title.replace(' ', '_')}.{file_extension}"
        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(file_name, file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image. Error: {str(e)}")
        
        image_url = f"{STORAGE_STRING}{file_name}"

    else:
        image_url = None
    
    try:
        event = Event(
            title=title, 
            description=description,
            image=image_url,
            location=location,
            is_all=isAll
        )
        db.add(event)
        db.commit()
        db.refresh(event)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Fail event upload: {e}')
    
    try:
        for date in dates:
            event_dates = EventDate(
                event_id = event.event_id,
                date= date,
            )
            db.add(event_dates)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Fail event date upload: {e}')
    
    # insert time
    if tags:
        try: 
            # tags = tags.split(',')
            for tag in tags:
                event_tags = EventTag(
                    event_id = event.event_id,
                    tag=tag
                )
                db.add(event_tags)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event tag upload: {e}')
    if links:
        try:
            # links = links.split(',')
            for link in links: 
                event_links = EventLink(
                    event_id=event.event_id,
                    link=link
                )
                db.add(event_links)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event link upload: {e}')
    
    visibleSet = set()

    if batch and len(batch) > 0:
        
        print("Entered batch")
        query = db.query(User.user_id)\
            .filter(or_(*[func.split_part(User.student_number, '-', 1) == b for b in batch]))\
            .distinct()\
            .all()
        batchFiltered = {q[0] for q in query if q[0] is not None}
        visibleSet.update(batchFiltered)

    if affliation and len(affliation) > 0:
        print(affliation)
        affiliation_subquery = db.query(UserAffiliation.user_id)\
            .filter(or_(*[UserAffiliation.affiliation.ilike(f"%{a}%") for a in affliation]))\
            .distinct()\
            .all()
        affliationFiltered = {q[0] for q in affiliation_subquery if q[0] is not None}
        visibleSet.update(affliationFiltered)

    if job and len(job) > 0:
        print("Entered job")
        job_subquery = db.query(User.user_id)\
            .filter(or_(*[User.job_title == j for j in job]))\
            .distinct()\
            .all()
        jobFiltered = {q[0] for q in job_subquery if q[0] is not None}
        visibleSet.update(jobFiltered)

    if employmentStatus and len(employmentStatus) > 0:
        print("Entered employment")
        status_subQuery = db.query(User.user_id)\
            .filter(User.employment_status == employmentStatus)\
            .distinct()\
            .all()
        statusFiltered = {q[0] for q in status_subQuery if q[0] is not None}
        visibleSet.update(statusFiltered)

    visibleList = list(visibleSet)
    
    print(visibleList)
    if visibleList and len(visibleList)>0:
        for userId in visibleList:
            available_rsvp = EventVisibleTo(
                event_id=event.event_id,
                user_id=userId,
            )
            db.add(available_rsvp)
        db.commit()
    
    if sendEmail:
        details = []
        if not isAll:
            if visibleList and len(visibleList)>0:
                for userId in visibleList:
                    recipients = db.query(User.first_name, User.last_name, User.email).filter(User.user_id == userId).first()
                    details.append({
                        "name": f"{recipients.first_name} {recipients.last_name}",
                        "email": recipients.email
                    })
        
            send_email_util(eventId=event.event_id, recipients=details, db=db)

    
    return event.event_id

async def edit_event_util (
    event_id: UUID,
    title: str ,
    description: Optional[str] ,
    image: Optional[UploadFile] , 
    location: str ,
    dates: List[str] ,
    tags: Optional[List[str]],
    links: Optional[List[str]],
    isAll: Optional[bool],
    batch: Optional[str],
    affliation:Optional[List[str]],
    employmentStatus: Optional[str],
    job: Optional[List[str]], #can handle multi jobs  
    db: Session
):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if image:
        file = image.file.read()
        if len(file) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
        if image.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="File type not allowed.")
        
        if event.image:
            try:
                old_file_path = event.image.replace(STORAGE_STRING, "")
                supabase_client.storage.from_(SUPABASE_BUCKET).remove([old_file_path])
            except Exception as e:
                raise HTTPException(status_code=500, detail="Failed to delete old profile picture: {e}")
            
        file_extension = image.filename.split(".")[-1].lower()
        file_name = f"events/{title.replace(' ', '_')}.{file_extension}"
        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(file_name, file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image. Error: {str(e)}")
        
        image_url = f"{STORAGE_STRING}{file_name}"

    event.title = title
    event.description = description
    event.location = location
    event.is_all = isAll 
    event.image = image_url

    db.commit()
    db.refresh(event)

    db.query(EventDate).filter(EventDate.event_id == event.event_id).delete()
    db.query(EventTag).filter(EventTag.event_id == event.event_id).delete()
    db.query(EventLink).filter(EventLink.event_id == event.event_id).delete()
    db.query(EventVisibleTo).filter(EventVisibleTo.event_id == event.event_id).delete()

    try:
        for date in dates:
            event_dates = EventDate(
                event_id = event.event_id,
                date= date,
            )
            db.add(event_dates)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Fail event date upload: {e}')
    
    # insert time
    if tags:
        try: 
            # tags = tags.split(',')
            for tag in tags:
                event_tags = EventTag(
                    event_id = event.event_id,
                    tag=tag
                )
                db.add(event_tags)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event tag upload: {e}')
    if links:
        try:
            # links = links.split(',')
            for link in links: 
                event_links = EventLink(
                    event_id=event.event_id,
                    link=link
                )
                db.add(event_links)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event link upload: {e}')
    
    visibleSet = set()

    if batch and len(batch) > 0:
        print("Entered batch")
        query = db.query(User.user_id)\
            .filter(or_(*[func.split_part(User.student_number, '-', 1) == b for b in batch]))\
            .distinct()\
            .all()
        batchFiltered = {q[0] for q in query if q[0] is not None}
        visibleSet.update(batchFiltered)

    if affliation and len(affliation) > 0:
        print(affliation)
        affiliation_subquery = db.query(UserAffiliation.user_id)\
            .filter(or_(*[UserAffiliation.affiliation.ilike(f"%{a}%") for a in affliation]))\
            .distinct()\
            .all()
        affliationFiltered = {q[0] for q in affiliation_subquery if q[0] is not None}
        visibleSet.update(affliationFiltered)

    if job and len(job) > 0:
        print("Entered job")
        job_subquery = db.query(User.user_id)\
            .filter(or_(*[User.job_title == j for j in job]))\
            .distinct()\
            .all()
        jobFiltered = {q[0] for q in job_subquery if q[0] is not None}
        visibleSet.update(jobFiltered)

    if employmentStatus and len(employmentStatus) > 0:
        print("Entered employment")
        status_subQuery = db.query(User.user_id)\
            .filter(User.employment_status == employmentStatus)\
            .distinct()\
            .all()
        statusFiltered = {q[0] for q in status_subQuery if q[0] is not None}
        visibleSet.update(statusFiltered)

    visibleList = list(visibleSet)
    
    print(visibleList)
    if visibleList and len(visibleList)>0:
        for userId in visibleList:
            available_rsvp = EventVisibleTo(
                event_id=event.event_id,
                user_id=userId,
            )
            db.add(available_rsvp)
        db.commit()

    return event


def get_demographics(
    event_id: str, 
    db: Session,
    sort_by: Literal["batch", "rsvp"] = "batch",
    order: Literal["asc", "desc"] = "asc"
) -> List[DemographicsOut]:
    batch_year_expr = func.substr(User.student_number, 1, 4)

    query = (
        db.query(
            batch_year_expr.label("batch"),
            func.count(EventConfirmedBy.user_id).label("rsvp_count")
        )
        .join(EventConfirmedBy, EventConfirmedBy.user_id == User.user_id)
        .filter(EventConfirmedBy.event_id == event_id)
        .filter(User.student_number.isnot(None))
        .group_by(batch_year_expr)
    )
    
    if sort_by == "batch":
        sort_column = batch_year_expr
    else:
        sort_column = func.count(EventConfirmedBy.user_id)

    if order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    results = query.all()

    return [{"batch": r.batch, "rsvp_count": r.rsvp_count} for r in results]

def add_user_clicks(
    event_id: UUID,
    db: Session
):
    try:
        event = db.query(Event).filter(Event.event_id == event_id, Event.is_deleted == False).one()
        event.user_clicks = (event.user_clicks or 0) + 1
        db.commit()
        db.refresh(event)
        return True
    except Exception as e:
        db.rollback()
        raise e


def get_event_by_id_util(eventId: UUID, db:Session):
        try:
            event = db.query(Event.event_id, Event.title, Event.image, Event.location, Event.description, Event.is_closed, Event.is_concluded).filter(Event.event_id==eventId).first()
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Event not found: {e}")
        
        try:
            event_dates = db.query(EventDate.date).filter(EventDate.event_id == event.event_id).all()
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Event date not found: {e}")
        
        try: 
            event_links= db.query(EventLink.link).filter(EventLink.event_id == event.event_id).all()
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Event link not found: {e}")
        
        try: 
            event_tags = db.query(EventTag.tag).filter(EventTag.event_id == event.event_id).all()
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Event link not found: {e}")

        dates_list = []
        for date in event_dates:
            # print(date[0])
            dt = datetime.fromisoformat(str(date[0]))
            formatted = dt.strftime("%Y-%m-%d %H:%M")
            dates_list.append(formatted)

        links_list= [link[0] for link in event_links]
        tags_list = [tag[0] for tag in event_tags]


        return {
            "event_id": event.event_id, 
            "title": event.title, 
            "image": event.image,
            "location": event.location, 
            "description": event.description, 
            "datetime": dates_list,
            "links": links_list,
            "tags": tags_list,
            "is_closed": event.is_closed,
            "is_concluded": event.is_concluded
        }

def send_email_util (eventId: UUID, recipients: List[dict], db: Session):
    print(recipients)
    try:
        event = get_event_by_id_util(eventId=eventId, db=db)
        eventContents = {
            "title": event["title"],
            "image": event["image"],
            "description": event["description"],
            "location": event["location"],
            "datetime": event["datetime"]
        }
        print(recipients)
        finalImage = eventContents['image'] if eventContents.get('image') else 'https://rtyworjvisvjmixvxwmc.supabase.co/storage/v1/object/public/128storage/emailing_assets/default.jpg'
        api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))
        subject = f"ICS-STAR invites you to: {eventContents['title']}"
        sender = email_sender
        html_content = invitation(eventId=eventId, title=eventContents['title'], datetime=event['datetime'][0],location=eventContents['location'], image=finalImage, description= eventContents['description'], )
        to = [email_sender]
        bcc=recipients
        send_smtp_email = brevo_python.SendSmtpEmail(to=to, bcc=bcc, html_content=html_content, sender=sender, subject=subject)

        try:
            print("before execute")
            api_response = api_instance.send_transac_email(send_smtp_email)
            return {"message": api_response}
        except ApiException as e:
            print(f"Error: {e}")


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")