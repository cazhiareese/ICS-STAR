from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File, Query
from sqlalchemy.orm import Session
from config.database import get_db
from typing import List

from util.userutil import upload_profile, get_current_user, verify_password, hash_password

from models.usermodel import User, UserScholarship, UserAffiliation, UserSkill

router = APIRouter()

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    file_path = await upload_profile(file, user, db)

    return {"message": "Profile picture uploaded successfully"}

@router.post("/add-scholarships")
async def add_scholarships(
    scholarships: List[str] = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
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
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
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
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
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
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
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

# Get user profile details
# Arguments: db - SQLAlchemy session, user - current user
@router.get("/profile")
async def get_profile(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    profile_details = {
        "user_id": user.user_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "mobile_number": user.mobile_number,
        "age": user.age,
        "gender": user.gender.value if user.gender else None,
        "city": user.city,
        "state": user.state,
        "country": user.country,
        "marital_status": user.marital_status,
        "image": user.image,
        "user_type": user.user_type.value,
        "position": user.position,
        "is_banned": user.is_banned,
        "student_number": user.student_number,
        "standing": user.standing.value if user.standing else None,
        "graduation_year": user.graduation_year,
        "graduation_semester": user.graduation_semester,
        "employment_status": user.employment_status,
        "industry": user.industry,
        "company_name": user.company_name,
        "job_title": user.job_title,
        "work_location": user.work_location,
        "work_mode": user.work_mode,
        "employer_class": user.employer_class,
        "tenured_status": user.tenured_status,
        "salary_grade": user.salary_grade,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "skills": [skill.skill for skill in user.skills],
        "scholarships": [scholarship.scholarship for scholarship in user.scholarships],
        "affiliations": [
            {"affiliation": aff.affiliation, "role": aff.role} for aff in user.affiliations
        ],
    }
    
    return {"message": "success", "data": profile_details}

# Get user profile details by user ID
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: user profile details
@router.get("/profile/{user_id}")
async def get_profile_by_id(
    db: Session = Depends(get_db),
    user_id: str = None,
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    profile_details = db.query(User).filter(User.user_id == user_id).first()
    
    if not profile_details:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "success", "data": profile_details}

# Update user profile details
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a message confirming the update
@router.put("/profile/edit")
async def update_profile(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    mobile_number: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    country: str = Form(...),
    marital_status: str = Form(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.mobile_number = mobile_number
    user.city = city
    user.state = state
    user.country = country
    user.marital_status = marital_status
    
    db.commit()
    db.refresh(user)
    
    return {"message": "Profile updated successfully"}

# Update user password
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a message confirming the update
@router.put("/profile/change-password")
async def update_password(
    old_password: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    if not verify_password(old_password, user.password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    
    if old_password == new_password:
        raise HTTPException(status_code=400, detail="New password cannot be the same as old password")

    user.password = hash_password(new_password)

    db.commit()
    
    return {"message": "Password updated successfully"}

# Get user profile picture
# Arguments: db - SQLAlchemy session, user - current user
# Returns: the profile picture of the user
@router.get("/profile-picture")
async def get_profile_picture(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    return {"profile_picture": user.image}

# Remove a skill from the user's profile
# Arguments: db - SQLAlchemy session, skill_id - the skill ID
# Returns: a message confirming the removal
@router.delete("/remove-skill/")
async def remove_skill(
    skill: str = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    skill_entry = db.query(UserSkill).filter(UserSkill.user_id == user.user_id, UserSkill.skill == skill).first()
    
    if not skill_entry:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(skill_entry)
    db.commit()
    
    return {"message": "Skill removed successfully"}

# Remove a scholarship from the user's profile
# Arguments: db - SQLAlchemy session, scholarship_id - the scholarship ID
# Returns: a message confirming the removal
@router.delete("/remove-scholarship/")
async def remove_scholarship(
    scholarship: str = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    scholarship_entry = db.query(UserScholarship).filter(UserScholarship.user_id == user.user_id, UserScholarship.scholarship == scholarship).first()
    
    if not scholarship_entry:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    db.delete(scholarship_entry)
    db.commit()
    
    return {"message": "Scholarship removed successfully"}

# Remove an affiliation from the user's profile
# Arguments: db - SQLAlchemy session, affiliation_id - the affiliation ID
# Returns: a message confirming the removal
@router.delete("/remove-affiliation/")
async def remove_affiliation(
    affiliation: str = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    affiliation_entry = db.query(UserAffiliation).filter(UserAffiliation.user_id == user.user_id, UserAffiliation.affiliation == affiliation).first()
    
    if not affiliation_entry:
        raise HTTPException(status_code=404, detail="Affiliation not found")
    
    db.delete(affiliation_entry)
    db.commit()
    
    return {"message": "Affiliation removed successfully"}

# Remove a profile picture from the user's profile
# Arguments: db - SQLAlchemy session
# Returns: a message confirming the removal
@router.delete("/remove-profile-picture")
async def remove_profile_picture(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    user.image = None
    db.commit()
    
    return {"message": "Profile picture removed successfully"}