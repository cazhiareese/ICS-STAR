from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import String, func, or_, union_all
from sqlalchemy.sql import distinct
from models.usermodel import User
from models.job_posting_model import JobPosting, JobPostingTag, JobPostingInterestedIn, AppliesFor
from schemas.job_search_schema import JobSearchOut, UserInterestedOut
import datetime
from uuid import UUID

def search_job(
        db: Session,
        title_string: str = "",
        company: str = ""
) -> list[JobSearchOut]:
    
    # Base query
    query = db.query(
    JobPosting.post_id,
    JobPosting.title,
    JobPosting.company,
    JobPosting.description,
    func.concat(User.first_name, ' ', User.last_name).label("posted_by"),
    func.count(JobPostingInterestedIn.post_id).label("interested_in")
    ).join(
        User, User.user_id == JobPosting.user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPostingInterestedIn.post_id == JobPosting.post_id
    ).filter(
        JobPosting.is_deleted == False
    ).group_by(
        JobPosting.post_id, User.first_name, User.last_name
    )

    # Apply search filter if provided
    if title_string:
        query = query.filter(JobPosting.title.ilike(f"%{title_string}%"))

    if company:
        query = query.filter(JobPosting.company.ilike(f"%{company}%"))

    jobs = query.all()

    if not jobs:
        return []

    jobs_out_list = []

    for job in jobs:
        job_out = JobSearchOut(
            id=job.post_id,
            title=job.title,
            company=job.company,
            description=job.description,
            posted_by=job.posted_by,
            interested_in=job.interested_in
        )
        jobs_out_list.append(job_out)

    return jobs_out_list

def view_interested_in(
        db: Session,
        post_id: UUID
) -> tuple[list[UserInterestedOut], dict]:
    
    # Query to get the overview info about the job (title, company, job poster, job poster's location, total number of interested users, date of creation)
    job_info_query = db.query(
        JobPosting.title,
        JobPosting.company,
        JobPosting.created_at,
        func.concat(User.first_name, ' ', User.last_name).label("posted_by"),
        func.concat(User.state, ', ', User.country).label("poster_location"),
        func.count(JobPostingInterestedIn.post_id).label("total_interested")
    ).join(
        User, User.user_id == JobPosting.user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPostingInterestedIn.post_id == JobPosting.post_id
    ).filter(
        JobPosting.post_id == post_id
    ).group_by(
        JobPosting.post_id, User.first_name, User.last_name, User.state, User.country
    ).first()
    
    # Base query for interested users
    query = db.query(
        User.user_id,
        func.concat(User.first_name, ' ', User.last_name).label("name"),
        User.student_number,
        func.concat(User.state, ', ', User.country).label("location"),
        User.industry,
        User.image,
        JobPosting.title,
        JobPostingInterestedIn.created_at
    ).join(
        JobPostingInterestedIn, JobPostingInterestedIn.user_id == User.user_id
    ).join(
        JobPosting, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).filter(
        JobPostingInterestedIn.post_id == post_id
    )

    interested_users = query.all()

    if not interested_users:
        return [], {}

    interested_out_list = []

    for user in interested_users:
        user_out = UserInterestedOut(
            id=user.user_id,
            name=user.name,
            batch=user.student_number[:4],
            image=f"{STORAGE_STRING}{user.image}" if user.image else None,
            location=user.location,
            title=user.title,
            industry=user.industry,
            date_of_interest=user.created_at.strftime("%m/%d/%Y") if user.created_at else None
        )
        interested_out_list.append(user_out)

    job_summary = {
        "title": job_info_query.title if job_info_query else None,
        "company": job_info_query.company if job_info_query else None,
        "posted_by": job_info_query.posted_by if job_info_query else None,
        "poster_location": job_info_query.poster_location if job_info_query else None,
        "total_interested": job_info_query.total_interested if job_info_query else 0,
        "created_at": job_info_query.created_at.strftime("%B %d, %Y") if job_info_query else None
    }

    return interested_out_list, job_summary