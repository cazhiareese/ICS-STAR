from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import String, func, or_, union_all
from sqlalchemy.sql import distinct
from models.usermodel import User
from models.job_posting_model import JobPosting, JobPostingTag, JobPostingInterestedIn, AppliesFor
from schemas.job_search_schema import JobSearchOut
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