import math
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from config.database import get_db
from datetime import datetime, timedelta, timezone

from sqlalchemy import Date, String, case, cast, desc, func, and_, literal, select, union_all
from sqlalchemy.orm import Session

from models.usermodel import User, UserTypeEnum
from models.donationmodel import MonetaryDonation, InKindDonation
from models.report_model import Report, ReportStatusEnum
from models.event_model import Event, EventDate
from models.donationmodel import DonationDrive
from models.log import Log

from schemas.events_schema import UpcomingEventResponse
from schemas.donation_schema import RecentDonationResponse, TopFundedDriveResponse

from util.userutil import require_admin

router = APIRouter(
    prefix="/admin_dashboard",
    tags=["Admin Dashboard"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal Server Error"},
    },
)

# Fetch number of unverified users
@router.get("/unverified_users_count", dependencies=[Depends(require_admin)], response_model=Dict[str, int])
async def get_unverified_users_count(
    db: Session = Depends(get_db)
    ):
    try:
        unverified_users_count = db.query(User).filter(User.is_verified == False).count()
        return {"unverified_users_count": unverified_users_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Fetch number of not yet acknowledged donations
@router.get("/not_yet_acknowledged_donations_count", dependencies=[Depends(require_admin)], response_model=Dict[str, int])
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
@router.get("/pending-reported-posts/count", dependencies=[Depends(require_admin)], response_model=Dict[str, int])
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
@router.get("/pending-reported-users/count", dependencies=[Depends(require_admin)], response_model=Dict[str, int])
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

# Fetch the number of donation drives that are still open
@router.get("/open-drives/count", dependencies=[Depends(require_admin)], response_model=Dict[str, int])
async def get_open_drives_count(
    db: Session = Depends(get_db)
    ):
    count = db.query(func.count(DonationDrive.drive_id))\
        .filter(
            DonationDrive.is_closed == False,
            DonationDrive.is_deleted == False
        )\
        .scalar()
    
    return {"open_drives_count": count}

@router.get("/upcoming-events", dependencies=[Depends(require_admin)], response_model=List[UpcomingEventResponse])
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
        .limit(3)
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

@router.get("/recent-donors", dependencies=[Depends(require_admin)], response_model=List[RecentDonationResponse])
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

@router.get("/top-funded-drives", dependencies=[Depends(require_admin)], response_model=List[TopFundedDriveResponse])
async def get_top_funded_drives(
    db: Session = Depends(get_db)
    ):
    # Query to get donation drive metrics - only count acknowledged donations
    results = db.execute(
        select(
            DonationDrive.drive_id,
            DonationDrive.title,
            DonationDrive.target_cost,
            func.sum(
                case(
                    (MonetaryDonation.is_acknowledged == True, MonetaryDonation.amount),
                    else_=0
                )
            ).label("total_donations"),
            func.count(
                case(
                    (MonetaryDonation.is_acknowledged == True, MonetaryDonation.donation_id),
                    else_=None
                )
            ).label("acknowledged_count")
        )
        .select_from(DonationDrive)
        .join(
            MonetaryDonation,
            DonationDrive.drive_id == MonetaryDonation.drive_id
        )
        .where(
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False,
            DonationDrive.is_general == False,
        )
        .group_by(DonationDrive.drive_id, DonationDrive.title, DonationDrive.target_cost)
        .order_by(desc("total_donations"))
        .limit(3)
    ).all()

    # Format response
    response = []
    for result in results:
        # Calculate percentage funded (handle division by zero)
        target = float(result.target_cost) if result.target_cost else 0
        total = float(result.total_donations) if result.total_donations else 0
        
        percentage = 0
        if target > 0 and total > 0:
            percentage = (total / target) * 100
            percentage = round(percentage, 2)  # Round to 2 decimal places
        
        monetary_donors = set(
            row[0] for row in db.execute(
                select(MonetaryDonation.user_id)
                .where(
                    MonetaryDonation.drive_id == result.drive_id,
                    MonetaryDonation.is_acknowledged == True,
                    MonetaryDonation.user_id.isnot(None)
                )
            ).all()
        )
        
        inkind_donors = set(
            row[0] for row in db.execute(
                select(InKindDonation.user_id)
                .where(
                    InKindDonation.drive_id == result.drive_id,
                    InKindDonation.is_acknowledged == True,
                    InKindDonation.user_id.isnot(None)
                )
            ).all()
        )
        
        # Combine both sets to get unique donors
        unique_donors_count = len(monetary_donors.union(inkind_donors))
        
        response.append({
            "drive_id": result.drive_id,
            "title": result.title,
            "total_donations": total,
            "target_cost": target,
            "acknowledged_donations": result.acknowledged_count or 0,
            "percentage_funded": percentage,
            "unique_donors_count": unique_donors_count
        })

    response.sort(key=lambda x: x["percentage_funded"], reverse=True)
    
    return response

@router.get("/visits", dependencies=[Depends(require_admin)], response_model=dict)
def get_visits(db: Session = Depends(get_db)):
    today = datetime.utcnow()
    start_date = today - timedelta(days=30)
    
    # Query logs from the last 30 days
    query_result = (
        db.query(
            cast(Log.date_time, Date).label('day'),
            func.count(Log.log_id).label('visits')
        )
        .filter(Log.date_time >= start_date)
        .group_by(cast(Log.date_time, Date))
        .order_by(cast(Log.date_time, Date))
        .all()
    )
    
    # Create a dictionary of existing dates and their visit counts
    date_dict = {day.strftime("%b %d"): visits for day, visits in query_result}
    
    # Create the complete result with all days
    result = []
    total_visits = 0
    for i in range(30):
        date = (today - timedelta(days=30 - i - 1)).strftime("%b %d")
        visits = date_dict.get(date, 0)
        total_visits += visits
        result.append({
            "date": date,
            "visits": visits
        })
    
    return {
        "total_visits": total_visits,
        "data": result
    }

@router.get("/user_statistics", dependencies=[Depends(require_admin)])
def get_alumni_statistics(db: Session = Depends(get_db)):
    # Get number of verified alumni users
    verified_alumni_count = db.query(func.count(User.user_id))\
        .filter(User.is_verified == True)\
        .filter(User.user_type == UserTypeEnum.alumni)\
        .scalar()
    
    # Get top 4 countries of verified alumni with percentages, ignoring null values
    country_counts = db.query(User.country, func.count(User.user_id).label('count'))\
        .filter(User.is_verified == True)\
        .filter(User.user_type == UserTypeEnum.alumni)\
        .filter(User.country.isnot(None))\
        .group_by(User.country)\
        .order_by(func.count(User.user_id).desc())\
        .limit(4)\
        .all()
    
    # Count verified alumni country data 
    alumni_with_country = db.query(func.count(User.user_id))\
        .filter(User.is_verified == True)\
        .filter(User.user_type == UserTypeEnum.alumni)\
        .filter(User.country.isnot(None))\
        .scalar()
    
    top_countries = []
    for country, count in country_counts:
        percentage = (count / alumni_with_country) * 100 if alumni_with_country else 0
        top_countries.append({"country": country, "percentage": round(percentage, 2)})
    
    others_percentage = 100 - sum(loc["percentage"] for loc in top_countries)
    if others_percentage > 0:
        top_countries.append({"country": "others", "percentage": round(others_percentage, 2)})
    
    # Get top 4 industries of verified alumni with percentages, ignoring null values
    industry_counts = db.query(User.industry, func.count(User.user_id).label('count'))\
        .filter(User.is_verified == True)\
        .filter(User.user_type == UserTypeEnum.alumni)\
        .filter(User.industry.isnot(None))\
        .group_by(User.industry)\
        .order_by(func.count(User.user_id).desc())\
        .limit(4)\
        .all()
    
    # Count verified alumni with valid industry data (for accurate percentage calculation)
    alumni_with_industry = db.query(func.count(User.user_id))\
        .filter(User.is_verified == True)\
        .filter(User.user_type == UserTypeEnum.alumni)\
        .filter(User.industry.isnot(None))\
        .scalar()
    
    top_industries = []
    for industry, count in industry_counts:
        percentage = (count / alumni_with_industry) * 100 if alumni_with_industry else 0
        top_industries.append({"industry": industry, "percentage": round(percentage, 2)})
    
    others_percentage = 100 - sum(ind["percentage"] for ind in top_industries)
    if others_percentage > 0:
        top_industries.append({"industry": "others", "percentage": round(others_percentage, 2)})
    
    return {
        "verified_alumni_count": verified_alumni_count,
        "top_alumni_countries": top_countries,
        "top_alumni_industries": top_industries
    }