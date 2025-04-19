from uuid import UUID
from fastapi import Depends, HTTPException, APIRouter, Form, UploadFile, File
from typing import Optional, List
from sqlalchemy import func
from sqlalchemy.orm import Session
from api.models.usermodel import User
from api.schemas.job_posting_schema import JobPostingOut
from models.job_posting_model import JobPosting, JobPostingTag, JobPostingInterestedIn, AppliesFor
from util.job_posting_util import create_job_posting
from config.database import get_db

router = APIRouter()

# Create job posting
@router.post("/create-job-postings")
def create_job_posting_endpoint(
    title: str = Form(...),
    company: str = Form(...),
    salary: Optional[float] = Form(None),
    tags: Optional[List[str]] = Form(None),
    link: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    
    return create_job_posting(
        job_title=title,
        company=company,
        salary=salary,
        tags=tags,
        link=link,
        description=description,
        image=image,
        db=db
    )

# Edit job posting
@router.put("/edit-job-postings/{job_posting_id}")
def edit_job_posting_endpoint(
    job_posting_id: UUID,
    title: str = Form(...),
    company: str = Form(...),
    salary: Optional[float] = Form(None),
    tags: Optional[List[str]] = Form(None),
    link: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    
    return create_job_posting(
        job_posting_id=job_posting_id,
        job_title=title,
        company=company,
        salary=salary,
        tags=tags,
        link=link,
        description=description,
        image=image,
        db=db
    )

# Delete job posting
@router.delete("/delete-job-postings/{job_posting_id}")
def delete_job_posting_endpoint(
    job_posting_id: UUID,
    db: Session = Depends(get_db)
):
    job_posting = db.query(JobPosting).filter(JobPosting.id == job_posting_id).first()
    
    if not job_posting:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    job_posting.is_deleted = True
    db.commit()
    db.refresh(job_posting)
    
    return {"detail": "Job posting deleted successfully"}

# Close job posting
@router.put("/close-job-postings/{job_posting_id}")
def close_job_posting_endpoint(
    job_posting_id: UUID,
    db: Session = Depends(get_db)
):
    job_posting = db.query(JobPosting).filter(JobPosting.id == job_posting_id).first()
    
    if not job_posting:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    job_posting.is_closed = True
    db.commit()
    db.refresh(job_posting)
    
    return {"detail": "Job posting closed successfully"}

# Get all job postings
@router.get("/job-postings/", response_model=List[JobPostingOut])
def get_job_postings(db: Session = Depends(get_db)):
    # Query to get job postings with required information
    query_result = db.query(
        JobPosting.id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).join(
        User, JobPosting.user_id == User.id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.id == JobPostingInterestedIn.post_id
    ).group_by(
        JobPosting.id, JobPosting.title, JobPosting.company, JobPosting.description, 'user_name'
    ).all()
    
    # Now we need to get tags for each job posting
    result = []
    for row in query_result:
        job_id = row.id
        tags = db.query(JobPostingTag.tag).filter(JobPostingTag.post_id == job_id).all()
        tag_list = [tag[0] for tag in tags]
        
        result.append({
            "title": row.title,
            "company": row.company,
            "description": row.description,
            "user_name": row.user_name,
            "tags": tag_list,
            "interested_count": row.interested_count
        })
    
    return result

# Get job posting by ID
@router.get("/job-postings/{job_id}", response_model=JobPostingOut)
def get_job_posting(
    job_id: UUID,
    db: Session = Depends(get_db)
):
    # Query to get a specific job posting with required information
    query_result = db.query(
        JobPosting.id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).join(
        User, JobPosting.user_id == User.id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.id == JobPostingInterestedIn.post_id
    ).filter(
        JobPosting.id == job_id
    ).group_by(
        JobPosting.id, JobPosting.title, JobPosting.company, JobPosting.description, 'user_name'
    ).first()
    
    # If no job posting is found, raise a 404 error
    if not query_result:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    # Get tags for the job posting
    tags = db.query(JobPostingTag.tag).filter(JobPostingTag.post_id == job_id).all()
    tag_list = [tag[0] for tag in tags]
    
    # Construct the response
    response = {
        "title": query_result.title,
        "company": query_result.company,
        "description": query_result.description,
        "user_name": query_result.user_name,
        "tags": tag_list,
        "interested_count": query_result.interested_count
    }
    
    return response
    