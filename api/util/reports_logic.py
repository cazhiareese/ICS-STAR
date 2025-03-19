from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.log import Log
from models.user import User 
from config import config

def get_db():
    db = config.SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    # Assuming you have a batch field in your User model
    # This might need adjustment based on your actual model structure
    
    # Get all logs with user batch information
    logs_with_batch = db.query(Log, User.graduation_year).join(
        User, Log.user_id == User.user_id
    ).all()
    
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