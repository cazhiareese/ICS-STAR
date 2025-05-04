from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from util.alumni_search_autocomplete_logic import (
    get_name_suggestions, 
    get_job_title_suggestions, 
    get_skill_suggestions, 
    get_industry_suggestions, 
    get_city_suggestions,
    get_affiliation_suggestions
    )
from typing import Optional, List, Dict
from config.database import get_db
from typing import List, Optional

router = APIRouter(prefix="/autocomplete", tags=["Alumni Search Autocomplete"])

@router.get("/job-titles", response_model=List[str])
def autocomplete_job_titles(
    q: str = Query(..., min_length=1, description="Search query text"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):

    return get_job_title_suggestions(db, q, limit)

@router.get("/skills", response_model=List[str])
def autocomplete_skills(
    q: str = Query(..., min_length=1, description="Search query text"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):

    return get_skill_suggestions(db, q, limit)

@router.get("/names", response_model=List[str])
def autocomplete_names(
    q: str = Query(..., min_length=1, description="Search query text"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):

    return get_name_suggestions(db, q, limit)

@router.get("/industries", response_model=List[str])
def autocomplete_industries(
    q: str = Query(..., min_length=1, description="Search query text"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):

    return get_industry_suggestions(db, q, limit)

@router.get("/cities", response_model=List[str])
def autocomplete_cities(
    q: str = Query(..., min_length=1, description="Search query text"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    
    return get_city_suggestions(db, q, limit)

@router.get("/affiliations", response_model=List[str])
def autocomplete_affiliations(
    q: str = Query(..., min_length=1, description="Search query text"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    
    return get_affiliation_suggestions(db, q, limit)