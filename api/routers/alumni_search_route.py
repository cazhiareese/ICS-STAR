from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from util.alumni_search_logic import logic_search_alumni
from typing import Optional, List, Dict
from config.database import get_db

router = APIRouter()

@router.get("/alumni/search", response_model=List[Dict])
def search_alumni(
    name: Optional[str] = None,
    graduation_year: Optional[int] = None,
    job_title: Optional[str] = None,
    city: Optional[str] = None,
    skill: Optional[str] = None,
    industry: Optional[str] = None,
    batch: Optional[str] = None,
    affiliation: Optional[str] = None,
    db: Session = Depends(get_db)
):
    
    results = logic_search_alumni(db, name=name, graduation_year=graduation_year, job_title=job_title, city=city, skill=skill, industry=industry, batch=batch, affiliation=affiliation)
    
    # Raise 404 if no results found
    if not results:
        raise HTTPException(status_code=404, detail="No alumni found matching the search criteria")
    
    return results