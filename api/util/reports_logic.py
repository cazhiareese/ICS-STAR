from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session
from models.log import Log
from models.usermodel import User 
from config import config
from config.database import get_db
import uuid

# Filters logs by including only those from the last 30 days
#
# Arguments: db - SQLAlchemy session
#
# Returns: a list of dictionaries containing log information
def logic_30_days_report(db: Session):
    # Calculate range of dates
    current_date = datetime.now()
    thirty_days_ago = current_date - timedelta(days=30)
    
    # Query the database directly with filtering
    recent_logs = db.query(Log).filter(
        Log.date_time >= thirty_days_ago
    ).all()
    
    # Convert to dictionaries for JSON serialization
    log_dicts = [
        {
            "log_id": log.log_id,
            "date_time": log.date_time,
            "is_active": log.is_active,
            "user_id": log.user_id
        } 
        for log in recent_logs
    ]
    
    return log_dicts

# Count visits and unique users by batch
#
# Arguments: db - SQLAlchemy session
#
# Returns: a tuple of dictionaries containing visit counts and unique users by batch (null/no batch are included)
def logic_batch_visits(db: Session):
    # Get all logs with user batch information by getting first 4 characters of student number (batch)
    logs_with_batch = db.query(Log, func.substring(User.student_number, 1, 4)).join(User, Log.user_id == User.user_id).all()
    
    # Initialize dictionaries to store visit counts and unique users
    batch_visits = {}
    batch_unique_users = {}
    
    # Count visits and unique users for each batch
    for log, batch in logs_with_batch:
        user_id = log.user_id
        
        # Update visit count
        batch_visits[batch] = batch_visits.get(batch, 0) + 1
        
        # Update unique users
        if batch not in batch_unique_users:
            batch_unique_users[batch] = set()
        batch_unique_users[batch].add(user_id)
    
    return batch_visits, batch_unique_users

def logic_login_log(db: Session, user_id: str):
    # Get current date and time
    current_date = datetime.now()

    # Assign log ID (UUID)
    log_id = str(uuid.uuid4())

    # Create new log entry
    new_log = Log(
        log_id = log_id,
        date_time = current_date,
        is_active = True,
        user_id = user_id
    )

    # Add to database
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log

def logic_logout_log(db: Session, user_id: str):
    # Get current date and time
    current_date = datetime.now()

    # Assign log ID (UUID)
    log_id = str(uuid.uuid4())

    # Create new log entry
    new_log = Log(
        log_id = log_id,
        date_time = current_date,
        is_active = False,
        user_id = user_id
    )

    # Add to database
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log