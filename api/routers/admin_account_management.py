from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserOut
from config.database import get_db
from util.userutil import require_admin
from models.usermodel import User
from uuid import UUID
from sqlalchemy import func

router = APIRouter()

# Check if user is an admin
# Arguments: current_user - the current user
# Returns: True if user is an admin, False otherwise
def isAdmin(current_user: User = Depends(require_admin)):
    if current_user.user_type.value != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to access this resource")
    return True

# Get all unverified users
# Arguments: db - SQLAlchemy session
# Returns: a list of all unverified users
@router.get("/admin/unverified", dependencies=None, response_model=list[UserOut])
async def read_unverified_users(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.is_verified == False).all()
    return [UserOut.model_validate(user) for user in users]

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
    ).filter(
        User.user_type == "alumni",
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
    ).filter(
        User.user_type == "student",
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
        } for student in unverified_students
    ]
    
    return unverified_students_list

# Get the number of unverified alumni 
# Arguments: db - SQLAlchemy session
# Returns: the count of unverified alumni
@router.get("/admin/unverified/alumni/count", dependencies=None)
async def read_unverified_alumni_count(db: Session = Depends(get_db)):
    unverified_alumni_count = db.query(User).filter(User.user_type == "alumni", User.is_verified == False).count()
    return {"unverified_alumni_count": unverified_alumni_count}

# Get the number of unverified students
# Arguments: db - SQLAlchemy session
# Returns: the count of unverified students
@router.get("/admin/unverified/students/count", dependencies=None)
async def read_unverified_students_count(db: Session = Depends(get_db)):
    unverified_students_count = db.query(User).filter(User.user_type == "student", User.is_verified == False).count()
    return {"unverified_students_count": unverified_students_count}

# Verify and confirm user registration
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a message confirming the user registration
@router.put("/admin/confirm/{user_id}", dependencies=None)
async def confirm_user(db: Session = Depends(get_db), user_id: UUID = None):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    return {"message": "User registration confirmed"}

# Get all graduating students
# Arguments: db - SQLAlchemy session
# Returns: a list of all graduating students
@router.get("/admin/graduating", dependencies=None, response_model=list[UserOut])
async def read_graduating_students(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.user_type == "student", User.standing == 'graduating').all()
    return [UserOut.model_validate(student) for student in students]

# Transition graduating students to alumni
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a message confirming the transition
@router.put("/admin/transition/{user_id}", dependencies=None)
async def transition_student(db: Session = Depends(get_db), user_id: UUID = None):
    student = db.query(User).filter(User.user_id == user_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="User not found")
    student.user_type = "alumni"
    db.commit()
    return {"message": "Student transitioned to alumni"}

# Get all students (not transitioned students)
# Arguments: db - SQLAlchemy session
# Returns: a list of all students
@router.get("/admin/students", dependencies=None, response_model=list[UserOut])
async def read_students(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.user_type == "student").all()
    return [UserOut.model_validate(student) for student in students]

# Get user's verification file
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: the verification file of the user
@router.get("/admin/verification-file/{user_id}", dependencies=None)
async def read_verification_file(db: Session = Depends(get_db), user_id: UUID = None):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"verification_file": user.verification_file}