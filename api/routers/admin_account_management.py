from datetime import datetime
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserOut, UserStandingEnum, UserTypeEnum
from config.database import get_db
from util.userutil import require_admin
from models.usermodel import User
from models.report_model import Report
from uuid import UUID
from sqlalchemy import func, update

router = APIRouter()

# Check if user is an admin
# Arguments: current_user - the current user
# Returns: True if user is an admin, False otherwise
def isAdmin(current_user: User = Depends(require_admin)):
    if current_user.user_type.value != UserTypeEnum.admin:
        raise HTTPException(status_code=403, detail="You do not have permission to access this resource")
    return True

# Get all unverified users
# Arguments: db - SQLAlchemy session
# Returns: a list of all unverified users
@router.get("/admin/unverified", dependencies=None, response_model=list[UserOut])
async def read_unverified_users(db: Session = Depends(get_db)):
    unverified_users = db.query(
        User.user_id,
        User.first_name,
        User.last_name,
        User.email,
        User.student_number,
        User.graduation_year,
        User.graduation_semester,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg'),
        User.verification_file
    ).filter(
        User.is_verified == False
    ).all()
    
    unverified_users_list = [
        {
            "user_id": user.user_id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "student_number": user.student_number,
            "grad_class": f"{user.graduation_year} - {user.graduation_semester}",
            "date_of_reg": user.date_of_reg,
            "verification_file": user.verification_file
        } for user in unverified_users
    ]

    return unverified_users_list

# Get unverified alumni
# Arguments: db - SQLAlchemy session
# Returns: a list of all unverified alumni
@router.get("/admin/unverified/alumni", dependencies=None)
async def read_unverified_alumni(db: Session = Depends(get_db)):
    unverified_alum = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        User.email,
        User.student_number,
        User.graduation_year,
        User.graduation_semester,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg'),
        User.verification_file
    ).filter(
        User.user_type == UserTypeEnum.alumni,
        User.is_verified == False
    ).all()

    # Convert the result to a list of dictionaries
    unverified_alum_list = [
        {
            "user_id": alum.user_id,
            "name": f"{alum.first_name} {alum.last_name}",
            "email": alum.email,
            "student_number": alum.student_number,
            "grad_class": f"{alum.graduation_year} - {alum.graduation_semester}",
            "date_of_reg": alum.date_of_reg,
            "verification_file": alum.verification_file
        } for alum in unverified_alum
    ]

    
    return unverified_alum_list

# Get unverified students
# Arguments: db - SQLAlchemy session
# Returns: a list of all unverified students
@router.get("/admin/unverified/students", dependencies=None)
async def read_unverified_students(db: Session = Depends(get_db)):
    unverified_students = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        User.email,
        User.student_number,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg'),
        User.verification_file
    ).filter(
        User.user_type == UserTypeEnum.student,
        User.is_verified == False
    ).all()

    # Convert the result to a list of dictionaries
    unverified_students_list = [
        {
            "user_id": student.user_id,
            "name": f"{student.first_name} {student.last_name}",
            "email": student.email,
            "student_number": student.student_number,
            "date_of_reg": student.date_of_reg,
            "verification_file": student.verification_file
        } for student in unverified_students
    ]
    
    return unverified_students_list

# Get the number of unverified alumni 
# Arguments: db - SQLAlchemy session
# Returns: the count of unverified alumni
@router.get("/admin/unverified/alumni/count", dependencies=None)
async def read_unverified_alumni_count(db: Session = Depends(get_db)):
    unverified_alumni_count = db.query(User.user_id).filter(User.user_type == UserTypeEnum.alumni , User.is_verified == False).count()
    return {"unverified_alumni_count": unverified_alumni_count}

# Get the number of unverified students
# Arguments: db - SQLAlchemy session
# Returns: the count of unverified students
@router.get("/admin/unverified/students/count", dependencies=None)
async def read_unverified_students_count(db: Session = Depends(get_db)):
    unverified_students_count = db.query(User.user_id).filter(User.user_type == UserTypeEnum.student, User.is_verified == False).count()
    return {"unverified_students_count": unverified_students_count}

# Verify and confirm user registration
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a message confirming the user registration
@router.put("/admin/confirm/{user_id}", dependencies=None)
async def confirm_user(db: Session = Depends(get_db), user_id: UUID = None):
    result = db.execute(
        update(User)
        .where(User.user_id == user_id)
        .values(is_verified=True)
        .returning(User.user_id)
    )
    
    # Check if any row was affected
    affected_user = result.scalar_one_or_none()
    
    if affected_user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.commit()
    return {"message": "User registration confirmed"}

# Get all graduating students
# Arguments: db - SQLAlchemy session
# Returns: a list of all graduating students
@router.get("/admin/graduating", dependencies=None)
async def read_graduating_students(db: Session = Depends(get_db)):
    graduating_students = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        User.email,
        User.student_number,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg'),
        User.graduation_year,
        User.graduation_semester,
        User.image,
        User.standing
    ).filter(
        User.user_type == UserTypeEnum.student,
        User.is_verified == True,
        User.standing == UserStandingEnum.graduating
    ).all()

    # Convert the result to a list of dictionaries
    graduating_students_list = [
        {
            "user_id": student.user_id,
            "name": f"{student.first_name} {student.last_name}",
            "email": student.email,
            "student_number": student.student_number,
            "grad_class": f"{student.graduation_year} - {student.graduation_semester}",
            "date_of_reg": student.date_of_reg,
            "image": student.image,
            "standing": student.standing.value
        } for student in graduating_students
    ]

    return graduating_students_list

# Transition graduating students to alumni
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a message confirming the transition
@router.put("/admin/transition/{user_id}", dependencies=None)
async def transition_student(db: Session = Depends(get_db), user_id: UUID = None):

    # Get current date
    current_date = datetime.today()
    
    # If current date is August to December, year = next year
    if current_date.month >= 8:
        graduation_year = current_date.year + 1
    else:
        graduation_year = current_date.year

    # If current month is August to January, semester = 1
    if current_date.month >= 8 or current_date.month <= 1:
        graduation_semester = "1st Semester"

    # If current month is June to July, semester = Midyear
    elif current_date.month >= 6 and current_date.month <= 7:
        graduation_semester = "Midyear"
    else:
        graduation_semester = "2nd Semester"

    result = db.execute(
        update(User)
        .where(User.user_id == user_id)
        .values(user_type="alumni", standing=None, graduation_year=graduation_year, graduation_semester=graduation_semester, is_onboarded=False)
        .returning(User.user_id)
    )
    
    # Check if any row was affected
    affected_user = result.scalar_one_or_none()
    
    if affected_user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.commit()
    return {"message": "Student transitioned to alumni"}

# Get all students (not transitioned students)
# Arguments: db - SQLAlchemy session
# Returns: a list of all students
@router.get("/admin/students", dependencies=None)
async def read_students(db: Session = Depends(get_db)):
    students = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        User.email,
        User.student_number,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg'),
        User.is_verified,
        User.image,
        User.is_banned
    ).filter(
        User.user_type == UserTypeEnum.student,
        User.is_verified == True
    )

    students_list = [
        {
            "user_id": student.user_id,
            "name": f"{student.first_name} {student.last_name}",
            "email": student.email,
            "student_number": student.student_number,
            "date_of_reg": student.date_of_reg,
            "is_verified": student.is_verified,
            "image": student.image,
            "is_banned": student.is_banned
        } for student in students
    ]

    return students_list

# Get verified alumni
# Arguments: db - SQLAlchemy session
# Returns: a list of all verified alumni
@router.get("/admin/verified-alumni", dependencies=None)
async def read_verified_alumni(db: Session = Depends(get_db)):
    alumni = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        User.student_number,
        User.work_location,
        User.job_title,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_update'),
        User.image
    ).filter(
        User.user_type == UserTypeEnum.alumni,
        User.is_verified == True
    ).all()

    # Convert the result to a list of dictionaries
    alumni_list = [
        {
            "user_id": alum.user_id,
            "name": f"{alum.first_name} {alum.last_name}",
            "batch": alum.student_number[0:4],
            "base_location": alum.work_location,
            "job_title": alum.job_title,
            "last_update": alum.last_update,
            "image": alum.image
        } for alum in alumni
    ]

    return alumni_list

# Get verified students
# Arguments: db - SQLAlchemy session
# Returns: a list of all verified students
@router.get("/admin/verified-students", dependencies=None)
async def read_verified_students(db: Session = Depends(get_db)):
    students = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        User.student_number,
        User.standing,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_update'),
        User.image
    ).filter(
        User.user_type == UserTypeEnum.student,
        User.is_verified == True
    ).all()

    # Convert the result to a list of dictionaries
    students_list = [
        {
            "user_id": student.user_id,
            "name": f"{student.first_name} {student.last_name}",
            "batch": student.student_number[0:4],
            "standing": student.standing,
            "last_update": student.last_update,
            "image": student.image
        } for student in students
    ]

    return students_list

# Get user's verification file
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: the verification file of the user
@router.get("/admin/verification-file/{user_id}", dependencies=None)
async def read_verification_file(db: Session = Depends(get_db), user_id: UUID = None):
    file = db.query(User.verification_file).filter(User.user_id == user_id).scalar()
    if file is None:
        raise HTTPException(status_code=200, detail="Fiie not found")
    return {"verification_file": file}

# Get user's report logs
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a list of all report logs of the user
@router.get("/admin/report-logs/{user_id}", dependencies=None)
async def read_report_logs(db: Session = Depends(get_db), user_id: UUID = None):
    report_logs = db.query(
        Report.report_id,
        func.to_char(Report.created_at, 'MM/DD/YYYY').label('report_date'),
        func.to_char(Report.created_at, 'HH24:MI:SS').label('report_time'),
        Report.reason,
        Report.status,
    ).filter(
        Report.reported_user_id == user_id
    ).all()
    
    report_logs_list = [
        {
            "report_id": report.report_id,
            "report_date": report.report_date,
            "report_time": report.report_time,
            "reason": report.reason,
            "status": report.status
        } for report in report_logs
    ]

    return report_logs_list

# Ban user
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a message confirming the ban
@router.put("/admin/ban/{user_id}", dependencies=None)
async def ban_user(db: Session = Depends(get_db), user_id: UUID = None):
    result = db.execute(
        update(User)
        .where(User.user_id == user_id)
        .values(is_banned=True)
        .returning(User.user_id)
    )
    
    # Check if any row was affected
    affected_user = result.scalar_one_or_none()
    
    if affected_user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.commit()
    return {"message": "User banned"}

# Get user profile
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: the user profile
@router.get("/profile/{user_id}", dependencies=None)
async def get_profile(
    db: Session = Depends(get_db),
    user_id: UUID = None,
):
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

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
        "facebook": user.facebook,
        "linkedin": user.linkedin,
        "github": user.github,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "skills": [skill.skill for skill in user.skills],
        "scholarships": [scholarship.scholarship for scholarship in user.scholarships],
        "affiliations": [
            {"affiliation": aff.affiliation, "role": aff.role} for aff in user.affiliations
        ],
    }
    
    return {"message": "success", "data": profile_details}


# Get unverified user
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: the unverified user
@router.get("/admin/unverified/user/{user_id}", dependencies=None)
async def read_unverified_user(db: Session = Depends(get_db), user_id: UUID = None):
    user = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        User.email,
        User.student_number,
        User.graduation_year,
        User.graduation_semester,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg'),
        User.verification_file,
        User.image
    ).filter(
        User.user_id == user_id,
        User.is_verified == False
    ).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert the result to a dictionary
    unverified_user = {
        "user_id": user.user_id,
        "name": f"{user.first_name} {user.last_name}",
        "email": user.email,
        "student_number": user.student_number,
        "grad_class": f"{user.graduation_year} - {user.graduation_semester}",
        "date_of_reg": user.date_of_reg,
        "verification_file": user.verification_file,
        "image": user.image
    }

    return unverified_user