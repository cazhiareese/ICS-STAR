from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Date, cast, extract, func
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from models.log import Log
from models.usermodel import User
from schemas.log import VisitResponse, TimeRange

router = APIRouter(
    prefix="/admin/engagement-statistics",
    tags=["Admin Engagement Statistics"],
    responses={
        404: {
            "description": "Not found",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Not found"
                    }
                }
            }
        }
    }
)

@router.get("/visits", response_model=List[VisitResponse])
def get_visits(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for visit data"),
    batch: Optional[str] = Query(None, description="Filter by batch year (e.g., '2002'). Default is all batches."),
    db: Session = Depends(get_db)
):
    today = datetime.utcnow()
    
    # Create base query
    if batch:
        # Filter by specific batch - join with User table
        base_query = db.query(Log).join(User, Log.user_id == User.user_id)
        # Filter by first four characters of student number
        base_query = base_query.filter(func.substring(User.student_number, 1, 4) == batch)
    else:
        # No batch filter - use only the Log table
        base_query = db.query(Log)
    
    if time_range == TimeRange.WEEK:
        # Last 7 days
        start_date = today - timedelta(days=7)
        
        query_result = (
            base_query
            .filter(Log.date_time >= start_date)
            .with_entities(
                cast(Log.date_time, Date).label('day'),
                func.count(Log.log_id).label('visits')
            )
            .group_by(cast(Log.date_time, Date))
            .order_by(cast(Log.date_time, Date))
            .all()
        )
        
        # Create a dictionary of existing dates and their visit counts
        date_dict = {day.strftime("%b %d"): visits for day, visits in query_result}
        
        # Create the complete result with all days
        result = []
        for i in range(7):
            date = (today - timedelta(days=7-i-1)).strftime("%b %d")
            result.append({
                "date": date,
                "visits": date_dict.get(date, 0)
            })
            
    elif time_range == TimeRange.MONTH:
        # Last 30 days
        start_date = today - timedelta(days=30)
        
        query_result = (
            base_query
            .filter(Log.date_time >= start_date)
            .with_entities(
                cast(Log.date_time, Date).label('day'),
                func.count(Log.log_id).label('visits')
            )
            .group_by(cast(Log.date_time, Date))
            .order_by(cast(Log.date_time, Date))
            .all()
        )
        
        # Create a dictionary of existing dates and their visit counts
        date_dict = {day.strftime("%b %d"): visits for day, visits in query_result}
        
        # Create the complete result with all days
        result = []
        for i in range(30):
            date = (today - timedelta(days=30-i-1)).strftime("%b %d")
            result.append({
                "date": date,
                "visits": date_dict.get(date, 0)
            })
            
    else:  # time_range == TimeRange.YEAR:
        # Past year (monthly)
        start_date = datetime(today.year - 1, today.month, 1)
        
        query_result = (
            base_query
            .filter(Log.date_time >= start_date)
            .with_entities(
                extract('year', Log.date_time).label('year'),
                extract('month', Log.date_time).label('month'),
                func.count(Log.log_id).label('visits')
            )
            .group_by(
                extract('year', Log.date_time),
                extract('month', Log.date_time)
            )
            .order_by(
                extract('year', Log.date_time),
                extract('month', Log.date_time)
            )
            .all()
        )
        
        # Create a dictionary of existing year-month and their visit counts
        date_dict = {f"{int(year)}-{int(month):02d}": visits for year, month, visits in query_result}
        
        # Create the complete result with all months in the past year
        result = []
        for i in range(12):
            current_month = today.month - i
            current_year = today.year
            
            if current_month <= 0:
                current_month += 12
                current_year -= 1
                
            date_key = f"{current_year}-{current_month:02d}"
            formatted_date = datetime(current_year, current_month, 1).strftime("%b %Y")
            result.append({
                "date": formatted_date,
                "visits": date_dict.get(date_key, 0)
            })
            
        # Reverse to get chronological order
        result.reverse()
        
    return result

