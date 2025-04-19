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
) -> list[UserInterestedOut]:
    
    # Base query
    query = db.query(
        User.user_id,
        func.concat(User.first_name, ' ', User.last_name).label("name"),
        User.student_number,
        func.concat(User.state, ', ', User.country).label("location"),
        User.industry,
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
        return []

    interested_out_list = []

    for user in interested_users:
        user_out = UserInterestedOut(
            id=user.user_id,
            name=user.name,
            batch=user.student_number[:4],
            location=user.location,
            title=user.title,
            industry=user.industry,
            date_of_interest=user.created_at.strftime("%m/%d/%Y") if user.created_at else None
        )
        interested_out_list.append(user_out)

    return interested_out_list