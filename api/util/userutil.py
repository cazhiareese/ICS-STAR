from datetime import datetime, timedelta, timezone
import jwt
from jose import JWTError
from google.oauth2 import id_token
from google.auth.transport import requests
import uuid
from fastapi import Depends, HTTPException, status, UploadFile, File, APIRouter, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import distinct, or_, func
from passlib.context import CryptContext
from typing import List, Optional
from schemas.user import CurrentUser
from collections import namedtuple

from config.config import SECRET_KEY, ALGORITHM, SUPABASE_BUCKET, SessionLocal, supabase_client, STORAGE_STRING, ACCESS_TOKEN_EXPIRE_MINUTES, GOOGLE_CLIENT_ID
from config.database import get_db
from models.usermodel import User, UserTypeEnum, Orgs, UserGradSemEnum, UserScholarship, UserAffiliation, UserSkill, UserStandingEnum, UnemploymentReasonEnum, UserEmploymentStatus, UnemploymentReason
from models.job_posting_model import JobPosting, JobPostingInterestedIn, JobPostingTag

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png", "pdf", "heic", "docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024

def get_org_suggestion(db: Session, query_text: str, limit: int = 5) -> List[str]:
    results = db.query(distinct(Orgs.name))\
        .filter(
            or_(
                Orgs.name.ilike(f"%{query_text}%"),
                Orgs.alias.ilike(f"%{query_text}%")
            )
        )\
        .filter(Orgs.name.isnot(None))\
        .order_by(Orgs.name)\
        .limit(limit)\
        .all()
        
    return [result[0] for result in results]

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def get_email(email: str, db: Session = Depends(get_db)):
    if db.query(User.email).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    return True

async def get_studno(student_number: str, db: Session = Depends(get_db)):
    if db.query(User.student_number).filter(User.student_number == student_number).first():
        raise HTTPException(status_code=400, detail="Student number already exists")
    return True

def process_student_onboarding(
    user: CurrentUser,
    db: Session,
    standing: Optional[UserStandingEnum],
    scholarships: Optional[List[str]],
    affiliations: Optional[List[str]],
    roles: Optional[List[str]],
    skills: Optional[List[str]]
):
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    if user.is_onboarded:
        raise HTTPException(status_code=400, detail="User already onboarded")
    
    if user.user_type.value == UserTypeEnum.alumni:
        raise HTTPException(status_code=400, detail="For student only")
    
    try:
        if scholarships:
            new_scholarships = [
                UserScholarship(user_id=user.user_id, scholarship=scholarship)
                for scholarship in scholarships
            ]
            db.add_all(new_scholarships)

        if affiliations:
            if len(affiliations) != len(roles):
                raise HTTPException(status_code=400, detail="Invalid input")

            new_affiliations = [
                UserAffiliation(user_id=user.user_id, affiliation=affiliation, role=role)
                for affiliation, role in zip(affiliations, roles)
            ]
            db.add_all(new_affiliations)

        if skills:
            new_skills = [UserSkill(user_id=user.user_id, skill=skill) for skill in skills]
            db.add_all(new_skills)
            

        if standing is not None:
            db.query(User).filter(User.user_id == user.user_id).update({
                User.standing: standing
            })
            
        updated = db.query(User).filter(User.user_id == user.user_id).update({
            User.is_onboarded: True
        })
        
        print(updated)
    
        db.commit()
        update = db.query(User).filter(User.user_id == user.user_id).first()
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(update.user_id), "role": update.user_type.value, "is_onboarded": update.is_onboarded, "is_verified": update.is_verified, "is_banned": update.is_banned}, expires_delta=access_token_expires
        )
        return {"message": "onboarding details updated successfully", "updated_token": access_token}
        
    except Exception as e:
            raise HTTPException(status_code=500, detail=f'Error updating info {e}')
        

def process_alumni_onboarding(
    user: CurrentUser,
    db: Session,
    scholarships: Optional[List[str]] = None,
    affiliations: Optional[List[str]] = None,
    roles: Optional[List[str]] = None,
    skills: Optional[List[str]] = None,
    reasons: Optional[List[UnemploymentReasonEnum]] = None,
    industry: Optional[str] = None,
    employment_status: Optional[UserEmploymentStatus] = None,
    company_name: Optional[str] = None,
    job_title: Optional[str] = None,
    country: Optional[str] = None,
    city: Optional[str] = None,
    work_mode: Optional[str] = None,
    employer_class: Optional[str] = None,
    tenured_status: Optional[str] = None,
    salary_grade: Optional[str] = None,
):
    
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="For verified users only")
    
    if user.is_onboarded:
        raise HTTPException(status_code=400, detail="User already onboarded")
    
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    try:
        if scholarships:
            new_scholarships = [
                UserScholarship(user_id=user.user_id, scholarship=scholarship)
                for scholarship in scholarships
            ]
            db.add_all(new_scholarships)

        if affiliations:
            if len(affiliations) != len(roles):
                raise HTTPException(status_code=400, detail="Invalid input")

            new_affiliations = [
                UserAffiliation(user_id=user.user_id, affiliation=affiliation, role=role)
                for affiliation, role in zip(affiliations, roles)
            ]
            db.add_all(new_affiliations)

        if skills:
            new_skills = [UserSkill(user_id=user.user_id, skill=skill) for skill in skills]
            db.add_all(new_skills)
        
        if employment_status.value == "unemployed":
            new_reasons = [UnemploymentReason(user_id=user.user_id, reason=reason) for reason in reasons]
            db.add_all(new_reasons)

        db.query(User).filter(User.user_id==user.user_id).update({User.industry: industry,
                        User.employment_status: employment_status if employment_status else None,
                        User.company_name: company_name,
                        User.job_title: job_title,
                        User.work_location: f"{city}, {country}" if city and country else None,
                        User.work_mode: work_mode,
                        User.employer_class: employer_class,
                        User.tenured_status: tenured_status,
                        User.salary_grade: salary_grade,
                    })
        
        db.query(User).filter(User.user_id == user.user_id).update({
            User.is_onboarded: True
        })
        db.commit()
        update = db.query(User).filter(User.user_id == user.user_id).first()
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(update.user_id), "role": update.user_type.value, "is_onboarded": update.is_onboarded, "is_verified": update.is_verified, "is_banned": update.is_banned}, expires_delta=access_token_expires
        )
        return {"message": "onboarding details updated successfully", "updated_token": access_token}
        
    except Exception as e:
            raise HTTPException(status_code=500, detail=f'"Error updating info {e}"')


async def register_user(
    first_name: str,
    last_name: str,
    email: str,
    password: str,
    student_number: str,
    user_type: UserTypeEnum,
    verification_file: UploadFile = File(None),
    graduation_year: str = None,
    graduation_semester: UserGradSemEnum = None,
    db: Session = Depends(get_db)
):
    await get_email(email, db)
    await get_studno(student_number, db)

    if verification_file:
        file_content = await verification_file.read()
        if len(file_content) > MAX_FILE_SIZE or verification_file.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid verification file")

        verification_ext = verification_file.filename.split(".")[-1]
        verification_name = f"verification_files/{uuid.uuid4()}.{verification_ext}"
        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(verification_name, file_content)
        except Exception as e:
            print("Upload Error:", e)
        verification_url = f"{STORAGE_STRING}{verification_name}"
    else:
        verification_url = None
        
    hashed_password = hash_password(password)
    graduation_year = int(graduation_year) if graduation_year else None
    
    new_user = User(
        user_id=uuid.uuid4(),
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hashed_password,
        student_number=student_number,
        graduation_year=graduation_year,
        graduation_semester=graduation_semester,
        verification_file=verification_url,
        user_type=user_type
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.user_id), "role": new_user.user_type.value, "is_onboarded": new_user.is_onboarded, "is_verified": new_user.is_verified, "is_banned": new_user.is_banned}, expires_delta=access_token_expires
    )

    return {"message": "Account created successfully", "access_token": access_token}

async def upload_profile(profile_picture, user, db):
    file_content = await profile_picture.read()

    if len(file_content) > MAX_FILE_SIZE or profile_picture.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid verification file")
    
    if user.image:
        try:
            old_file_path = user.image.replace(STORAGE_STRING, "")
            supabase_client.storage.from_(SUPABASE_BUCKET).remove([old_file_path])
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to delete old profile picture: {e}")

    profile_picture_ext = profile_picture.filename.split(".")[-1]
    profile_picture_name = f"profile_pictures/{uuid.uuid4()}.{profile_picture_ext}"

    try:
        supabase_client.storage.from_(SUPABASE_BUCKET).upload(profile_picture_name, file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload Error: {str(e)}")

    profile_picture_url = f"{STORAGE_STRING}{profile_picture_name}"
    db.query(User).filter(User.user_id==user.user_id).update({User.image: profile_picture_url})
    db.commit()

    return profile_picture_url

def get_user(db, email: str):
    user = db.query(User.user_id, User.user_type, User.is_verified, User.is_onboarded, User.password, User.is_banned).filter(User.email == email).first()
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user or not verify_password(password, user.password):
        return None
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        role: str = payload.get("role")
        is_onboarded: bool = payload.get("is_onboarded")
        is_verified: bool = payload.get("is_verified")
        is_banned: bool = payload.get("is_banned")
        if user_id is None or role is None or is_onboarded is None or is_verified is None or is_banned is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User.user_id, User.is_verified, User.user_type, User.is_onboarded, User.is_banned).filter(User.user_id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db),
):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return None

    token = auth_header[7:]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        role: str = payload.get("role")
        is_onboarded: bool = payload.get("is_onboarded")
        is_verified: bool = payload.get("is_verified")
        is_banned: bool = payload.get("is_banned")

        if user_id is None or role is None or is_onboarded is None or is_verified is None or is_banned is None:
            return None

    except JWTError:
        return None

    UserSummary = namedtuple("UserSummary", ["user_id", "is_verified", "user_type", "is_onboarded", "is_banned"])

    result = (
        db.query(
            User.user_id, 
            User.is_verified, 
            User.user_type, 
            User.is_onboarded, 
            User.is_banned
        )
        .filter(User.user_id == user_id)
        .first()
    )

    if result is None:
        return None

    user = UserSummary(*result)

    return user

async def get_current_active_user(current_user: CurrentUser = Depends(get_current_user)):
    if current_user.is_banned:
        raise HTTPException(status_code=400, detail="User is banned")
    return current_user

async def require_student(user: CurrentUser = Depends(get_current_active_user)):
    if user.user_type.value != "student":
        raise HTTPException(status_code=403, detail="Forbidden: Students only")
    return user

async def require_alum(user: CurrentUser = Depends(get_current_active_user)):
    if user.user_type.value != "alumni":
        raise HTTPException(status_code=403, detail="Forbidden: Alumni only")
    return user

async def require_admin(user: CurrentUser = Depends(get_current_active_user)):
    if user.user_type.value != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin only")
    return user

async def verify_google_token(token: str):
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        
        # Check if the token is issued by Google
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise HTTPException(status_code=400, detail="Invalid issuer")
        
        # Get user info from the token
        email = idinfo['email']
        if not idinfo.get('email_verified', False):
            raise HTTPException(status_code=400, detail="Email not verified by Google")
        
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        
        return {
            "email": email,
            "first_name": first_name,
            "last_name": last_name
        }
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        # Token verification failed
        raise HTTPException(status_code=400, detail="Token verification failed")
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
async def register_with_google(
    token: str,
    student_number: str,
    user_type: UserTypeEnum,
    graduation_year: str = None,
    graduation_semester: UserGradSemEnum = None,
    verification_file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Verify Google token and get user info
    google_user = await verify_google_token(token)
    
    # Check if email already exists
    try:
        await get_email(google_user["email"], db)
    except HTTPException:
        # If email exists, we can either return an error or try to log in
        user = get_user(db, google_user["email"])
        if user:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": str(user.user_id), "role": user.user_type.value, "is_onboarded": user.is_onboarded}, 
                expires_delta=access_token_expires
            )
            return {"message": "Logged in with Google", "access_token": access_token}
        else:
            raise HTTPException(status_code=400, detail="Email already registered but account not found")
    
    # Check if student number exists
    await get_studno(student_number, db)
    
    # Handle verification file if provided
    verification_url = None
    if verification_file:
        file_content = await verification_file.read()
        if len(file_content) > MAX_FILE_SIZE or verification_file.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid verification file")

        verification_ext = verification_file.filename.split(".")[-1]
        verification_name = f"verification_files/{uuid.uuid4()}.{verification_ext}"
        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(verification_name, file_content)
        except Exception as e:
            print("Upload Error:", e)
        verification_url = f"{STORAGE_STRING}{verification_name}"
    
    # Google users don't need to remember their passwords since it's SSO
    random_password = uuid.uuid4().hex
    hashed_password = hash_password(random_password)
    
    graduation_year = int(graduation_year) if graduation_year else None
    
    new_user = User(
        user_id=uuid.uuid4(),
        first_name=google_user["first_name"],
        last_name=google_user["last_name"],
        email=google_user["email"],
        password=hashed_password,
        student_number=student_number,
        graduation_year=graduation_year,
        graduation_semester=graduation_semester,
        verification_file=verification_url,
        user_type=user_type,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create and return access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.user_id), "role": new_user.user_type.value, "is_onboarded": new_user.is_onboarded, "is_verified": new_user.is_verified, "is_banned": new_user.is_banned}, 
        expires_delta=access_token_expires
    )

    return {"message": "Account created successfully with Google", "access_token": access_token}

def get_personal_info(
        user_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    
    profile_info = db.query(
        User.user_id,
        User.first_name,
        User.last_name,
        User.email,
        User.image,
        User.linkedin,
        User.github,
        User.facebook,
        User.city,
        User.state,
        User.country,
        User.mobile_number,
        User.student_number,
        User.graduation_semester,
        User.graduation_year,
        User.marital_status
        ).filter(User.user_id==user_id).first()
    
    return profile_info

def get_user_skills(
        user_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    skills = db.query(UserSkill.skill).filter(UserSkill.user_id==user_id).all()
    return [skill[0] for skill in skills]

def get_user_affiliations(
        user_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    affiliations = db.query(UserAffiliation.affiliation, UserAffiliation.role).filter(UserAffiliation.user_id==user_id).all()
    return [{"affiliation": affiliation[0], "role": affiliation[1]} for affiliation in affiliations]

def get_user_scholarships(
        user_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    scholarships = db.query(UserScholarship.scholarship).filter(UserScholarship.user_id==user_id).all()
    return [scholarship[0] for scholarship in scholarships]

def get_user_job_post_history(
        user_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    query_result = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).filter(
        JobPosting.user_id == user_id
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).group_by(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
    ).all()
    
    # Now we need to get tags for each job posting
    result = []
    for row in query_result:
        job_id = row.post_id
        tags = db.query(JobPostingTag.tag).filter(JobPostingTag.post_id == job_id).all()
        tag_list = [tag[0] for tag in tags]
        
        result.append({
            "post_id": row.post_id,
            "title": row.title,
            "company": row.company,
            "description": row.description,
            "tags": tag_list,
            "interested_count": row.interested_count
        })
    
    return result

def get_user_job_posting(
        post_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    query_result = db.query(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        JobPosting.employment_type,
        JobPosting.mode,
        JobPosting.salary,
        JobPosting.link,
        JobPosting.image,
        func.count(func.distinct(JobPostingInterestedIn.user_id)).label('interested_count')
    ).outerjoin(
        JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id
    ).filter(
        JobPosting.post_id == post_id
    ).group_by(
        JobPosting.post_id,
        JobPosting.title,
        JobPosting.company,
        JobPosting.description,
        JobPosting.employment_type,
        JobPosting.mode,
        JobPosting.salary,
    ).first()
    
    # If no job posting is found, raise a 404 error
    if not query_result:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    # Get tags for the job posting
    tags = db.query(JobPostingTag.tag).filter(JobPostingTag.post_id == post_id).all()
    tag_list = [tag[0] for tag in tags]
    
    # Construct the response
    response = {
        "post_id": query_result.post_id,
        "title": query_result.title,
        "company": query_result.company,
        "description": query_result.description,
        "employment_type": query_result.employment_type,
        "mode": query_result.mode,
        "salary": query_result.salary,
        "link": query_result.link,
        "image": query_result.image,
        "tags": tag_list,
        "interested_count": query_result.interested_count
    }
    
    return response

def get_user_work(
        user_id: uuid.UUID,
        db: Session = Depends(get_db),
):
    work_info = db.query(
        User.employment_status,
        User.industry,
        User.company_name,
        User.job_title,
        User.work_location,
        User.work_mode,
        User.employer_class,
        User.tenured_status,
        User.salary_grade
    ).filter(User.user_id==user_id).first()
    
    return work_info