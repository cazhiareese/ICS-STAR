from fastapi import APIRouter
from datetime import datetime, timedelta
from typing import List, Dict
from routers.userlogs_routes import user_logs  # Access the user_logs from the user router
from util.reports_logic import logic_30_days_report, logic_unique_users, logic_batch_vists


router = APIRouter(
    prefix="/user",
    tags=["users"]
)

# Call get_all_logs by sending a GET request to /user/all endpoint which will return all user logs that have been created
#
# Returns: a dictionary containing all user logs
@router.get("/all")
def get_all_logs(): # Get all existing users
    return {"logs": user_logs} 

# Call get_last_30_days_report by sending a GET request to /user/last30days endpoint which will return a report of user visits in the last 30 days
# Uses logic functions from reports_logic
#
# Returns: a dictionary containing the report
@router.get("/last30days")
def get_last_30_days_report():
    
    recent_logs = logic_30_days_report(user_logs) # Call logic function from reports_logic
    unique_users = logic_unique_users(recent_logs)
    

    current_date = datetime.now() # Calculate date range
    thirty_days_ago = current_date - timedelta(days=30)

    report = f"User Visit Report (Last 30 Days)\n"
    report += f"Total unique visitors: {len(unique_users)}\n"
    report += f"Total visits: {len(recent_logs)}\n"
    report += f"Period: {thirty_days_ago.strftime('%Y-%m-%d')} to {current_date.strftime('%Y-%m-%d')}"
    
    return {"report": report}

# Call get_batch_report by sending a GET request to /user/by_batch endpoint which will return a report of user visits by graduation batch
# Uses logic functions from reports_logic
#
# Returns: a dictionary containing the report
@router.get("/by_batch")
def get_batch_report():
    batch_visits, batch_unique_users = logic_batch_vists(user_logs) # Call logic function from reports_logic
    
    report = f"User Visit Report by Graduation Batch\n"
    report += f"{'Batch':<10} {'Unique Users':<15} {'Total Visits':<15}\n"
    report += f"{'-'*40}\n"
    
    batch_keys = list(batch_visits.keys()) # Convert keys to list for sorting
    batch_keys.sort()
    
    for batch in batch_keys:
        unique_users = len(batch_unique_users[batch])
        visits = batch_visits[batch]
        report += f"{batch:<10} {unique_users:<15} {visits:<15}\n"
    
    return {"report": report}

# Call get_specific_batch_report by sending a GET request to /user/batch/{batch_year} endpoint which will return a report of user visits for 
# a specific graduation batch
#
# Uses logic functions from reports_logic
# 
# Arguments: batch_year - the graduation batch year to filter the report
# 
# Returns: a dictionary containing the report
@router.get("/batch/{batch_year}")
def get_specific_batch_report(batch_year: int):
    batch_logs = []
    for log in user_logs:
        if log["batch"] == batch_year:
            batch_logs.append(log)
    
    if not batch_logs:
        return {"report": f"No data found for batch {batch_year}"}
    
    unique_users = logic_unique_users(batch_logs)
    
    report = f"User Visit Report for Batch {batch_year}\n"
    report += f"Total unique visitors: {len(unique_users)}\n"
    report += f"Total visits: {len(batch_logs)}"
    
    return {"report": report}