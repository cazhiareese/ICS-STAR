from typing import List, Optional
from util.emailing.deleted_post import deleted_job
from models.job_posting_model import JobPosting, JobPostingTag
from models.report_model import Report, ReportAttachment
from models.report_model import ReportStatusEnum
from config.config import STORAGE_STRING, SUPABASE_BUCKET, supabase_client, brevo_configuration, email_sender
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from fastapi import HTTPException
from fastapi import UploadFile
import brevo_python
from brevo_python.rest import ApiException
from uuid import UUID

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png", "pdf"}
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
        mode: str,
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
        file_name = f"job_posting/{company.replace(' ', '_')}{job_title.replace(' ', '_')}.{file_extension}"

        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(file_name, file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image. Error: {str(e)}")
        
        image_url = f"{STORAGE_STRING}{file_name}"

    else:
        image_url = None

    job_posting = JobPosting(
        title=job_title,
        company=company,
        salary=salary,
        link=link,
        description=description,
        employment_type=employment_type,
        mode=mode,
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
        mode: str,
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
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(file_name, file)
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
    job_posting.mode = mode
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

async def create_report_with_attachment(
    db: Session,
    reporter_id: UUID,
    reported_post_id: UUID,
    reason: str,
    attachment: Optional[UploadFile] = None
):
    # Check if job post exists
    job_post = db.query(JobPosting).filter_by(post_id=reported_post_id).first()
    if not job_post:
        raise HTTPException(status_code=404, detail="Job post not found")
    
    # Create report record
    new_report = Report(
        reporter_id=reporter_id,
        reported_post_id=reported_post_id,
        reason=reason,
        status=ReportStatusEnum.pending
    )
    
    db.add(new_report)
    db.flush()  # Get the report_id before committing
    
    # Process attachment if provided
    if attachment:
        await handle_attachment_upload(db, new_report.report_id, attachment)
    
    # Commit the transaction
    db.commit()
    db.refresh(new_report)
    
    
    return new_report

async def handle_attachment_upload(
    db: Session,
    report_id: UUID,
    attachment: UploadFile
):
    
    file = await attachment.read()
    
    # Validate file size
    if len(file) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
    
    # Validate file extension
    file_extension = attachment.filename.split(".")[-1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed. Supported types: jpg, jpeg, png, pdf")
    
    # Create unique filename
    file_name = f"reports/{report_id}/.{file_extension}"
    
    try:
        # Upload file to storage
        supabase_client.storage.from_(SUPABASE_BUCKET).upload(file_name, file)
        
        # Get public URL
        file_url = f"{STORAGE_STRING}{file_name}"
        
        # Create attachment record
        new_attachment = ReportAttachment(
            report_id=report_id,
            file_url=file_url
        )
        db.add(new_attachment)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload attachment. Error: {str(e)}")
    

def get_top_4_job_tags(db: Session):
    tags = (
        db.query(JobPostingTag.tag, func.count(JobPostingTag.tag).label("count"))
        .group_by(JobPostingTag.tag)
        .order_by(func.count(JobPostingTag.tag).desc())
        .limit(4)
        .all()
    )
    
    return [tag[0] for tag in tags]

def get_tag_suggestions(db: Session, query_text: str, limit: int = 4) -> List[str]:
    results = db.query(distinct(JobPostingTag.tag))\
                .filter(JobPostingTag.tag.ilike(f"%{query_text}%"))\
                .order_by(JobPostingTag.tag)\
                .limit(limit)\
                .all()
    
    return [result[0] for result in results]


def send_email(name: str, email:str, reason:str):
    try:
        api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))
        subject = f"Your Job Posting has been deleted"
        sender = email_sender

        html_content = deleted_job(
            name = name,
            reason = reason
        )
        to = [{"email": email, 'name': name}]
        send_smtp_email = brevo_python.SendSmtpEmail(to=to, html_content=html_content, sender=sender, subject=subject)

        try:
            print("before execute")
            api_response = api_instance.send_transac_email(send_smtp_email)
            return {"message": api_response}
        except ApiException as e:
            print(f"Error: {e}")


    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error: {e}")