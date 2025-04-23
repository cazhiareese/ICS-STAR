from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from util.job_search_logic import search_job, view_interested_in, job_overview, get_current_interested
from schemas.job_search_schema import JobSearchOut, UserInterestedOut, JobPostingOverviewOut
from typing import Optional, List, Dict
from config.database import get_db

router = APIRouter(tags=["Job Search"])

@router.get("/job/search", response_model=List[JobSearchOut])
def job_search(
    creator_name : Optional[str] = "",
    tag: Optional[str] = "",
    company: Optional[str] = "",
    employment_type: Optional[str] = "",
    sort_by: Optional[str] = "date_desc",
    db: Session = Depends(get_db)
):
    
    results = search_job(db, creator_name=creator_name, employment_type=employment_type, company=company, tag=tag, sort_by=sort_by)

    if not results:
        raise HTTPException(status_code=404, detail="No job postings found matching the search criteria.")
    
    return results

@router.get("/job/interested_in/{post_id}", response_model=list[UserInterestedOut])
def interested_in(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = view_interested_in(db, post_id=post_id)

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