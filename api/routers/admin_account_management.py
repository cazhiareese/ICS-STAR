from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from util.userutil import get_db, get_current_user, require_admin
from models.usermodel import User

router = APIRouter()

# Check if user is an admin
# Arguments: current_user - the current user
# Returns: True if user is an admin, False otherwise
def isAdmin(current_user: User = Depends(require_admin)):
    return True

# Get all unverified users
# Arguments: db - SQLAlchemy session
# Returns: a list of all unverified users
@router.get("/admin/unverified", dependencies=[Depends(isAdmin)])
async def read_unverified_users(db: Session = Depends(get_db)):
    return db.query(User).filter(User.isVerified == False).all()

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


