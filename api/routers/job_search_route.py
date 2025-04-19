from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from util.job_search_logic import search_job
from schemas.job_search_schema import JobSearchOut
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