from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File, Query
from sqlalchemy.orm import Session
from config.database import get_db
from typing import List, Optional

from util.userutil import upload_profile, get_current_user, verify_password, hash_password, get_org_suggestion, process_student_onboarding, process_alumni_onboarding
from util.donation_util import get_user_monetary_donations, get_user_in_kind_donations, get_user_donations, get_user_in_kind_donations_acknowledged, get_user_monetary_donations_acknowledged, get_user_donation_history_details
from models.usermodel import User, UserScholarship, UserAffiliation, UserSkill, UnemploymentReason
from models.job_posting_model import JobPosting

from schemas.user import UserEmploymentStatus, UserTypeEnum, UnemploymentReasonEnum, UserStandingEnum

from uuid import UUID

router = APIRouter()

@router.get("/get-org")
def get_org(
    q: str = Query(..., min_length=1, description="Search org"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):

    return get_org_suggestion(db, q, limit)

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
    primt(new_skills)
    return {"message": "skills added successfully"}

@router.post("/onboarding-info-student")
async def onboarding_student(
    standing: Optional[UserStandingEnum] = Form(None),
    scholarships: Optional[List[str]] = Query(None),
    affiliations: Optional[List[str]] = Query(None),
    roles: Optional[List[str]] = Query(None),
    skills: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    process_student_onboarding(
        user=user,
        db=db,
        standing=standing,
        scholarships=scholarships,
        affiliations=affiliations,
        roles=roles,
        skills=skills,
    )

    return {"message": "onboarding details updated successfully"}


@router.post("/onboarding-info-alum")
async def onboarding_info(
    scholarships: Optional[List[str]] = Query(None),
    affiliations: Optional[List[str]] = Query(None),
    roles: List[str] = Query(None),
    industry: str = Form(None),
    employment_status: UserEmploymentStatus = Form(None),
    reasons: Optional[List[UnemploymentReasonEnum]] = Query(None),
    company_name: str = Form(None),
    job_title: str = Form(None),
    country: str = Form(None),
    city: str = Form(None),
    work_mode: str = Form(None),
    employer_class: str = Form(None),
    tenured_status: str = Form(None),
    salary_grade: str = Form(None),
    skills: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    process_alumni_onboarding(
        user=user,
        db=db,
        scholarships=scholarships,
        affiliations=affiliations,
        roles=roles,
        industry=industry,
        employment_status=employment_status,
        reasons=reasons,
        company_name=company_name,
        job_title=job_title,
        country=country,
        city=city,
        work_mode=work_mode,
        employer_class=employer_class,
        tenured_status=tenured_status,
        salary_grade=salary_grade,
        skills=skills
    )
    
    return {"message": "onboarding details updated successfully"}

@router.put("/update-employment")
async def update_employment(
    industry: str = Form(...),
    employment_status: UserEmploymentStatus = Form(...),
    reasons: Optional[List[UnemploymentReasonEnum]] = Query(None),
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
    
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")

    if reasons:
        unemployment_reasons = [
            UnemploymentReason(user_id=user.user_id, reason=reason.value)
            for reason in reasons
        ]
        db.add_all(unemployment_reasons)
        db.commit()
    
    user.industry = industry
    user.employment_status = employment_status.value
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
        "facebook": user.facebook,
        "linkedin": user.linkedin,
        "github": user.github,
        "is_verified": user.is_verified,
        "verification_file": user.verification_file,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "skills": [skill.skill for skill in user.skills],
        "scholarships": [scholarship.scholarship for scholarship in user.scholarships],
        "affiliations": [
            {"affiliation": aff.affiliation, "role": aff.role} for aff in user.affiliations
        ],
    }
    print(profile_details)
    
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
    
    print(profile_details)
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
    facebook: str = Form(...),
    linkedin: str = Form(...),
    github: str = Form(...),
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
    user.facebook = facebook
    user.linkedin = linkedin
    user.github = github
    
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

# Get the donation history of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of donations made by the user
@router.get("/donation-history/all")
async def get_donation_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")

    donations = get_user_donations(db, user.user_id)

    return {"message": "success", "data": donations}

# Get the monetary donations of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of monetary donations made by the user
@router.get("/donation-history/monetary-donations")
async def get_monetary_donations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    monetary_donations = get_user_monetary_donations(db, user.user_id)

    return {"message": "success", "data": monetary_donations}

# Get the in-kind donations of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of in-kind donations made by the user
@router.get("/donation-history/in-kind-donations")
async def get_in_kind_donations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    in_kind_donations = get_user_in_kind_donations(db, user.user_id)

    return {"message": "success", "data": in_kind_donations}

# Get the monetary donation history of the user that has been acknowledged
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of acknowledged donations made by the user
@router.get("/donation-history/monetary-donations/acknowledged")
async def get_acknowledged_monetary_donations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    acknowledged_monetary_donations = get_user_monetary_donations_acknowledged(db, user.user_id)

    return {"message": "success", "data": acknowledged_monetary_donations}

# Get the in-kind donation history of the user that has been acknowledged
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of acknowledged donations made by the user
@router.get("/donation-history/in-kind-donations/acknowledged")
async def get_acknowledged_in_kind_donations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    acknowledged_in_kind_donations = get_user_in_kind_donations_acknowledged(db, user.user_id)

    return {"message": "success", "data": acknowledged_in_kind_donations}

# Get the donation history of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of donations made by the user with acknowledgment status
@router.get("/donation-history")
async def get_donation_history_me(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    donations = get_user_donation_history_details(db, user.user_id)

    return {"message": "success", "data": donations}

# Update the facebook, linkedin, and github links of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a message confirming the update
@router.put("/update-links")
async def update_links(
    facebook: str = Form(...),
    linkedin: str = Form(...),
    github: str = Form(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    user.facebook = facebook
    user.linkedin = linkedin
    user.github = github
    
    db.commit()
    
    return {"message": "Links updated successfully"}

# Fetch the user's job posts
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of job posts made by the user
@router.get("/profile/job-posts")
async def get_job_posts(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    job_posts = db.query(JobPosting).filter(JobPosting.user_id == user.user_id).all()

    return {"message": "success", "data": job_posts}