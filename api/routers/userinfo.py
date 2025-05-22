from fastapi import Depends, APIRouter, HTTPException, status, Form, UploadFile, File, Query
from sqlalchemy.orm import Session
from config.database import get_db
from typing import List, Optional

from util.userutil import upload_profile, get_current_user, verify_password, hash_password, get_org_suggestion, process_student_onboarding, process_alumni_onboarding, get_personal_info, get_user_skills, get_user_affiliations, get_user_scholarships, get_user_job_post_history, get_user_job_posting, get_user_work, send_inactive_email
from util.donation_util import get_user_monetary_donations, get_user_in_kind_donations, get_user_donations, get_user_in_kind_donations_acknowledged, get_user_monetary_donations_acknowledged, get_user_donation_history_details
from models.usermodel import User, UserScholarship, UserAffiliation, UserSkill, UnemploymentReason
from models.job_posting_model import JobPosting

from schemas.user import UserEmploymentStatus, UserTypeEnum, UnemploymentReasonEnum, UserStandingEnum, CurrentUser

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
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    try:
        userpic = db.query(User.user_id, User.image).filter(User.user_id==user.user_id).first()
        file_path = await upload_profile(file, userpic, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Error uploading {e}')

    return {"message": "Profile picture uploaded successfully"}

@router.post("/add-scholarships")
async def add_scholarships(
    scholarships: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    if scholarships:
        new_scholarships = [
            UserScholarship(user_id=user.user_id, scholarship=scholarship)
            for scholarship in scholarships
        ]
        
        db.add_all(new_scholarships)
        db.commit()
    
        return {"message": "scholarships added successfully"}
    else:
        return {"success": True}

@router.post("/add-affiliations")
async def add_affiliations(
    affiliations: Optional[List[str]] = Query(None),
    roles: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    if affiliations and roles:
        if len(affiliations) != len(roles):
            raise HTTPException(status_code=400, detail="Invalid input")

        new_affiliations = [
            UserAffiliation(user_id=user.user_id, affiliation=affiliation, role=role) for affiliation, role in zip(affiliations, roles)
        ]
        
        db.add_all(new_affiliations)
        db.commit()
    
        return {"message": "affiliations added successfully"}
    else:
        return {"success": True}


@router.post("/add-skills")
async def add_skills(
    skills: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    if skills:
        new_skills = [UserSkill(user_id=user.user_id, skill=skill) for skill in skills]
        db.add_all(new_skills)
        db.commit()
        
        return {"message": "skills added successfully"}
    else:
        return {"success": True}



@router.post("/onboarding-info-student")
async def onboarding_student(
    standing: Optional[UserStandingEnum] = Form(None),
    scholarships: Optional[List[str]] = Form(None),
    affiliations: Optional[List[str]] = Form(None),
    roles: Optional[List[str]] = Form(None),
    skills: Optional[List[str]] = Form(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    data = process_student_onboarding(
        user=user,
        db=db,
        standing=standing,
        scholarships=scholarships,
        affiliations=affiliations,
        roles=roles,
        skills=skills,
    )

    return data

@router.post("/onboarding-info-alum")
async def onboarding_info(
    scholarships: Optional[List[str]] = Form(None),
    affiliations: Optional[List[str]] = Form(None),
    roles: List[str] = Form(None),
    industry: str = Form(None),
    employment_status: UserEmploymentStatus = Form(None),
    reasons: Optional[List[UnemploymentReasonEnum]] = Form(None),
    company_name: str = Form(None),
    job_title: str = Form(None),
    country: str = Form(None),
    city: str = Form(None),
    work_mode: str = Form(None),
    employer_class: str = Form(None),
    tenured_status: str = Form(None),
    salary_grade: str = Form(None),
    skills: Optional[List[str]] = Form(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):

    data = process_alumni_onboarding(
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
    
    return data

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
    user: CurrentUser = Depends(get_current_user)
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
    
    db.query(User).filter(User.user_id==user.user_id).update({
        User.industry: industry,
        User.employment_status: employment_status.value,
        User.company_name: company_name,
        User.job_title: job_title,
        User.work_location: f"{city}, {country}",
        User.work_mode: work_mode,
        User.employer_class: employer_class,
        User.tenured_status: tenured_status,
        User.salary_grade: salary_grade
    })
    
    db.commit()
    
    return {"message": "employment details updated successfully"}

# Get user profile details
# Arguments: db - SQLAlchemy session, user - current user
@router.get("/profile/me/personal-information")
async def get_profile(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    personal_info = get_personal_info(user.user_id, db)

    if not personal_info:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = {
        "user_id": personal_info.user_id,
        "first_name": personal_info.first_name,
        "last_name": personal_info.last_name,
        "email": personal_info.email,
        "image": personal_info.image,
        "mobile_number": personal_info.mobile_number,
        "city": personal_info.city,
        "state": personal_info.state,
        "country": personal_info.country,
        "marital_status": personal_info.marital_status,
        "student_number": personal_info.student_number,
        "graduation_semester": personal_info.graduation_semester,
        "graduation_year": personal_info.graduation_year,
        "facebook": personal_info.facebook,
        "linkedin": personal_info.linkedin,
        "github": personal_info.github
    }

    return {"message": "success", "data": result}

@router.get("/profile/me/skills")
async def get_skills(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    skills = get_user_skills(user.user_id, db)

    return {"message": "success", "data": skills}

@router.get("/profile/me/affiliations")
async def get_affiliations(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    affiliations = get_user_affiliations(user.user_id, db)

    return {"message": "success", "data": affiliations}

@router.get("/profile/me/scholarships")
async def get_scholarships(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    scholarships = get_user_scholarships(user.user_id, db)

    return {"message": "success", "data": scholarships}

@router.get("/profile/me/job-post-history")
async def get_post_history(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
        
    job_post_history = get_user_job_post_history(user.user_id, db)

    return {"message": "success", "data": job_post_history}

@router.get("/profile/me/job-post/{post_id}")
async def get_user_post(
    post_id: UUID,
    db: Session = Depends(get_db)
):
    job_post = get_user_job_posting(post_id, db)

    return {"message": "success", "data": job_post}

@router.get("/profile/me/work")
async def get_work(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    work_info = get_user_work(user.user_id, db)

    if not work_info:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = {
        "employment_status": work_info.employment_status,
        "industry": work_info.industry,
        "company_name": work_info.company_name,
        "job_title": work_info.job_title,
        "work_location": work_info.work_location,
        "work_mode": work_info.work_mode,
        "employer_class": work_info.employer_class,
        "tenured_status": work_info.tenured_status,
        "salary_grade": work_info.salary_grade
    }

    return {"message": "success", "data": result}


@router.get("/profile/{user_id}/personal-information")
async def get_profile(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    
    personal_info = get_personal_info(user_id, db)

    if not personal_info:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = {
        "user_id": personal_info.user_id,
        "first_name": personal_info.first_name,
        "last_name": personal_info.last_name,
        "email": personal_info.email,
        "image": personal_info.image,
        "mobile_number": personal_info.mobile_number,
        "city": personal_info.city,
        "state": personal_info.state,
        "country": personal_info.country,
        "marital_status": personal_info.marital_status,
        "student_number": personal_info.student_number,
        "graduation_semester": personal_info.graduation_semester,
        "graduation_year": personal_info.graduation_year,
        "facebook": personal_info.facebook,
        "linkedin": personal_info.linkedin,
        "github": personal_info.github
    }

    return {"message": "success", "data": result}

@router.get("/profile/{user_id}/skills")
async def get_skills(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    
    skills = get_user_skills(user_id, db)

    return {"message": "success", "data": skills}

@router.get("/profile/{user_id}/affiliations")
async def get_affiliations(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    
    affiliations = get_user_affiliations(user_id, db)

    return {"message": "success", "data": affiliations}

@router.get("/profile/{user_id}/scholarships")
async def get_scholarships(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    
    scholarships = get_user_scholarships(user_id, db)

    return {"message": "success", "data": scholarships}

@router.get("/profile/{user_id}/job-post-history")
async def get_post_history(
    user_id: UUID,
    db: Session = Depends(get_db),
):
        
    job_post_history = get_user_job_post_history(user_id, db)

    return {"message": "success", "data": job_post_history}

@router.get("/profile/{user_id}/job-post/{post_id}")
async def get_user_post(
    post_id: UUID,
    db: Session = Depends(get_db)
):
    job_post = get_user_job_posting(post_id, db)

    return {"message": "success", "data": job_post}

@router.get("/profile/{user_id}/work")
async def get_work(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    
    work_info = get_user_work(user_id, db)

    if not work_info:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = {
        "employment_status": work_info.employment_status,
        "industry": work_info.industry,
        "company_name": work_info.company_name,
        "job_title": work_info.job_title,
        "work_location": work_info.work_location,
        "work_mode": work_info.work_mode,
        "employer_class": work_info.employer_class,
        "tenured_status": work_info.tenured_status,
        "salary_grade": work_info.salary_grade
    }

    return {"message": "success", "data": result}

# Get user profile details by user ID
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: user profile details
@router.get("/profile/{user_id}")
async def get_profile_by_id(
    db: Session = Depends(get_db),
    user_id: str = None,
    user: CurrentUser = Depends(get_current_user)
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
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    db.query(User).filter(User.user_id==user.user_id).update({
        User.first_name: first_name,
        User.last_name: last_name,
        User.email: email,
        User.mobile_number: mobile_number,
        User.city: city,
        User.state: state,
        User.country: country,
        User.marital_status: marital_status,
        User.facebook: facebook,
        User.linkedin: linkedin,
        User.github: github
    })
    
    db.commit()
    
    return {"message": "Profile updated successfully"}

# Update user password
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a message confirming the update
@router.put("/profile/change-password")
async def update_password(
    old_password: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    user_pass = db.query(User.password).filter(User.user_id==user.user_id).first()
    
    if not verify_password(old_password, user_pass.password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    
    if old_password == new_password:
        raise HTTPException(status_code=400, detail="New password cannot be the same as old password")

    db.query(User).filter(User.user_id==user.user_id).update({User.password: hash_password(new_password)})
    db.commit()
    
    return {"message": "Password updated successfully"}

# Get user profile picture
# Arguments: db - SQLAlchemy session, user - current user
# Returns: the profile picture of the user
@router.get("/profile-picture")
async def get_profile_picture(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    img = db.query(User.image).filter(User.user_id==user.user_id).first()
    return {"profile_picture": img.image}

# Remove a skill from the user's profile
# Arguments: db - SQLAlchemy session, skill_id - the skill ID
# Returns: a message confirming the removal
@router.delete("/remove-skill/")
async def remove_skill(
    skill: str = Query(...),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
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
    user: CurrentUser = Depends(get_current_user)
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
    user: CurrentUser = Depends(get_current_user)
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
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    db.query(User).filter(User.user_id==user.user_id).update({User.image: None})
    db.commit()
    
    return {"message": "Profile picture removed successfully"}

# Get the donation history of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of donations made by the user
@router.get("/donation-history/all")
async def get_donation_history(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
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
    user: CurrentUser = Depends(get_current_user),
    isIncreasing: Optional[bool] = Query(None, description="Sort order for monetary donations"),
    isNewest: Optional[bool] = Query(None, description="Sort order for monetary donations")

):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    monetary_donations = get_user_monetary_donations(db, user.user_id, isIncreasing, isNewest)

    return {"message": "success", "data": monetary_donations}

# Get the in-kind donations of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of in-kind donations made by the user
@router.get("/donation-history/in-kind-donations")
async def get_in_kind_donations(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
    isNewest: Optional[bool] = Query(None, description="Sort order for in-kind donations"),

):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    in_kind_donations = get_user_in_kind_donations(db, user.user_id, isNewest)

    return {"message": "success", "data": in_kind_donations}

@router.get("/donation-history/monetary-donations/{user_id}")
async def get_monetary_donations(
    user_id: UUID,
    db: Session = Depends(get_db),
    isIncreasing: Optional[bool] = Query(None, description="Sort order for monetary donations"),
    isNewest: Optional[bool] = Query(None, description="Sort order for monetary donations")

):
    
    monetary_donations = get_user_monetary_donations(db, user_id, isIncreasing, isNewest)

    return {"message": "success", "data": monetary_donations}

# Get the in-kind donations of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of in-kind donations made by the user
@router.get("/donation-history/in-kind-donations/{user_id}")
async def get_in_kind_donations(
    user_id: UUID,
    db: Session = Depends(get_db),
    isNewest: Optional[bool] = Query(None, description="Sort order for in-kind donations"),

):
    
    in_kind_donations = get_user_in_kind_donations(db, user_id, isNewest)

    return {"message": "success", "data": in_kind_donations}

# Get the monetary donation history of the user that has been acknowledged
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of acknowledged donations made by the user
@router.get("/donation-history/monetary-donations/acknowledged")
async def get_acknowledged_monetary_donations(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
    isIncreasing: Optional[bool] = Query(None, description="Sort order for monetary donations"),
    isNewest: Optional[bool] = Query(None, description="Sort order for monetary donations")

):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    acknowledged_monetary_donations = get_user_monetary_donations_acknowledged(db, user.user_id, isIncreasing, isNewest)

    return {"message": "success", "data": acknowledged_monetary_donations}

# Get the in-kind donation history of the user that has been acknowledged
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of acknowledged donations made by the user
@router.get("/donation-history/in-kind-donations/acknowledged")
async def get_acknowledged_in_kind_donations(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
    isNewest: Optional[bool] = Query(None, description="Sort order for in-kind donations")

):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    acknowledged_in_kind_donations = get_user_in_kind_donations_acknowledged(db, user.user_id, isNewest)

    return {"message": "success", "data": acknowledged_in_kind_donations}

# Get the donation history of the user
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of donations made by the user with acknowledgment status
@router.get("/donation-history")
async def get_donation_history_me(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
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
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    db.query(User).filter(User.user_id==user.user_id).update({
        User.facebook: facebook,
        User.linkedin: linkedin,
        User.github: github
    })
    
    db.commit()
    
    return {"message": "Links updated successfully"}

# Fetch the user's job posts
# Arguments: db - SQLAlchemy session, user - current user
# Returns: a list of job posts made by the user
@router.get("/profile/job-posts")
async def get_job_posts(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    job_posts = db.query(JobPosting).filter(JobPosting.user_id == user.user_id).all()

    return {"message": "success", "data": job_posts}

@router.get("/email-name/me")
async def get_email_name(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    email_name = db.query(User.email, User.first_name, User.last_name).filter(User.user_id == user.user_id).first()

    email, first_name, last_name = email_name
    return {
        "message": "success",
        "data": {
            "email": email,
            "first_name": first_name,
            "last_name": last_name
        }
    }

@router.put("/update-email")
async def update_email(
    email: str = Form(...),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    db.query(User).filter(User.user_id==user.user_id).update({User.email: email})
    db.commit()
    
    return {"message": "Email updated successfully"}

@router.get("/email-name/{user_id}")
async def get_email_name_by_id(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    email_name = db.query(User.email, User.first_name, User.last_name).filter(User.user_id == user_id).first()

    email, first_name, last_name = email_name
    return {
        "message": "success",
        "data": {
            "email": email,
            "first_name": first_name,
            "last_name": last_name
        }
    }

@router.get("/profile-picture/{userid}")
async def get_profile_picture_by_id(
    userid: UUID,
    db: Session = Depends(get_db),
):
    img = db.query(User.image).filter(User.user_id==userid).first()
    return {"profile_picture": img.image}

@router.get("/me/status")
async def get_user_status(
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    status = db.query(
        User.is_banned,
        User.is_verified,
        User.user_type
    ).filter(User.user_id==user.user_id).first()
    
    return {
        "status": {
            "is_banned": status[0],
            "is_verified": status[1],
            "user_type": status[2]
        }
    }

@router.get("/{user_id}/status")
async def get_user_status_by_id(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    status = db.query(
        User.is_banned,
        User.is_verified,
        User.user_type
    ).filter(User.user_id == user_id).first()


    return {
        "status": {
            "is_banned": status[0],
            "is_verified": status[1],
            "user_type": status[2]
        }
    }
    
@router.post("/manual-inactive-email/{user_id}")
async def manual_inactive(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    user = db.query(User.email, User.first_name, User.last_name).filter(User.user_id == user_id).first()
    
    if not user:
        return {"message": "User not found"}
    else:
        user_dict = {
            "user_id": user_id,
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}"
        }
    
    return await send_inactive_email(user_dict)
    