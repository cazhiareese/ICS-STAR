import math
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import String, cast, desc, func, and_, literal, select, union_all
from sqlalchemy.orm import Session
from config.database import get_db
from models.usermodel import User
from models.donationmodel import MonetaryDonation, InKindDonation
from models.report_model import Report, ReportStatusEnum
from models.event_model import Event, EventDate
from models.donationmodel import DonationDrive
from datetime import datetime, timezone
from schemas.events_schema import UpcomingEventResponse
from schemas.donation_schema import RecentDonationResponse

router = APIRouter(
    prefix="/admin_dashboard",
    tags=["Admin Dashboard"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal Server Error"},
    },
)

# Fetch number of unverified users
@router.get("/unverified_users_count", response_model=Dict[str, int])
async def get_unverified_users_count(
    db: Session = Depends(get_db)
    ):
    try:
        unverified_users_count = db.query(User).filter(User.is_verified == False).count()
        return {"unverified_users_count": unverified_users_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Fetch number of not yet acknowledged donations
@router.get("/not_yet_acknowledged_donations_count", response_model=Dict[str, int])
async def get_not_yet_acknowledged_donations_count(
    db: Session = Depends(get_db)
    ):
    try:
        not_yet_acknowledged_motary_count = db.query(MonetaryDonation).filter(MonetaryDonation.is_acknowledged == None).count()
        not_yet_acknowledged_in_kind_count = db.query(InKindDonation).filter(InKindDonation.is_acknowledged == None).count()
        not_yet_acknowledged_donations_count = not_yet_acknowledged_motary_count + not_yet_acknowledged_in_kind_count
        return {"not_yet_acknowledged_donations_count": not_yet_acknowledged_donations_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Fetch number of reported posts
@router.get("/pending-reported-posts/count", response_model=Dict[str, int])
async def get_reported_posts_count(
    db: Session = Depends(get_db)
    ):
    count = db.query(func.count(Report.report_id))\
        .filter(
            Report.reported_post_id.isnot(None),
            Report.status == ReportStatusEnum.pending
        )\
        .scalar()
    
    return {"pending_reported_posts_count": count}

# Fetch number of reported users
@router.get("/pending-reported-users/count", response_model=Dict[str, int])
async def get_reported_users_count(
    db: Session = Depends(get_db)
    ):
    count = db.query(func.count(Report.report_id))\
        .filter(
            Report.reported_user_id.isnot(None),
            Report.reported_post_id.is_(None),
            Report.status == ReportStatusEnum.pending
        )\
        .scalar()
    
    return {"pending_reported_users_count": count}

@router.get("/upcoming-events", response_model=List[UpcomingEventResponse])
async def get_upcoming_events(
    db: Session = Depends(get_db)
    ):
    # Current date and time
    now = datetime.now(timezone.utc)
    
    # Query to get events with their earliest upcoming date
    subquery = (
        select(
            Event.event_id,
            Event.title,
            Event.location,
            func.min(EventDate.date).label("earliest_date")
        )
        .join(EventDate, Event.event_id == EventDate.event_id)
        .where(
            and_(
                Event.is_concluded == False,
                Event.is_closed == False,
                Event.is_deleted == False,
                EventDate.date > now
            )
        )
        .group_by(Event.event_id, Event.title, Event.location)
        .order_by("earliest_date")
        .limit(5)
        .subquery()
    )
    
    # Final query joining with the subquery
    results = db.execute(
        select(
            subquery.c.event_id,
            subquery.c.title,
            subquery.c.location,
            subquery.c.earliest_date
        )
    ).all()
    
    # Calculate days left for each event
    response = []
    for result in results:
        days_left = math.ceil((result.earliest_date - now).total_seconds() / 86400)
        response.append({
            "event_id": str(result.event_id),
            "title": result.title,
            "date": result.earliest_date,
            "location": result.location,
            "days_left": days_left
        })
    
    return response

@router.get("/recent-donors", response_model=List[RecentDonationResponse])
async def get_recent_donations(
    db: Session = Depends(get_db)
    ):
    # Query for monetary donations - cast amount to String for type compatibility
    monetary_query = (
        select(
            DonationDrive.title.label("drive_title"),
            User.first_name.label("first_name"),
            User.last_name.label("last_name"),
            MonetaryDonation.is_anonymous.label("is_anonymous"),
            cast(MonetaryDonation.amount, String).label("details"),
            MonetaryDonation.date_donated.label("date_donated"),
            literal("monetary").label("donation_type")
        )
        .select_from(MonetaryDonation)
        .join(DonationDrive, MonetaryDonation.drive_id == DonationDrive.drive_id)
        .join(User, MonetaryDonation.user_id == User.user_id)
    )

    # Query for in-kind donations
    in_kind_query = (
        select(
            DonationDrive.title.label("drive_title"),
            User.first_name.label("first_name"),
            User.last_name.label("last_name"),
            literal(False).label("is_anonymous"),
            InKindDonation.description.label("details"),
            InKindDonation.date_donated.label("date_donated"),
            literal("in-kind").label("donation_type")
        )
        .select_from(InKindDonation)
        .join(DonationDrive, InKindDonation.drive_id == DonationDrive.drive_id)
        .join(User, InKindDonation.user_id == User.user_id)
    )

    # Combine queries with union_all
    combined_query = union_all(monetary_query, in_kind_query).alias("combined_donations")

    # Final query to get the 5 most recent donations
    results = db.execute(
        select(combined_query)
        .order_by(desc(combined_query.c.date_donated))
        .limit(5)
    ).all()

    # Format response with only the required fields
    response = []
    for result in results:
        # Format the donor name based on anonymity
        donor_name = "Anonymous" if result.is_anonymous else f"{result.first_name} {result.last_name}"
        
        # Format monetary details with currency symbol
        details = result.details
        if result.donation_type == "monetary":
            details = f"₱{details}"
        
        response.append({
            "drive_title": result.drive_title,
            "donor_name": donor_name,
            "donation_details": details
        })
    
    return response