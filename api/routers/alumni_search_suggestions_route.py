from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from util.alumni_search_suggestions_logic import ( 
    get_top_job_titles, 
    get_top_skills, 
    get_top_cities, 
    get_top_industries,
    get_all_cities,
    get_all_industries,
    get_all_job_titles,
    get_all_skills,
    get_all_affiliations
    )
from typing import Optional, List, Dict
from config.database import get_db
from typing import List, Optional

router = APIRouter(prefix="/suggestions", tags=["suggestions"])

@router.get("/top-job-titles", response_model=List[str])
def autocomplete_top_job_titles(db: Session = Depends(get_db)):
    return get_top_job_titles(db)

@router.get("/top-skills", response_model=List[str])
def autocomplete_top_skills(db: Session = Depends(get_db)):
    return get_top_skills(db)

@router.get("/top-cities", response_model=List[str])
def autocomplete_top_cities(db: Session = Depends(get_db)):
    return get_top_cities(db)

@router.get("/top-industries", response_model=List[str])
def autocomplete_top_industries(db: Session = Depends(get_db)):
    return get_top_industries(db)

@router.get("/top-affiliations", response_model=List[str])
def autocomplete_top_affiliations(db: Session = Depends(get_db)):
    return get_all_affiliations(db)

@router.get("/all-job-titles", response_model=List[str])
def autocomplete_all_job_titles(db: Session = Depends(get_db)):
    return get_all_job_titles(db)

@router.get("/all-skills", response_model=List[str])
def autocomplete_all_skills(db: Session = Depends(get_db)):
    return get_all_skills(db)

@router.get("/all-cities", response_model=List[str])
def autocomplete_all_cities(db: Session = Depends(get_db)):
    return get_all_cities(db)

@router.get("/all-industries", response_model=List[str])
def autocomplete_all_industries(db: Session = Depends(get_db)):
    return get_all_industries(db)

@router.get("/all-affiliations", response_model=List[str])
def autocomplete_all_affiliations(db: Session = Depends(get_db)):
    return get_all_affiliations(db)