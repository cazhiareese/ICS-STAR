from datetime import datetime, timedelta
from typing import List, Dict, Set
from schemas.user import UserLog

def logic_30_days_report(logs: List[Dict]):
    # Step 1: Calculate range of dates
    current_date = datetime.now()
    thirty_days_ago = current_date - timedelta(days=30)
    
    # Step 2: Filter logs for the last 30 days
    recent_logs = []
    for log in logs:
        log_time = datetime.fromisoformat(log["time"])
        if log_time >= thirty_days_ago:
            recent_logs.append(log)
    
    return recent_logs

def logic_unique_users(logs: List[Dict]) -> Set:
    unique_users = set()
    for log in logs:
        unique_users.add(log["user_id"])
    
    return unique_users

def logic_batch_vists(logs: List[Dict]):
    # Step 1: Initialize dictionaries to store visit counts and unique users
    batch_visits = {}
    batch_unique_users = {}
    
    # Step 2: Count visits and unique users for each batch
    for log in logs:
        batch = log["batch"]
        user_id = log["user_id"]
        
        # Update visit count with existence check
        if batch in batch_visits:
            batch_visits[batch] += 1
        else:
            batch_visits[batch] = 1
        
        # Update unique users with existence check
        if batch in batch_unique_users:
            batch_unique_users[batch].add(user_id)
        else:
            batch_unique_users[batch] = {user_id}
    
    return batch_visits, batch_unique_users