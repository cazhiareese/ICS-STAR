from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserOut
from config.database import get_db
from util.userutil import require_admin
from models.usermodel import User

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
@router.get("/admin/unverified", dependencies=[Depends(isAdmin)], response_model=list[UserOut])
async def read_unverified_users(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.is_verified == False).all()
    return [UserOut.model_validate(user) for user in users]

# Verify and confirm user registration
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a message confirming the user registration
@router.put("/admin/confirm/{user_id}", dependencies=[Depends(isAdmin)])
async def confirm_user(db: Session = Depends(get_db), user_id: int = None):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    return {"message": "User registration confirmed"}

# Get all graduating students
# Arguments: db - SQLAlchemy session
# Returns: a list of all graduating students
@router.get("/admin/graduating", dependencies=[Depends(isAdmin)], response_model=list[UserOut])
async def read_graduating_students(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.user_type == "student", User.standing == 'graduating').all()
    return [UserOut.model_validate(student) for student in students]

# Transition graduating students to alumni
# Arguments: db - SQLAlchemy session, user_id - the user ID
# Returns: a message confirming the transition
@router.put("/admin/transition/{user_id}", dependencies=[Depends(isAdmin)])
async def transition_student(db: Session = Depends(get_db), user_id: int = None):
    student = db.query(User).filter(User.user_id == user_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="User not found")
    student.user_type = "alumni"
    db.commit()
    return {"message": "Student transitioned to alumni"}

# Get all students (not transitioned students)
# Arguments: db - SQLAlchemy session
# Returns: a list of all students
@router.get("/admin/students", dependencies=[Depends(isAdmin)], response_model=list[UserOut])
async def read_students(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.user_type == "student").all()
    return [UserOut.model_validate(student) for student in students]
