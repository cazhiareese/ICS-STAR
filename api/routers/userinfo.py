from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File, Query
from sqlalchemy.orm import Session
from config.database import get_db
from typing import List

from util.userutil import upload_profile, get_current_user

from models.usermodel import User, UserScholarship, UserAffiliation, UserSkill

router = APIRouter()

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    file_path = await upload_profile(file, user, db)
    if file_path.error:
        raise HTTPException(status_code=500, detail="Error uploading file")

    return {"message": "Profile picture uploaded successfully"}

@router.post("/add-scholarships")
async def add_scholarships(
    scholarships: List[str] = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    new_scholarships = [
        UserScholarship(user_id=user.user_id, scholarship=scholarship)
        for scholarship in scholarships
    ]
    
    db.add_all(new_scholarships)
    db.commit()
    
    return {"message": "scholarships added successfully"}

@router.post("/add-affiliations")
async def add_affiliations(
    affiliations: List[str] = Query(...),
    roles: List[str] = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if len(affiliations) != len(roles):
        raise HTTPException(status_code=400, detail="Invalid input")

    new_affiliations = [
        UserAffiliation(user_id=user.user_id, affiliation=affiliation, role=role) for affiliation, role in zip(affiliations, roles)
    ]
    
    db.add_all(new_affiliations)
    db.commit()
    
    return {"message": "affiliations added successfully"}

@router.post("/add-skills")
async def add_skills(
    skills: List[str] = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    new_skills = [UserSkill(user_id=user.user_id, skill=skill) for skill in skills]
    
    db.add_all(new_skills)
    db.commit()
    
    return {"message": "skills added successfully"}

@router.put("/update-employment")
async def update_employment(
    industry: str = Form(...),
    employment_status: str = Form(...),
    company_name: str = Form(...),
    job_title: str = Form(...),
    country: str = Form(...),
    city: str = Form(...),
    work_mode: str = Form(...),
    employer_class: str = Form(...),
    tenured_status: str = Form(...),
    salary_grade: str = Form(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.user_type.value == "student":
        raise HTTPException(status_code=400, detail="For alumni only")
    
    user.industry = industry
    user.employment_status = employment_status
    user.company_name = company_name
    user.job_title = job_title
    user.work_location = f"{city}, {country}"
    user.work_mode = work_mode
    user.employer_class = employer_class
    user.tenured_status = tenured_status
    user.salary_grade = salary_grade
    db.commit()
    db.refresh(user)
    return {"message": "employment details updated successfully"}