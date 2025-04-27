from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from util.job_search_logic import admin_search_job, view_interested_in, job_overview, get_current_interested, add_user_interested, get_all_user_interested_by_batch_ascending, get_all_user_interested_by_batch_descending, get_all_user_interested_by_date_of_interest_newest, get_all_user_interested_by_date_of_interest_oldest, get_all_user_interested_by_name_alphabetical, get_all_user_interested_by_name_reverse, generate_interested_users_csv
from schemas.job_search_schema import JobSearchOut, UserInterestedOut, JobPostingOverviewOut
from typing import Optional, List, Dict
from config.database import get_db
from uuid import UUID

router = APIRouter(tags=["Job Search"])

@router.get("/admin/job/search", response_model=List[JobSearchOut])
def job_search(
    creator_name : Optional[str] = "",
    tag: Optional[str] = "",
    company: Optional[str] = "",
    employment_type: Optional[str] = "",
    sort_by: Optional[str] = "date_desc",
    db: Session = Depends(get_db)
):
    
    results = admin_search_job(db, creator_name=creator_name, employment_type=employment_type, company=company, tag=tag, sort_by=sort_by)

    if not results:
        raise HTTPException(status_code=404, detail="No job postings found matching the search criteria.")
    
    return results

@router.put("/job/add-user-interested/{post_id}", response_model=dict)
def add_user_interested_route(
    post_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db)
):
    
    result = add_user_interested(db, post_id=post_id, user_id=user_id)

    if not result:
        raise HTTPException(status_code=404, detail="Failed to add user interested in the job posting. Please check if the job posting exists or if the User/Post IDs are valid.")
    
    return result

@router.get("/job/interested_in/{post_id}", response_model=list[UserInterestedOut])
def interested_in(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = view_interested_in(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results

@router.get("/job/interested_in/{post_id}/batch-ascending", response_model=List[UserInterestedOut])
def interested_in_batch_ascending(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = get_all_user_interested_by_batch_ascending(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results

@router.get("/job/interested_in/{post_id}/batch-descending", response_model=List[UserInterestedOut])
def interested_in_batch_descending(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = get_all_user_interested_by_batch_descending(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results

@router.get("/job/interested_in/{post_id}/date-of-interest-newest", response_model=List[UserInterestedOut])
def interested_in_date_of_interest_newest(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = get_all_user_interested_by_date_of_interest_newest(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results

@router.get("/job/interested_in/{post_id}/date-of-interest-oldest", response_model=List[UserInterestedOut])
def interested_in_date_of_interest_oldest(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = get_all_user_interested_by_date_of_interest_oldest(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results

@router.get("/job/interested_in/{post_id}/name-alphabetical", response_model=List[UserInterestedOut])
def interested_in_name_alphabetical(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = get_all_user_interested_by_name_alphabetical(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results

@router.get("/job/interested_in/{post_id}/name-reverse", response_model=List[UserInterestedOut])
def interested_in_name_reverse(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = get_all_user_interested_by_name_reverse(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results


@router.get("/job/overview/{post_id}", response_model=JobPostingOverviewOut)
def job_overview_route(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = job_overview(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="Job posting not found.")
    
    return results

@router.get("/job/new-interested/{post_id}", response_model=list[UserInterestedOut])
def view_new_interested(
    post_id: str,
    db: Session = Depends(get_db)
):
    results = get_current_interested(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No new interested users found.")
    
    return results

@router.get("/job/generate-interested-csv/{post_id}/")
def admin_get_interested_users(
    post_id: UUID,
    db: Session = Depends(get_db),
):
    return generate_interested_users_csv(db, post_id)