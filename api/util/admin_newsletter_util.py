

from typing import List, Optional
from fastapi import Depends, Form, HTTPException, UploadFile
from requests import Session
from sqlalchemy import UUID, func, or_
from models.newsletter_model import Newsletter, NewsletterLink, NewsletterTag
from models.usermodel import User
from schemas.newsletter_schema import ListNewsletterOut
from config.config import STORAGE_STRING, supabase_client, SUPABASE_BUCKET
from config.database import get_db
from datetime import datetime

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024
def create_util(
        db: Session ,
        title: str,
        image: Optional[UploadFile], 
        content: str,
        links: Optional[List[str]],
        tags: Optional[List[str]],
        sendEmail: Optional[bool],
        sendAll: Optional[bool],
        sendtoBatch: Optional[List[str]], 
        sendEmployment: Optional[List[str]],
        sendtoJob: Optional[List[str]], 
):
    print("server util")
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
            image= image_url
        )
        db.add(newsletter)
        db.commit()  
        db.refresh(newsletter) 
    except Exception as e:
        raise HTTPException(status_code=500, detail= f"Fail to create event: {e}")
    
    if tags:
        try:
            for tag in tags:
                news_tags = NewsletterTag(
                    newsletter_id= newsletter.newsletter_id,
                    tag=tag
                )
                db.add(news_tags)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event tag upload: {e}')
        
    if links:
        try:
            for link in links:
                news_link = NewsletterLink(
                    newsletter_id = newsletter.newsletter_id,
                    link = link
                )
                db.add(news_link)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event link upload: {e}')
        
    

    if sendEmail:
        sendSet = set()
        if sendAll:
            query = db.query(User.first_name, User.last_name, User.email).all()
            allFiltered = {"name": f"{query.first_name} {query.last_name}", "email": query.email}
            sendSet.update(allFiltered)
        else:
            if sendtoBatch and len(sendtoBatch) > 0:
                
                print("Entered batch")
                query = db.query(User.first_name, User.last_name, User.email)\
                    .filter(or_(*[func.split_part(User.student_number, '-', 1) == b for b in sendtoBatch]))\
                    .distinct()\
                    .all()
                batchFiltered =  {"name": f"{query.first_name} {query.last_name}", "email": query.email}
                sendSet.update(batchFiltered)
            if sendtoJob and len(sendtoJob) > 0:
                
                print("Entered batch")
                query = db.query(User.first_name, User.last_name, User.email)\
                    .filter(or_(*[User.job_title == job for job in sendtoJob]))\
                    .distinct()\
                    .all()
                jobFiltered =  {"name": f"{query.first_name} {query.last_name}", "email": query.email}
                sendSet.update(jobFiltered)
            
            if sendEmployment and len(sendEmployment) > 0:
                print("Entered batch")
                query = db.query(User.first_name, User.last_name, User.email)\
                    .filter(or_(*[User.employment_status == employ for employ in sendEmployment]))\
                    .distinct()\
                    .all()
                employFiltered =  {"name": f"{query.first_name} {query.last_name}", "email": query.email}
                sendSet.update(employFiltered)
   
    return newsletter.newsletter_id

def edit_util(
        db: Session ,
        newsletter_id: UUID, 
        title: str,
        image: Optional[UploadFile], 
        content: str,
        links: Optional[List[str]],
        tags: Optional[List[str]],
        sendEmail: Optional[bool],
        sendAll: Optional[bool],
        sendtoBatch: Optional[List[str]], 
        sendEmployment: Optional[List[str]],
        sendtoJob: Optional[List[str]], 
):
    newsletter = db.query(Newsletter).filter(Newsletter.newsletter_id == newsletter_id).first()
    if not newsletter:
        raise HTTPException(status_code=404, detail="Event not found")


    if image:
        file = image.file.read()
        if len(file) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
        if image.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="File type not allowed.")
        
        if newsletter.image:
            try:
                old_file_path = newsletter.image.replace(STORAGE_STRING, "")
                supabase_client.storage.from_(SUPABASE_BUCKET).remove([old_file_path])
            except Exception as e:
                raise HTTPException(status_code=500, detail="Failed to delete old profile picture: {e}")
            
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

        newsletter.title = title 
        newsletter.content = content 
        newsletter.image=image_url

        db.commit()  
        db.refresh(newsletter) 
    except Exception as e:
        raise HTTPException(status_code=500, detail= f"Fail to edit event: {e}")
    
    db.query(NewsletterTag).filter(NewsletterTag.newsletter_id == newsletter_id).delete()
    db.query(NewsletterLink).filter(NewsletterLink.newsletter_id == newsletter_id).delete()
    if tags:
        try:
            for tag in tags:
                news_tags = NewsletterTag(
                    newsletter_id= newsletter.newsletter_id,
                    tag=tag
                )
                db.add(news_tags)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event tag upload: {e}')
        
    if links:
        try:
            for link in links:
                news_link = NewsletterLink(
                    newsletter_id = newsletter.newsletter_id,
                    link = link
                )
                db.add(news_link)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Fail event link upload: {e}')
    if sendEmail:
        sendSet = set()
        if sendAll:
            query = db.query(User.first_name, User.last_name, User.email).all()
            allFiltered = {"name": f"{query.first_name} {query.last_name}", "email": query.email}
            sendSet.update(allFiltered)
        else:
            if sendtoBatch and len(sendtoBatch) > 0:
                
                print("Entered batch")
                query = db.query(User.first_name, User.last_name, User.email)\
                    .filter(or_(*[func.split_part(User.student_number, '-', 1) == b for b in sendtoBatch]))\
                    .distinct()\
                    .all()
                batchFiltered =  {"name": f"{query.first_name} {query.last_name}", "email": query.email}
                sendSet.update(batchFiltered)
            if sendtoJob and len(sendtoJob) > 0:
                
                print("Entered batch")
                query = db.query(User.first_name, User.last_name, User.email)\
                    .filter(or_(*[User.job_title == job for job in sendtoJob]))\
                    .distinct()\
                    .all()
                jobFiltered =  {"name": f"{query.first_name} {query.last_name}", "email": query.email}
                sendSet.update(jobFiltered)
            
            if sendEmployment and len(sendEmployment) > 0:
                print("Entered batch")
                query = db.query(User.first_name, User.last_name, User.email)\
                    .filter(or_(*[User.employment_status == employ for employ in sendEmployment]))\
                    .distinct()\
                    .all()
                employFiltered =  {"name": f"{query.first_name} {query.last_name}", "email": query.email}
                sendSet.update(employFiltered)
   
    return newsletter.newsletter_id

def get_util(
        db: Session
) -> List[ListNewsletterOut]:
    newsletters = db.query(Newsletter).all()
    if not newsletters:
        raise HTTPException(status_code=404, detail="No newsletters found")
    
    newsletter_list_out = []

    for newsletter in newsletters:
        # Get the tags for each newsletter
        tags = db.query(NewsletterTag).filter(NewsletterTag.newsletter_id == newsletter.newsletter_id).all()

        # Get the links for each newsletter
        links = db.query(NewsletterLink).filter(NewsletterLink.newsletter_id == newsletter.newsletter_id).all()

        date = newsletter.date_posted.strftime("%b %d, %Y, %-I:%M %p")
        
        newsletter_list = ListNewsletterOut(
            newsletter_id = newsletter.newsletter_id,
            title = newsletter.title,
            image = newsletter.image,
            date_posted = date,
            is_deleted = newsletter.is_deleted,
            tags = [tag.tag for tag in tags],
            links = [link.link for link in links]
        )

        newsletter_list_out.append(newsletter_list)

    return newsletter_list_out

def delete_util(
        db: Session,
        newsletter_id: UUID
):
    newsletter = db.query(Newsletter).filter(Newsletter.newsletter_id == newsletter_id, Newsletter.is_deleted == False).first()
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    
    try:
        if newsletter.image:
            old_file_path = newsletter.image.replace(STORAGE_STRING, "")
            supabase_client.storage.from_(SUPABASE_BUCKET).remove([old_file_path])
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete old profile picture: {e}")
    
    try:
        newsletter.is_deleted = True
        db.commit()
        db.refresh(newsletter)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete newsletter: {e}")