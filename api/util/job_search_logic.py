from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import String, func, or_, union_all
from sqlalchemy.sql import distinct
from models.usermodel import User
from models.job_posting_model import JobPosting, JobPostingTag, JobPostingInterestedIn, AppliesFor
from schemas.job_search_schema import JobSearchOut, UserInterestedOut, JobPostingOverviewOut, PaginatedJobSearchResponse
import datetime
from uuid import UUID
import csv
from io import StringIO
from fastapi import Response, HTTPException, Depends
from typing import Optional


def admin_search_job(
    db: Session,
    title: str = "",
    creator_name: str = "",
    tag: str = "",
    company: str = "",
    employment_type: str = "",
    mode_options: str = "",
    min_salary: int = 0,
    max_salary: int = 0,
    sort_by: str = "date_desc",
    page: int = 1,
    page_size: int = 10
) -> PaginatedJobSearchResponse:
    # Calculate offset
    offset = (page - 1) * page_size

    # Start with a base query to get matching post_ids and count total items
    post_query = db.query(JobPosting.post_id)\
        .join(User, User.user_id == JobPosting.user_id)\
        .filter(JobPosting.is_deleted == False)

    # Apply optional filters
    if title:
        post_query = post_query.filter(JobPosting.title.ilike(f"%{title}%"))

    if creator_name:
        post_query = post_query.filter(func.concat(User.first_name, ' ', User.last_name).ilike(f"%{creator_name}%"))

    if company:
        post_query = post_query.filter(JobPosting.company.ilike(f"%{company}%"))
        
    if employment_type:
        employment_types_list = [e_type.strip() for e_type in employment_type.split(',') if e_type.strip()]
        if employment_types_list:
            post_query = post_query.filter(or_(*[JobPosting.employment_type == e_type for e_type in employment_types_list]))

    if mode_options:
        mode_options_list = [mode.strip() for mode in mode_options.split(',') if mode.strip()]
        if mode_options_list:
            post_query = post_query.filter(or_(*[JobPosting.mode == mode for mode in mode_options_list]))

    if min_salary:
        post_query = post_query.filter(JobPosting.salary >= min_salary)

    if max_salary:
        post_query = post_query.filter(JobPosting.salary <= max_salary)

    if tag:
        tags_list = [t.strip() for t in tag.split(',') if t.strip()]
        if tags_list:
            tag_post_ids = db.query(JobPostingTag.post_id).filter(or_(*[JobPostingTag.tag.ilike(f"%{t}%") for t in tags_list])).distinct()
            post_query = post_query.filter(JobPosting.post_id.in_(tag_post_ids))
    
    # Get total count of matching posts for pagination
    total_items = post_query.count()
    total_pages = (total_items + page_size - 1) // page_size  # Ceiling division

    # Get matching post_ids with pagination
    matching_post_ids = [post_id for (post_id,) in post_query.offset(offset).limit(page_size).all()]
    
    if not matching_post_ids:
        return {
            "success": "No job postings found matching the search criteria",
            "page": page,
            "total_pages": total_pages,
            "result": []
        }
    
    # Create the detailed query for job postings
    query = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        JobPosting.created_at,
        JobPosting.employment_type,
        JobPosting.mode,
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
    
    # Fetch all tags for matching posts
    all_tags = db.query(JobPostingTag.post_id, JobPostingTag.tag).filter(JobPostingTag.post_id.in_(matching_post_ids)).all()
    
    # Organize tags by post_id
    tags_by_post = {}
    for post_id, tag in all_tags:
        if post_id not in tags_by_post:
            tags_by_post[post_id] = []
        tags_by_post[post_id].append(tag)
    
    # Build response
    jobs_out_list = []
    for job in jobs:
        job_out = JobSearchOut(
            post_id=job.post_id,
            title=job.title,
            company=job.company,
            description=job.description,
            employment_type=job.employment_type,
            mode=job.mode,
            posted_by=job.posted_by,
            created_at=job.created_at.strftime("%m/%d/%Y") if job.created_at else None,
            interested_in=job.interested_in,
            tags=tags_by_post.get(job.post_id, [])
        )
        jobs_out_list.append(job_out)

    return {
        "success": "Job postings retrieved successfully",
        "page": page,
        "total_pages": total_pages,
        "result": jobs_out_list
    }

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

def add_user_interested(
        db: Session,
        user_id: UUID,
        post_id: UUID
) -> dict:
    
    query = db.query(JobPostingInterestedIn).filter(JobPostingInterestedIn.user_id == user_id,JobPostingInterestedIn.post_id == post_id).first()

    if query:
        return False

    # Add the user to the interested list
    new_interest = JobPostingInterestedIn(user_id=user_id, post_id=post_id)
    db.add(new_interest)
    db.commit()
    db.refresh(new_interest)

    print(f"User {user_id} added to interested list for post {post_id}.")

    success_message = {
        "success": True,
        "message": "User added to interested list successfully.",
        "user_id": user_id,
        "post_id": post_id
    }

    return success_message

def remove_user_interested(
        db: Session,
        user_id: UUID,
        post_id: UUID
) -> dict:
    
    query = db.query(JobPostingInterestedIn).filter(JobPostingInterestedIn.user_id == user_id, JobPostingInterestedIn.post_id == post_id).first()

    if query:
        # Remove the user from the interested list
        db.delete(query)
        db.commit()
        success_message = {
            "success": True,
            "message": "User removed from interested list successfully.",
            "user_id": user_id,
            "post_id": post_id
        }
        return success_message
    else:
        error_message = {
            "success": False,
            "message": "User not found in interested list.",
            "user_id": user_id,
            "post_id": post_id
        }
        return error_message
    
def check_user_interested(
        db: Session,
        user_id: UUID,
        post_id: UUID
) -> bool:
    
    # Check if the user is already in the interested list
    query = db.query(JobPostingInterestedIn).filter(JobPostingInterestedIn.user_id == user_id, JobPostingInterestedIn.post_id == post_id).first()

    if query:
        return True
    else:
        return False

def get_all_user_interested_by_name_alphabetical(
        db: Session,
        post_id: UUID
) -> list[UserInterestedOut]:
    
    # Query to get all interested users sorted by name
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
    ).order_by(func.concat(User.first_name, ' ', User.last_name).asc())

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

def get_all_user_interested_by_name_reverse(
        db: Session,
        post_id: UUID
) -> list[UserInterestedOut]:
    
    # Query to get all interested users sorted by name in reverse
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
    ).order_by(func.concat(User.first_name, ' ', User.last_name).desc())

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

def get_all_user_interested_by_batch_descending(
        db: Session,
        post_id: UUID
) -> list[UserInterestedOut]:
    
    # Student number is first four characters of the user_id

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

    # Sort by batch (first four characters of student_number) in descending order

    interested_out_list.sort(key=lambda x: x.batch, reverse=True)

    return interested_out_list

def get_all_user_interested_by_batch_ascending(
        db: Session,
        post_id: UUID
) -> list[UserInterestedOut]:
    
    # Student number is first four characters of the user_id

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

    # Sort by batch (first four characters of student_number) in ascending order

    interested_out_list.sort(key=lambda x: x.batch)

    return interested_out_list

def get_all_user_interested_by_date_of_interest_newest(
        db: Session,
        post_id: UUID
) -> list[UserInterestedOut]:
    
    # Query to get all interested users sorted by date of interest (newest first)
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
    ).order_by(JobPostingInterestedIn.created_at.desc())

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

def get_all_user_interested_by_date_of_interest_oldest(
        db: Session,
        post_id: UUID
) -> list[UserInterestedOut]:
    
    # Query to get all interested users sorted by date of interest (oldest first)
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
    ).order_by(JobPostingInterestedIn.created_at.asc())

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

def generate_interested_users_csv(
    db: Session,
    post_id: UUID
) -> Response:
   
    users = view_interested_in(db, post_id)
    
    # Get job information for the CSV filename
    job_info = job_overview(db, post_id)
    job_title = job_info.title if job_info else "job-posting"
    safe_job_title = "".join(c if c.isalnum() else "-" for c in job_title)
    
    # Create a CSV in memory
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header row
    writer.writerow(["Name", "Batch", "Location", "Industry", "Date of Interest"])
    
    # Write data rows
    for user in users:
        writer.writerow([
            user.name,
            user.batch,
            user.location,
            user.industry,
            user.date_of_interest
        ])
    
    # Create response with CSV content
    response = Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={safe_job_title}-interested-users.csv"
        }
    )
    
    return response
