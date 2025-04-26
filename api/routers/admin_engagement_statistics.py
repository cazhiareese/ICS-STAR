from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Date, and_, cast, desc, distinct, extract, func
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from models.log import Log
from models.usermodel import User
from models.job_posting_model import JobPosting, JobPostingInterestedIn
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation
from schemas.log import VisitResponse, TimeRange, TopJobResponse, TopDriveResponse, TopDonationDriveResponse

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

@router.get("/jobs/top-interested", response_model=List[TopJobResponse])
def get_top_interested_jobs(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for job posting data"),
    db: Session = Depends(get_db)
):
    today = datetime.utcnow()

    # Determine the start date based on the time range
    if time_range == TimeRange.WEEK:
        start_date = today - timedelta(days=7)
    elif time_range == TimeRange.MONTH:
        start_date = today - timedelta(days=30)
    else:  # time_range == TimeRange.YEAR
        start_date = datetime(today.year - 1, today.month, today.day)
    
    # Query to get top 3 job postings with most interest
    top_jobs = (
        db.query(
            JobPosting.title,
            JobPosting.company,
            JobPosting.image,
            JobPosting.date_posted,
            func.count(JobPostingInterestedIn.user_id).label('interested_count')
        )
        .join(JobPostingInterestedIn, JobPosting.post_id == JobPostingInterestedIn.post_id)
        .filter(
            and_(
                JobPosting.date_posted >= start_date,
                JobPosting.is_deleted == False
            )
        )
        .group_by(
            JobPosting.post_id,
            JobPosting.title,
            JobPosting.company,
            JobPosting.image,
            JobPosting.date_posted
        )
        .order_by(desc('interested_count'))
        .limit(3)
        .all()
    )
    
    # Format the results
    result = []
    for job in top_jobs:
        result.append({
            "title": job.title,
            "company": job.company,
            "image": job.image,
            "date_posted": job.date_posted.strftime("%Y-%m-%d"),
            "interested_count": job.interested_count
        })
    
    return result

@router.get("/donation-drives/top", response_model=List[TopDriveResponse])
def get_top_donation_drives(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for donation drive data"),
    db: Session = Depends(get_db)
):
    today = datetime.utcnow()
    
    # Determine the start date based on the time range
    if time_range == TimeRange.WEEK:
        start_date = today - timedelta(days=7)
    elif time_range == TimeRange.MONTH:
        start_date = today - timedelta(days=30)
    else:  # time_range == TimeRange.YEAR
        start_date = datetime(today.year - 1, today.month, today.day)
    
    # Create subqueries for monetary and in-kind donations to get unique donors per drive
    monetary_donors = (
        db.query(
            MonetaryDonation.drive_id,
            MonetaryDonation.user_id
        )
        .filter(
            and_(
                MonetaryDonation.date_donated >= start_date,
                MonetaryDonation.is_acknowledged == True
            )
        )
        .distinct()
        .subquery('monetary_donors')
    )
    
    in_kind_donors = (
        db.query(
            InKindDonation.drive_id,
            InKindDonation.user_id
        )
        .filter(
            and_(
                InKindDonation.date_donated >= start_date,
                InKindDonation.is_acknowledged == True
            )
        )
        .distinct()
        .subquery('in_kind_donors')
    )
    
    # Union of both donor types
    all_donors = (
        db.query(
            monetary_donors.c.drive_id.label('drive_id'), 
            monetary_donors.c.user_id.label('user_id')
        )
        .union(
            db.query(
                in_kind_donors.c.drive_id.label('drive_id'), 
                in_kind_donors.c.user_id.label('user_id')
            )
        )
        .distinct()
        .subquery('all_donors')
    )

    
    # Join with DonationDrive to get the top 3 drives with most donors
    top_drives = (
        db.query(
            DonationDrive.title,
            DonationDrive.image,
            func.count(all_donors.c.user_id).label('donor_count')
        )
        .join(all_donors, DonationDrive.drive_id == all_donors.c.drive_id)
        .filter(
            and_(
                DonationDrive.is_deleted == False,
                DonationDrive.created_at >= start_date
            )
        )
        .group_by(
            DonationDrive.drive_id,
            DonationDrive.title,
            DonationDrive.image
        )
        .order_by(desc('donor_count'))
        .limit(3)
        .all()
    )
    
    # Format the results
    result = []
    for drive in top_drives:
        result.append({
            "title": drive.title,
            "image": drive.image,
            "donor_count": drive.donor_count
        })
    
    return result

@router.get("/donation-drives/top-donations", response_model=TopDonationDriveResponse)
def get_top_donation_drive(
    time_range: TimeRange = Query(TimeRange.MONTH, description="Time range for donation drive data"),
    db: Session = Depends(get_db)
):
    # --- Utility: Calculate start date based on time_range ---
    today = datetime.utcnow()
    if time_range == TimeRange.WEEK:
        start_date = today - timedelta(days=7)
    elif time_range == TimeRange.MONTH:
        start_date = today - timedelta(days=30)
    else:  # YEAR
        start_date = datetime(today.year - 1, today.month, today.day)

    # --- Main Query ---
    drive = (
        db.query(
            DonationDrive.title,
            func.count(distinct(MonetaryDonation.user_id)).label('donor_count'),
            func.coalesce(func.sum(MonetaryDonation.amount), 0).label('amount_gathered'),
            DonationDrive.target_cost,
            (
                func.coalesce(func.sum(MonetaryDonation.amount), 0) /
                func.nullif(DonationDrive.target_cost, 0) * 100
            ).label('percentage_progress')
        )
        .join(MonetaryDonation, DonationDrive.drive_id == MonetaryDonation.drive_id)
        .filter(
            and_(
                DonationDrive.is_deleted == False,
                MonetaryDonation.is_acknowledged == True,
                MonetaryDonation.date_donated >= start_date
            )
        )
        .group_by(DonationDrive.drive_id, DonationDrive.title, DonationDrive.target_cost)
        .order_by(desc('amount_gathered'))
        .first()
    )

    if not drive:
        raise HTTPException(status_code=404, detail="No donation drives found for the selected time range.")

    return TopDonationDriveResponse(
        title=drive.title,
        donor_count=drive.donor_count,
        amount_gathered=float(drive.amount_gathered),
        target_cost=float(drive.target_cost),
        percentage_progress=float(drive.percentage_progress)
    )