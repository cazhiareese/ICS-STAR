from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from util.alumni_search import logic_search_alumni
from typing import Optional, List, Dict
from config.database import get_db

router = APIRouter()

@router.get("/alumni/search", response_model=List[Dict])
def search_alumni(
    name: Optional[str] = None,
    graduation_year: Optional[int] = None,
    job_title: Optional[str] = None,
    work_location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    
    results = logic_search_alumni(db, name=name, graduation_year=graduation_year, job_title=job_title, work_location=work_location)
    
    # Raise 404 if no results found
    if not results:
        raise HTTPException(status_code=404, detail="No alumni found matching the search criteria")
    
    return results