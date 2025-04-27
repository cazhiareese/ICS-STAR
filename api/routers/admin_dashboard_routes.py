import math
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, and_, select
from sqlalchemy.orm import Session
from config.database import get_db
from models.usermodel import User
from models.donationmodel import MonetaryDonation, InKindDonation
from models.report_model import Report, ReportStatusEnum
from models.event_model import Event, EventDate
from datetime import datetime, timezone
from schemas.events_schema import UpcomingEventResponse

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
async def get_upcoming_events(db: Session = Depends(get_db)):
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