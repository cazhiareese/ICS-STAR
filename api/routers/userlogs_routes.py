from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List, Dict
from schemas.user import UserLogInput, UserLog

router = APIRouter(
    prefix="/user",
    tags=["users"]
)

user_logs = [] # Temporary storage for user logs; will update to use PostgreSQL later

@router.post("/")
def create_user(user_input: UserLogInput):
    current_time = datetime.now().isoformat() # As stated earlier, time is automatically logged by the system
    
    user_log = UserLog(
        user_id=user_input.user_id, # Get the remaining fields from the input
        isActive=user_input.isActive,
        batch=user_input.batch,
        time=current_time
    )
    
    user_logs.append(user_log.dict()) # Append the user log to the temporary storage
    return user_log