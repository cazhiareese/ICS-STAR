from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from util.job_search_logic import search_job, view_interested_in
from schemas.job_search_schema import JobSearchOut, UserInterestedOut
from typing import Optional, List, Dict
from config.database import get_db

router = APIRouter()

@router.get("/job/search", response_model=List[JobSearchOut])
def job_search(
    title: Optional[str] = None,
    company: Optional[str] = None,
    db: Session = Depends(get_db)
):
    
    results = search_job(db, title_string=title, company=company)

    if not results:
        raise HTTPException(status_code=404, detail="No job postings found matching the search criteria.")
    
    return results

@router.get("/job/interested_in/{post_id}", response_model=tuple[list[UserInterestedOut], dict])
def interested_in(
    post_id: str,
    db: Session = Depends(get_db)
):
    
    results = view_interested_in(db, post_id=post_id)

    if not results:
        raise HTTPException(status_code=404, detail="No users found who are interested in this job posting.")
    
    return results