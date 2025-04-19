from typing import List, Optional
from models.job_posting_model import JobPosting, JobPostingTag
from config.config import STORAGE_STRING, supabase_client
from config.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from fastapi import UploadFile, File, Depends 
from uuid import UUID

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024

# Function util to create a new job posting
async def create_job_posting(
        job_title: str,
        company: str,
        salary: Optional[float],
        tags: Optional[List[str]],
        link: str,
        description: str,
        employment_type: str,
        image: Optional[UploadFile],
        db: Session,
        user_id: UUID
):
    if image:
        file = image.file.read()
        
        if len(file) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
        if image.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="File type not allowed.")
        
        file_extension = image.filename.split(".")[-1].lower()
        file_name = f"job_posting/{job_title.replace(' ', '_')}.{file_extension}"

        try:
            supabase_client.storage.from_("128storage").upload(file_name, file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image. Error: {str(e)}")
        
        image_url = f"{STORAGE_STRING}{file_name}"

    else:
        image_url = None

    job_title = job_title.replace(" ", "_")
    job_posting = JobPosting(
        title=job_title,
        company=company,
        salary=salary,
        link=link,
        description=description,
        employment_type=employment_type,
        image=image_url,
        user_id=user_id
    )

    db.add(job_posting)
    db.commit()
    db.refresh(job_posting)

    if tags:
        for tag in tags:
            job_posting_tag = JobPostingTag(
                post_id=job_posting.post_id,
                tag=tag
            )
            db.add(job_posting_tag)
        db.commit()
        db.refresh(job_posting)
        db.refresh(job_posting_tag)

    return job_posting

# Function util to edit a job posting
async def edit_job_posting(
        job_posting_id: UUID,
        job_title: str,
        company: str,
        salary: Optional[float],
        tags: Optional[List[str]],
        link: str,
        description: str,
        employment_type: str,
        image: Optional[UploadFile],
        db: Session
):
    job_posting = db.query(JobPosting).filter(JobPosting.post_id == job_posting_id).first()

    if not job_posting:
        raise HTTPException(status_code=404, detail="Job posting not found.")

    if image:
        file = image.file.read()
        
        if len(file) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
        if image.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="File type not allowed.")
        
        file_extension = image.filename.split(".")[-1].lower()
        file_name = f"job_posting/{job_title.replace(' ', '_')}.{file_extension}"

        try:
            supabase_client.storage.from_("128storage").upload(file_name, file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image. Error: {str(e)}")
        
        image_url = f"{STORAGE_STRING}{file_name}"
    else:
        image_url = job_posting.image

    job_posting.title = job_title.replace(" ", "_")
    job_posting.company = company
    job_posting.salary = salary
    job_posting.link = link
    job_posting.description = description
    job_posting.employment_type = employment_type
    job_posting.image = image_url

    db.commit()
    db.refresh(job_posting)

    # Clear existing tags and add new ones
    db.query(JobPostingTag).filter(JobPostingTag.post_id == job_posting.post_id).delete()
    
    if tags:
        for tag in tags:
            job_posting_tag = JobPostingTag(
                post_id=job_posting.post_id,
                tag=tag
            )
            db.add(job_posting_tag)
    
    db.commit()
    
    return job_posting