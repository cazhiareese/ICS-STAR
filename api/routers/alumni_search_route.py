from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from util.alumni_search_logic import logic_search_alumni
from typing import Optional, List, Dict
from config.database import get_db

router = APIRouter(tags=["Alumni Search"])

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
    try:
        results = logic_search_alumni(db, name=name, graduation_year=graduation_year, job_title=job_title, city=city, skill=skill, industry=industry, batch=batch, affiliation=affiliation)
        if not results:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Internal server error: {e}')
    
    
    return results