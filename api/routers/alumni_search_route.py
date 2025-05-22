from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.usermodel import User, UserAffiliation, UserSkill, UserTypeEnum
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

@router.get("/alumni/search-first-10", response_model=List[Dict])
def get_first_10_alumni(
    db: Session = Depends(get_db)
):
    try:
        results = db.query(
            User.user_id,
            User.first_name,
            User.last_name,
            User.student_number,
            User.graduation_year,
            User.job_title,
            User.industry,
            User.city,
            User.email,
            User.image,
            User.facebook,
            User.linkedin,
            User.github
        ).filter(User.is_onboarded == True, User.user_type == UserTypeEnum.alumni).limit(10).all()

        user_ids = [result.user_id for result in results]
    
        # Batch fetch skills for all users
        all_skills = db.query(UserSkill.user_id, UserSkill.skill).filter(UserSkill.user_id.in_(user_ids)).all()

        skills_by_user = {}
        for user_id, skill in all_skills:
            if user_id not in skills_by_user:
                skills_by_user[user_id] = []
            skills_by_user[user_id].append(skill)

                # Batch fetch affiliations for all users
        all_affiliations = db.query(UserAffiliation.user_id, UserAffiliation.affiliation).filter(UserAffiliation.user_id.in_(user_ids)).all()
        
        # Organize affiliations by user_id
        affiliations_by_user = {}
        for user_id, affiliation in all_affiliations:
            if user_id not in affiliations_by_user:
                affiliations_by_user[user_id] = []
            affiliations_by_user[user_id].append(affiliation)

        alum_list = []
        for alum in results:
            user_id = alum.user_id
            alum_dict = {
                "user_id": str(user_id),
                "full_name": f"{alum.first_name} {alum.last_name}",
                "batch": alum.student_number[:4] if alum.student_number else None,
                "graduation_year": alum.graduation_year,
                "job_title": alum.job_title,
                "industry": alum.industry,
                "skills": skills_by_user.get(user_id, None),
                "location": alum.city,
                "email": alum.email,
                "picture": alum.image,
                "affiliations": affiliations_by_user.get(user_id, None),
                "facebook": alum.facebook,
                "linkedin": alum.linkedin,
                "github": alum.github,
            }
            alum_list.append(alum_dict)
        if not results:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Internal server error: {e}')
    
    return alum_list