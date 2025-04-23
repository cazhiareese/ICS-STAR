from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import String, func, or_, union_all
from sqlalchemy.sql import distinct
from models.usermodel import User
from models.job_posting_model import JobPosting, JobPostingTag, JobPostingInterestedIn, AppliesFor
from schemas.job_search_schema import JobSearchOut, UserInterestedOut, JobPostingOverviewOut
import datetime
from uuid import UUID

def search_job(
        db: Session,
        creator_name: str = "",
        tag: str = "",
        company: str = "",
        employment_type: str = "",
        sort_by: str = "date_desc"
) -> list[JobSearchOut]:
    
    # Start with a base query
    post_query = db.query(JobPosting.post_id)\
        .join(User, User.user_id == JobPosting.user_id)\
        .filter(JobPosting.is_deleted == False)

    # Apply optional filters
    if creator_name:
        post_query = post_query.filter(func.concat(User.first_name, ' ', User.last_name).ilike(f"%{creator_name}%"))

    if company:
        post_query = post_query.filter(JobPosting.company.ilike(f"%{company}%"))
        
    if employment_type:
        post_query = post_query.filter(JobPosting.employment_type == employment_type)

    if tag:
        tags_list = [t.strip() for t in tag.split(',') if t.strip()]
        
        if tags_list:
            tag_post_ids = db.query(JobPostingTag.post_id).filter(or_(*[JobPostingTag.tag.ilike(f"%{t}%") for t in tags_list])).distinct()
            
            post_query = post_query.filter(JobPosting.post_id.in_(tag_post_ids))
    
    matching_post_ids = [post_id for (post_id,) in post_query.all()]
    
    if not matching_post_ids:
        return []
    
    # Now we create the bigger query
    query = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        JobPosting.created_at,
        JobPosting.employment_type,
        func.concat(User.first_name, ' ', User.last_name).label("posted_by"),
        func.count(JobPostingInterestedIn.post_id).label("interested_in")
    ).join(
        User, User.user_id == JobPosting.user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPostingInterestedIn.post_id == JobPosting.post_id
    ).filter(
        JobPosting.post_id.in_(matching_post_ids)
    ).group_by(
        JobPosting.post_id, User.first_name, User.last_name
    )
    
    # Apply sorting based on sort_by parameter
    if sort_by == "date_desc":
        query = query.order_by(JobPosting.created_at.desc())
    elif sort_by == "date_asc":
        query = query.order_by(JobPosting.created_at.asc())
    elif sort_by == "creator_asc":
        query = query.order_by(func.concat(User.first_name, ' ', User.last_name).asc())
    elif sort_by == "interested_desc":
        query = query.order_by(func.count(JobPostingInterestedIn.post_id).desc())
    elif sort_by == "interested_asc":
        query = query.order_by(func.count(JobPostingInterestedIn.post_id).asc())

    jobs = query.all()
    
    all_tags = db.query(JobPostingTag.post_id, JobPostingTag.tag).filter(JobPostingTag.post_id.in_(matching_post_ids)).all()
    
    # Organize tags by post_id
    tags_by_post = {}
    for post_id, tag in all_tags:
        if post_id not in tags_by_post:
            tags_by_post[post_id] = []
        tags_by_post[post_id].append(tag)
    
    jobs_out_list = []
    for job in jobs:
        job_out = JobSearchOut(
            id=job.post_id,
            title=job.title,
            company=job.company,
            description=job.description,
            employment_type=job.employment_type,
            posted_by=job.posted_by,
            created_at=job.created_at.strftime("%m/%d/%Y") if job.created_at else None,
            interested_in=job.interested_in,
            tags=tags_by_post.get(job.post_id, [])
        )
        jobs_out_list.append(job_out)

    return jobs_out_list

def view_interested_in(
        db: Session,
        post_id: UUID
) -> list[UserInterestedOut]:
    
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
        return []

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

    return interested_out_list

def job_overview(
        db: Session,
        post_id: UUID
) -> JobPostingOverviewOut:
    
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

    if not job_info_query:
        return None
    
    job_info = JobPostingOverviewOut(
        title=job_info_query.title,
        company=job_info_query.company,
        posted_by=job_info_query.posted_by,
        poster_location=job_info_query.poster_location,
        total_interested=job_info_query.total_interested,
        created_at=job_info_query.created_at.strftime("%m/%d/%Y") if job_info_query.created_at else None
    )

    return job_info

def get_current_interested(
        db: Session,
        post_id: UUID,
) -> list[UserInterestedOut]:
    
    # Same as view_interested_in but get only those created today
    today = datetime.datetime.now(datetime.timezone.utc).date()
    start_of_today = datetime.datetime.combine(today, datetime.time.min)
    end_of_today = datetime.datetime.combine(today, datetime.time.max)
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
        JobPostingInterestedIn.post_id == post_id,
        JobPostingInterestedIn.created_at.between(start_of_today, end_of_today)
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
            image=f"{STORAGE_STRING}{user.image}" if user.image else None,
            location=user.location,
            title=user.title,
            industry=user.industry,
            date_of_interest=user.created_at.strftime("%m/%d/%Y") if user.created_at else None
        )
        interested_out_list.append(user_out)

    return interested_out_list