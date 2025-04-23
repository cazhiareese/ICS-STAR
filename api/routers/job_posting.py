import json
from uuid import UUID
from fastapi import Depends, HTTPException, APIRouter, Form, UploadFile, File
from typing import Optional, List
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session
from util.userutil import get_current_user
from models.usermodel import User
from schemas.job_posting_schema import JobPostingOut, JobPostingForAdminOut, EmploymentTypeEnum, JobModeEnum
from schemas.report_schema import ReportedJobPostingOut, PostReportDetailOut
from models.report_model import Report, ReportAttachment
from models.job_posting_model import JobPosting, JobPostingTag, JobPostingInterestedIn, AppliesFor
from util.job_posting_util import create_job_posting, edit_job_posting
from config.database import get_db

router = APIRouter()

# Create job posting
@router.post("/create-job-postings")
async def create_job_posting_endpoint(
    title: str = Form(...),
    company: str = Form(...),
    salary: Optional[float] = Form(None),
    tags: str = Form(None), 
    link: str = Form(...),
    description: str = Form(...),
    employment_type: str = Form(...),
    mode: str = Form(...),
    image: UploadFile = None, 
    user: get_current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    user_id = user.user_id

    # Parse tags from string to list
    tag_list = None
    if tags:
        try:
            tag_list = json.loads(tags) 
        except json.JSONDecodeError:
            tag_list = [tag.strip() for tag in tags.split(',')]  
    
    return await create_job_posting(
        job_title=title,
        company=company,
        salary=salary,
        tags=tag_list,
        link=link,
        description=description,
        employment_type=employment_type,
        mode=mode,
        image=image,
        user_id=user_id,
        db=db
    )

# Edit job posting
@router.put("/edit-job-postings/{job_posting_id}")
async def edit_job_posting_endpoint(
    job_posting_id: UUID,
    title: str = Form(...),
    company: str = Form(...),
    salary: Optional[float] = Form(None),
    tags: str = Form(None), 
    link: str = Form(...),
    description: str = Form(...),
    employment_type: str = Form(...),
    mode: str = Form(...),
    image: Optional[UploadFile] = None,  
    db: Session = Depends(get_db)
):
    # Parse tags from string to list
    tag_list = None
    if tags:
        try:
            tag_list = json.loads(tags)
        except json.JSONDecodeError:
            tag_list = [tag.strip() for tag in tags.split(',')]

    return await edit_job_posting(
        job_posting_id=job_posting_id,
        job_title=title,
        company=company,
        salary=salary,
        tags=tag_list,
        link=link,
        description=description,
        employment_type=employment_type,
        mode=mode,
        image=image,
        db=db
    )

# Delete job posting
@router.delete("/delete-job-postings/{job_posting_id}")
def delete_job_posting_endpoint(
    job_posting_id: UUID,
    db: Session = Depends(get_db)
):
    job_posting = db.query(JobPosting).filter(JobPosting.post_id == job_posting_id).first()
    
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
    job_posting = db.query(JobPosting).filter(JobPosting.post_id == job_posting_id).first()
    
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
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        JobPosting.employment_type,
        JobPosting.mode,
        User.user_id,
        JobPosting.salary,
        JobPosting.link,
        JobPosting.image,
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).join(
        User, JobPosting.user_id == User.user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).group_by(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        User.user_id,
        func.concat(User.first_name, ' ', User.last_name)
    ).all()
    
    # Now we need to get tags for each job posting
    result = []
    for row in query_result:
        job_id = row.post_id
        tags = db.query(JobPostingTag.tag).filter(JobPostingTag.post_id == job_id).all()
        tag_list = [tag[0] for tag in tags]
        
        result.append({
            "post_id": row.post_id,
            "user_id": row.user_id,
            "title": row.title,
            "company": row.company,
            "description": row.description,
            "employment_type": row.employment_type,
            "mode": row.mode,
            "user_name": row.user_name,
            "link": row.link,
            "image": row.image,
            "salary": row.salary,
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
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        JobPosting.employment_type,
        JobPosting.mode,
        JobPosting.salary,
        JobPosting.link,
        JobPosting.image,
        User.user_id,
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).join(
        User, JobPosting.user_id == User.user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).filter(
        JobPosting.post_id == job_id
    ).group_by(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        JobPosting.employment_type,
        JobPosting.mode,
        JobPosting.salary,
        User.user_id,
        User.first_name,
        User.last_name
    ).first()
    
    # If no job posting is found, raise a 404 error
    if not query_result:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    # Get tags for the job posting
    tags = db.query(JobPostingTag.tag).filter(JobPostingTag.post_id == job_id).all()
    tag_list = [tag[0] for tag in tags]
    
    # Construct the response
    response = {
        "post_id": query_result.post_id,
        "title": query_result.title,
        "user_id": query_result.user_id,
        "company": query_result.company,
        "description": query_result.description,
        "user_name": query_result.user_name,
        "employment_type": query_result.employment_type,
        "mode": query_result.mode,
        "salary": query_result.salary,
        "link": query_result.link,
        "image": query_result.image,
        "tags": tag_list,
        "interested_count": query_result.interested_count
    }
    
    return response

# Get job postings that are open
@router.get("/admin/job-postings/open", response_model=List[JobPostingForAdminOut])
def get_open_job_postings(
    db: Session = Depends(get_db)
):
    query_result = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.date_posted, 
        JobPosting.company,
        JobPosting.description,
        JobPosting.employment_type,
        JobPosting.mode,
        JobPosting.salary,
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).join(
        User, JobPosting.user_id == User.user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).filter(
        JobPosting.is_closed == False,
        JobPosting.is_deleted == False
    ).group_by(
        JobPosting.post_id, JobPosting.title, JobPosting.date_posted, 'user_name' 
    ).all()
    
    result = []
    for row in query_result:
        result.append({
            "post_id": row.post_id,
            "date_posted": row.date_posted.strftime("%m/%d/%Y") if row.date_posted else None,
            "title": row.title,
            "user_name": row.user_name,
            "company": row.company,
            "description": row.description,
            "employment_type": row.employment_type,
            "mode": row.mode,
            "salary": row.salary,
            "interested_count": row.interested_count
        })
    
    return result

# Get count job postings that are open
@router.get("/admin/job-postings/open/count")
def get_open_job_postings_count(
    db: Session = Depends(get_db)
):
    count = db.query(
        func.count(distinct(JobPosting.post_id))
    ).filter(
        JobPosting.is_closed == False,
        JobPosting.is_deleted == False
    ).scalar()
    
    return {"open_job_postings_count": count}

# Get job postings that are closed
@router.get("/admin/job-postings/closed", response_model=List[JobPostingForAdminOut])
def get_closed_job_postings(
    db: Session = Depends(get_db)
):
    query_result = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.date_posted,
        JobPosting.company,
        JobPosting.description,
        JobPosting.employment_type,
        JobPosting.mode,
        JobPosting.salary, 
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).join(
        User, JobPosting.user_id == User.user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).filter(
        JobPosting.is_closed == True,
        JobPosting.is_deleted == False
    ).group_by(
        JobPosting.post_id, JobPosting.title, JobPosting.date_posted, 'user_name' 
    ).all()
    
    result = []
    for row in query_result:
        result.append({
            "post_id": row.post_id,
            "date_posted": row.date_posted.strftime("%m/%d/%Y") if row.date_posted else None,
            "title": row.title,
            "user_name": row.user_name,
            "company": row.company,
            "description": row.description,
            "employment_type": row.employment_type,
            "mode": row.mode,
            "salary": row.salary,
            "interested_count": row.interested_count
        })
    
    return result

# Get count job postings that are closed
@router.get("/admin/job-postings/closed/count")
def get_closed_job_postings_count(
    db: Session = Depends(get_db)
):
    count = db.query(
        func.count(distinct(JobPosting.post_id))
    ).filter(
        JobPosting.is_closed == True,
        JobPosting.is_deleted == False
    ).scalar()
    
    return {"closed_job_postings_count": count}

@router.get("/admin/job-postings/reported", response_model=List[ReportedJobPostingOut])
def get_reported_job_postings(
    db: Session = Depends(get_db),
):
    
    query_result = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.date_posted, 
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count'),
        func.count(func.distinct(Report.report_id)).label('report_count')
    ).join(
        User, JobPosting.user_id == User.user_id
    ).join(
        Report, Report.reported_post_id == JobPosting.post_id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).filter(
        JobPosting.is_deleted == False
    ).group_by(
        JobPosting.post_id, JobPosting.title, JobPosting.date_posted, 'user_name' 
    ).all()
    
    result = []
    for row in query_result:
        result.append({
            "post_id": row.post_id,
            "date_posted": row.date_posted.strftime("%m/%d/%Y") if row.date_posted else None,
            "title": row.title,
            "user_name": row.user_name,
            "interested_count": row.interested_count,
            "report_count": row.report_count
        })
    
    return result

# Get count job postings that are reported
@router.get("/admin/job-postings/reported/count")
def get_reported_job_postings_count(
    db: Session = Depends(get_db),
):
    count = db.query(
        func.count(distinct(JobPosting.post_id))
    ).join(
        Report, Report.reported_post_id == JobPosting.post_id
    ).filter(
        JobPosting.is_deleted == False
    ).scalar()
    
    return {"reported_job_postings_count": count}


@router.get("/admin/job-postings/top-4-interested")
def get_top_4_interested_job_postings(db: Session = Depends(get_db)):
    # Query to get the top 4 job postings with the most interested users
    query_result = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.date_posted,
        func.concat(User.first_name, ' ', User.last_name).label('user_name'),
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).join(
        User, JobPosting.user_id == User.user_id 
    ).join(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).group_by(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.date_posted,
        User.first_name,
        User.last_name
    ).order_by(
        func.count(func.distinct(JobPostingInterestedIn.user_id)).desc()
    ).limit(4).all()


    result = []
    for row in query_result:
        result.append({
            "post_id": row.post_id,
            "title": row.title,
            "company": row.company,
            "date_posted": row.date_posted.strftime("%m/%d/%Y") if row.date_posted else None,
            "user_name": row.user_name,
            "interested_count": row.interested_count
        })

    return result

@router.get("/admin/job-posts/{post_id}/reports", response_model=List[PostReportDetailOut])
def get_post_reports(post_id: str, db: Session = Depends(get_db)):
    # Get reports for the post
    reports = db.query(
        JobPosting.title,
        JobPosting.company,
        JobPosting.user_id.label("poster_id"),
        Report.created_at.label("date_reported"),
        func.concat(User.first_name, " ", User.last_name).label("reporter_name"),
        Report.reason,
        Report.report_id
    ).join(
        Report, JobPosting.post_id == Report.reported_post_id
    ).join(
        User, User.user_id == Report.reporter_id
    ).filter(
        JobPosting.post_id == post_id
    ).all()

    result = []

    for report in reports:
        attachment = db.query(ReportAttachment.file_url).filter(
            ReportAttachment.report_id == report.report_id
        ).first()

        result.append({
            "title": report.title,
            "company": report.company,
            "user_id": report.poster_id,
            "date_reported": report.date_reported,
            "reporter_name": report.reporter_name,
            "reason": report.reason,
            "attachment": attachment.file_url if attachment else None
        })

    return result