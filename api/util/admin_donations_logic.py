from typing import Dict, List, Optional, Tuple
from fastapi import Query
from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import String, func, or_, text, union_all, desc, case
from sqlalchemy.sql import distinct
from models.usermodel import User
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation, DonationDriveLink
from schemas.donation_schema import AdminDonationDriveOut, AdminOneDonationDriveOut, PercentOut, AdminOverviewDonationDrive, MonetaryDonationOut, InKindDonationOut, GenericDriveOut, ShortenedMonetaryDonationsOut, ShortenedInKindDonationsOut, AdminGenericDriveView, AdminClosedDonationDriveOut
from schemas.log import TimeRange
from datetime import datetime, timedelta
from uuid import UUID

# Function to search for donation drives based on various filters
#
# Arguments:
# db: Session - database session
# search_string: str - string to search in the title of the donation drive
# date_filter: str - filter for date range ("last_7_days", "this_week", "this_month", "this_year", "custom")
# custom_created_at: datetime.date - start date for custom filter (MM/DD/YYYY)
# custom_end_date: datetime.date - end date for custom filter (MM/DD/YYYY)
#
# Returns: a list of AdminDonationDriveOut objects
def search_donation_drives(
    db: Session, 
    search_string: str = "",
    sort_by: str = "",
    is_closed: bool = False, 
) -> list[AdminDonationDriveOut]:
    
    if is_closed:
        query = db.query(DonationDrive.drive_id, DonationDrive.title, DonationDrive.created_at).filter(DonationDrive.is_closed == True)

        if sort_by == "date_created_newest":
            query = query.order_by(DonationDrive.created_at.desc())
        elif sort_by == "date_created_oldest":
            query = query.order_by(DonationDrive.created_at.asc())
        elif sort_by == "amount_raised_descending":
            query = query.order_by(DonationDrive.target_cost.desc())
        elif sort_by == "amount_raised_ascending":
            query = query.order_by(DonationDrive.target_cost.asc())
        elif sort_by == "percent_funded_descending":
            query = query.order_by(DonationDrive.target_cost.desc())
        elif sort_by == "percent_funded_ascending":
            query = query.order_by(DonationDrive.target_cost.asc())
        elif sort_by == "donation_count_descending":
            query = query.order_by(DonationDrive.target_cost.desc())
        elif sort_by == "donation_count_ascending":
            query = query.order_by(DonationDrive.target_cost.asc())
        elif sort_by == "date_closed_newest":
            query = query.order_by(DonationDrive.updated_at.desc())
        elif sort_by == "date_closed_oldest":
            query = query.order_by(DonationDrive.updated_at.asc())
        else: # default sort is newest created
            query = query.order_by(DonationDrive.created_at.desc())

    else:
        query = db.query(DonationDrive.drive_id, DonationDrive.title, DonationDrive.created_at).filter(DonationDrive.is_closed == False)

        if sort_by == "date_created_newest":
            query = query.order_by(DonationDrive.created_at.desc())
        elif sort_by == "date_created_oldest":
            query = query.order_by(DonationDrive.created_at.asc())
        elif sort_by == "amount_raised_descending":
            query = query.order_by(DonationDrive.target_cost.desc())
        elif sort_by == "amount_raised_ascending":
            query = query.order_by(DonationDrive.target_cost.asc())
        elif sort_by == "percent_funded_descending":
            query = query.order_by(DonationDrive.target_cost.desc())
        elif sort_by == "percent_funded_ascending":
            query = query.order_by(DonationDrive.target_cost.asc())
        elif sort_by == "donation_count_descending":
            query = query.order_by(DonationDrive.target_cost.desc())
        elif sort_by == "donation_count_ascending":
            query = query.order_by(DonationDrive.target_cost.asc())
        elif sort_by == "date_closed_newest":
            query = query.order_by(DonationDrive.updated_at.desc())
        elif sort_by == "date_closed_oldest":
            query = query.order_by(DonationDrive.updated_at.asc())
        else:
            query = query.order_by(DonationDrive.created_at.desc())

    
    # Apply search filter if provided
    if search_string:
        query = query.filter(DonationDrive.title.ilike(f"%{search_string}%"))

    drives = query.all()

    drive_out_list = []

    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue

        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )

        drive_out_list.append(drive_out)

    return drive_out_list

def get_all_open_drives(db: Session, page: int = 1, page_size: int = 10) -> list[AdminDonationDriveOut]:
    # Base query for open drives
    base_query = db.query(DonationDrive).filter(DonationDrive.is_closed == False)
    
    # Apply pagination
    offset = (page - 1) * page_size
    drives = base_query.offset(offset).limit(page_size).all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:

        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue

        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(
            MonetaryDonation.drive_id == drive.drive_id, 
            MonetaryDonation.is_acknowledged == True
        ).scalar() or 0
        
        # Calculate in-kind donation count
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(
            InKindDonation.drive_id == drive.drive_id
        ).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(
            MonetaryDonation.drive_id == drive.drive_id, 
            MonetaryDonation.is_acknowledged == True
        ).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    return drive_out_list

def get_all_open_drives_by_amount_raised_descending(db: Session, title: Optional[str]) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:

        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue

        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.amount_raised, reverse=True)
    
    return drive_out_list

def get_all_open_drives_by_amount_raised_ascending(title: Optional[str], db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"), DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.amount_raised)
    
    return drive_out_list

def get_all_open_drives_by_percent_funded_descending(title: Optional[str],db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.percent_funded, reverse=True)
    
    return drive_out_list

def get_all_open_drives_by_percent_funded_ascending(title: Optional[str],db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.percent_funded)
    
    return drive_out_list

def get_all_open_drives_by_donation_count_descending(title: Optional[str], db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.donation_count, reverse=True)
    
    return drive_out_list

def get_all_open_drives_by_donation_count_ascending(title: Optional[str],db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.donation_count)
    
    return drive_out_list

def get_all_open_drives_by_date_created_newest(title: Optional[str],db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.created_at, reverse=True)
    
    return drive_out_list

def get_all_open_drives_by_date_created_oldest(title: Optional[str], db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == False)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded
        remaining_percentage = percent_info.remaining_percent

        # Format created_at date to Month DD, YYYY
        date_created = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = date_created,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.created_at)
    
    return drive_out_list

def get_all_closed_drives(db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        
        if drive.drive_id == UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384"):
            continue

        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    return drive_out_list

def get_all_closed_drives_by_date_closed_newest(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.date_closed, reverse=True)
    
    return drive_out_list

def get_all_closed_drives_by_date_closed_oldest(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None
        
        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.date_closed)
    
    return drive_out_list

def get_all_closed_drives_by_amount_raised_descending(title: Optional[str], db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.amount_raised, reverse=True)
    
    return drive_out_list

def get_all_closed_drives_by_amount_raised_ascending(title: Optional[str], db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.amount_raised)
    
    return drive_out_list

def get_all_closed_drives_by_donation_count_descending(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            date_created = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
            donation_count = total_count
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.donation_count, reverse=True)
    
    return drive_out_list

def get_all_closed_drives_by_donation_count_ascending(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate monetary donation count
        monetary_count = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0
        
        # Calculate in-kind donation count separately without referencing the 'amount' column
        inkind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar() or 0
        
        total_count = monetary_count + inkind_count
        
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
            donation_count = total_count
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.donation_count)
    
    return drive_out_list

def get_all_closed_drives_by_date_created_newest(title: Optional[str], db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.created_at, reverse=True)
    
    return drive_out_list

def get_all_closed_drives_by_date_created_oldest(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at= open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.created_at)
    
    return drive_out_list

def get_all_closed_drives_by_percent_funded_descending(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.percent_funded, reverse=True)
    
    return drive_out_list

def get_all_closed_drives_by_percent_funded_ascending(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.percent_funded)
    
    return drive_out_list

def get_all_closed_drives_by_target_cost_descending(title: Optional[str], db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at= open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.target_cost, reverse=True)
    
    return drive_out_list

def get_all_closed_drives_by_target_cost_ascending(title: Optional[str],db: Session) -> list[AdminClosedDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.title.ilike(f"%{title}%"),DonationDrive.is_closed == True)
    
    drives = query.all()

    if not drives:
        return []
    
    drive_out_list = []
    for drive in drives:
        # Calculate amount raised by summing up the amount in monetary_donation table only for acknowledged donations
        total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

        # Calculate percent funded and remaining percentage
        percent_info = get_percent_funded(db, drive.drive_id)
        total_percentage = percent_info.percent_funded

        # Format created_at date to Month DD, YYYY
        close_date = drive.updated_at.strftime("%B %d, %Y") if drive.updated_at else None
        open_date = drive.created_at.strftime("%B %d, %Y") if drive.created_at else None

        drive_out = AdminClosedDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            date_closed = close_date,
            created_at = open_date,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            target_cost = drive.target_cost,
        )
        drive_out_list.append(drive_out)

    drive_out_list.sort(key=lambda x: x.target_cost)
    
    return drive_out_list

# Viewing a specific donation drive
#
# Arguments:
# db: Session - database session
# drive_id: UUID - ID of the donation drive to view
# 
# Returns: AdminOneDonationDriveOut object containing details of the donation drive
def view_donation_drive(db: Session, drive_id: UUID) -> AdminOneDonationDriveOut:
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()

    if not drive:
        return []
    
    # Calculate total amount raised from acknowledged monetary donations only
    total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged == True
    ).scalar() or 0
    
    percent_info = get_percent_funded(db, drive.drive_id)
    total_percentage = percent_info.percent_funded
    remaining_percentage = percent_info.remaining_percent

    drive_links = get_all_links_by_drive_id(db, drive_id)

    date_started = drive.created_at.strftime("%m/%d/%Y") if drive.created_at else None

    return AdminOneDonationDriveOut(
        drive_id = drive.drive_id,
        title = drive.title,
        percent_funded = total_percentage,
        current_amount = total_amount,
        target_cost = drive.target_cost,
        is_closed = drive.is_closed,
        remaining_percent = remaining_percentage,
        links = drive_links,
        created_at = date_started,
        description = drive.description
    )

def get_all_pending_donations(
    db: Session,
    drive_id: UUID,
) -> dict:
    
    # Get all pending monetary donations
    pending_monetary_donations, monetary_stats = get_all_pending_monetary_donations(db, drive_id)
    
    # Get all pending in-kind donations
    pending_inkind_donations, inkind_stats = get_all_pending_inkind_donations(db, drive_id)

    # Combine pending donations into one list
    pending_verifications = []
    for donation in pending_monetary_donations:
        pending_verifications.append(donation.dict())
    for donation in pending_inkind_donations:
        pending_verifications.append(donation.dict())

    return pending_verifications, {
        "monetary_stats": monetary_stats,
        "inkind_stats": inkind_stats
    }

def get_all_verified_donations(
    db: Session,
    drive_id: UUID,
) -> list:
    
    # Get all verified monetary donations
    verified_monetary_donations = get_all_verified_monetary_donations(db, drive_id)
    
    # Get all verified in-kind donations
    verified_inkind_donations = get_all_verified_inkind_donations(db, drive_id)

    # Combine verified donations into one list
    pending_verifications = []
    for donation in verified_monetary_donations:
        pending_verifications.append(donation.dict())
    for donation in verified_inkind_donations:
        pending_verifications.append(donation.dict())

    return pending_verifications

# this is the same as view_donation_drive, except it is hardcoded to the drive_id of the generic drive and we will return total amount
# of verified monetary, and unverified monetary donations instead of the percent progress 
def view_generic_drive(db: Session, drive_id: UUID) -> AdminDonationDriveOut:
    drive = db.query(DonationDrive.drive_id, DonationDrive.title).filter(DonationDrive.drive_id == drive_id).first()

    if not drive:
        return []
    
    # Calculate total amount raised from acknowledged monetary donations only
    total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        or_(
            MonetaryDonation.is_acknowledged == True,
            MonetaryDonation.is_acknowledged.is_(None)
        )
    ).scalar() or 0
    
    # Get the total amount of monetary donations for the generic drive
    total_verified_monetary = db.query(func.sum(MonetaryDonation.amount)).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged == True
    ).scalar() or 0

    return AdminGenericDriveView(
        drive_id = drive.drive_id,
        title = drive.title,
        grand_total = total_amount,
        verified_total = total_verified_monetary,
    )

# Function to get the percentage statistics of a donation drive
#
# Arguments:
# db: Session - database session
# drive_id: UUID - ID of the donation drive
# 
# Returns: PercentOut object containing percentage statistics
def get_percent_funded(db: Session, drive_id: UUID) -> PercentOut:
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()

    if not drive:
        return []

    total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged == True
    ).scalar() or 0 

    # Calculate percentage
    total_percentage = (total_amount / drive.target_cost) * 100 if drive.target_cost else 0

    # Calculate remaining percent
    remaining_percentage = 100 - total_percentage if total_percentage <= 100 else 0

    return PercentOut(
        percent_funded=round(total_percentage, 2),
        remaining_percent=round(remaining_percentage, 2)
    )

# Update the generic drive statistics
#
# Arguments:
# db: Session - database session
# drive_id: UUID of the generic drive (hardcoded)
#
# Returns: GenericDriveOut object containing the total monetary amount, total in-kind donations, and the number of unverified donations
def update_generic_drive_stats(db: Session, drive_id: UUID):
    # Get the total amount of monetary donations for the generic drive
    total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive_id, MonetaryDonation.is_acknowledged == True).scalar() or 0

    # Get the total in-kind donations for the generic drive
    total_in_kind = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive_id).scalar() or 0

    # Get the number of unverified donations for the generic drive
    number_of_unverified = db.query(func.count(MonetaryDonation.donation_id)).filter(MonetaryDonation.drive_id == drive_id, MonetaryDonation.is_acknowledged == False).scalar() or 0

    return GenericDriveOut(
        total_amount=total_amount,
        total_in_kind=total_in_kind,
        number_of_unverified=number_of_unverified
    )

def update_generic_drive_stats_this_year(db: Session, drive_id: UUID):
    # Get the current year's start date
    current_year = datetime.now().year
    year_start = datetime(current_year, 1, 1)
    
    # Get the total amount of monetary donations for the generic drive in this year
    total_amount = db.query(func.sum(MonetaryDonation.amount))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == True,
            MonetaryDonation.created_at >= year_start
        ).scalar() or 0

    # Get the total in-kind donations for the generic drive in this year
    total_in_kind = db.query(func.count(InKindDonation.donation_id))\
        .filter(
            InKindDonation.drive_id == drive_id,
            InKindDonation.created_at >= year_start
        ).scalar() or 0

    # Get the number of unverified donations for the generic drive in this year
    number_of_unverified = db.query(func.count(MonetaryDonation.donation_id))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == False,
            MonetaryDonation.created_at >= year_start
        ).scalar() or 0

    return GenericDriveOut(
        total_amount=total_amount,
        total_in_kind=total_in_kind,
        number_of_unverified=number_of_unverified
    )


def update_generic_drive_stats_this_month(db: Session, drive_id: UUID):
    # Get the current month's start date
    now = datetime.now()
    month_start = datetime(now.year, now.month, 1)
    
    # Get the total amount of monetary donations for the generic drive in this month
    total_amount = db.query(func.sum(MonetaryDonation.amount))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == True,
            MonetaryDonation.created_at >= month_start
        ).scalar() or 0

    # Get the total in-kind donations for the generic drive in this month
    total_in_kind = db.query(func.count(InKindDonation.donation_id))\
        .filter(
            InKindDonation.drive_id == drive_id,
            InKindDonation.created_at >= month_start
        ).scalar() or 0

    # Get the number of unverified donations for the generic drive in this month
    number_of_unverified = db.query(func.count(MonetaryDonation.donation_id))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == False,
            MonetaryDonation.created_at >= month_start
        ).scalar() or 0

    return GenericDriveOut(
        total_amount=total_amount,
        total_in_kind=total_in_kind,
        number_of_unverified=number_of_unverified
    )


def update_generic_drive_stats_this_week(db: Session, drive_id: UUID):
    # Get the current week's start date (Monday)
    now = datetime.now()
    week_start = now - timedelta(days=now.weekday())
    week_start = datetime(week_start.year, week_start.month, week_start.day)
    
    # Get the total amount of monetary donations for the generic drive in this week
    total_amount = db.query(func.sum(MonetaryDonation.amount))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == True,
            MonetaryDonation.created_at >= week_start
        ).scalar() or 0

    # Get the total in-kind donations for the generic drive in this week
    total_in_kind = db.query(func.count(InKindDonation.donation_id))\
        .filter(
            InKindDonation.drive_id == drive_id,
            InKindDonation.created_at >= week_start
        ).scalar() or 0

    # Get the number of unverified donations for the generic drive in this week
    number_of_unverified = db.query(func.count(MonetaryDonation.donation_id))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == False,
            MonetaryDonation.created_at >= week_start
        ).scalar() or 0

    return GenericDriveOut(
        total_amount=total_amount,
        total_in_kind=total_in_kind,
        number_of_unverified=number_of_unverified
    )


def update_generic_drive_stats_last_seven_days(db: Session, drive_id: UUID):
    # Get the date from 7 days ago
    now = datetime.now()
    seven_days_ago = now - timedelta(days=7)
    
    # Get the total amount of monetary donations for the generic drive in the last 7 days
    total_amount = db.query(func.sum(MonetaryDonation.amount))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == True,
            MonetaryDonation.created_at >= seven_days_ago
        ).scalar() or 0

    # Get the total in-kind donations for the generic drive in the last 7 days
    total_in_kind = db.query(func.count(InKindDonation.donation_id))\
        .filter(
            InKindDonation.drive_id == drive_id,
            InKindDonation.created_at >= seven_days_ago
        ).scalar() or 0

    # Get the number of unverified donations for the generic drive in the last 7 days
    number_of_unverified = db.query(func.count(MonetaryDonation.donation_id))\
        .filter(
            MonetaryDonation.drive_id == drive_id,
            MonetaryDonation.is_acknowledged == False,
            MonetaryDonation.created_at >= seven_days_ago
        ).scalar() or 0

    return GenericDriveOut(
        total_amount=total_amount,
        total_in_kind=total_in_kind,
        number_of_unverified=number_of_unverified
    )

def update_generic_drive_stats_custom_range(db: Session, drive_id: UUID, start_date_str: str, end_date_str: str):
    try:
        # Parse the date strings into datetime objects
        start_date = datetime.strptime(start_date_str, "%m/%d/%Y")
        
        # Parse end date and set it to the end of that day (23:59:59)
        end_date = datetime.strptime(end_date_str, "%m/%d/%Y")
        end_date = datetime(end_date.year, end_date.month, end_date.day, 23, 59, 59)
        
        # Get the total amount of monetary donations for the date range
        total_amount = db.query(func.sum(MonetaryDonation.amount))\
            .filter(
                MonetaryDonation.drive_id == drive_id,
                MonetaryDonation.is_acknowledged == True,
                MonetaryDonation.created_at >= start_date,
                MonetaryDonation.created_at <= end_date
            ).scalar() or 0

        # Get the total in-kind donations for the date range
        total_in_kind = db.query(func.count(InKindDonation.donation_id))\
            .filter(
                InKindDonation.drive_id == drive_id,
                InKindDonation.created_at >= start_date,
                InKindDonation.created_at <= end_date
            ).scalar() or 0

        # Get the number of unverified donations for the date range
        number_of_unverified = db.query(func.count(MonetaryDonation.donation_id))\
            .filter(
                MonetaryDonation.drive_id == drive_id,
                MonetaryDonation.is_acknowledged == False,
                MonetaryDonation.created_at >= start_date,
                MonetaryDonation.created_at <= end_date
            ).scalar() or 0

        return GenericDriveOut(
            total_amount=total_amount,
            total_in_kind=total_in_kind,
            number_of_unverified=number_of_unverified
        )
        
    except ValueError as e:
        # Handle date parsing errors
        raise ValueError(f"Invalid date format. Dates must be in MM/DD/YYYY format. Error: {str(e)}")

def get_all_pending_monetary_donations(db: Session, drive_id: UUID) -> tuple[list[ShortenedMonetaryDonationsOut], dict]:
    pending_monetary_donations = db.query(
        MonetaryDonation.donation_id,
        User.first_name,
        User.last_name,
        MonetaryDonation.amount,
        MonetaryDonation.date_donated,
        MonetaryDonation.proof,
        MonetaryDonation.is_anonymous
    ).join(
        User, MonetaryDonation.user_id == User.user_id
    ).filter(
        MonetaryDonation.drive_id == drive_id,
        MonetaryDonation.is_acknowledged.is_(None)
    ).all()

    amount_total = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive_id, MonetaryDonation.is_acknowledged.is_(None)).scalar() or 0
    
    pending_donations_list = []

    for donation in pending_monetary_donations:
        # Separate date and time
        donation_date = donation[4].strftime("%m/%d/%Y") if donation[4] else None
        donation_time = donation[4].strftime("%I:%M %p") if donation[4] else None

        pending_out = ShortenedMonetaryDonationsOut(
            donation_id=donation[0],
            donation_date=donation_date,
            donation_time=donation_time,
            name=f"{donation[1]} {donation[2]}" if donation.is_anonymous == False else "Anonymous Donor",
            donation_details=donation[3] or 0,
            proof=f"{donation[5]}" if donation[5] else "No proof provided.",
            type="Monetary"
        )
        pending_donations_list.append(pending_out)

    # Count after creating the list
    count = len(pending_donations_list)
    
    # Return a tuple with the list and a dict containing totals
    return pending_donations_list, {"total_amount": amount_total, "total_count": count}

def get_all_pending_inkind_donations(db: Session, drive_id: UUID) -> tuple[list[ShortenedInKindDonationsOut], dict]:
    pending_inkind_donations = db.query(
        InKindDonation.donation_id,
        User.first_name,
        User.last_name,
        InKindDonation.description,
        InKindDonation.date_donated
    ).join(
        User, InKindDonation.user_id == User.user_id
    ).filter(
        InKindDonation.drive_id == drive_id,
        InKindDonation.is_acknowledged.is_(None)
    ).all()

    pending_donations_list = []

    for donation in pending_inkind_donations:
        donation_date = donation[4].strftime("%m/%d/%Y") if donation[4] else None
        donation_time = donation[4].strftime("%I:%M %p") if donation[4] else None
        pending_out = ShortenedInKindDonationsOut(
            donation_id=donation[0],
            donation_date=donation_date,
            donation_time=donation_time,
            name=f"{donation[1]} {donation[2]}",
            donation_details=donation[3],
            type="In-kind"
        )
        pending_donations_list.append(pending_out)

    count = len(pending_donations_list)

    return pending_donations_list, {"total_count": count}

def get_all_verified_donations_all_drive(
    db: Session,
    time_filter: str = None,
    page: int = 1,
    items_per_page: int = 10,
    is_acknowledged: bool = None
) -> Tuple[List[Dict], int]:
    # Define the time filter based on time_filter
    time_filter_date = None
    if time_filter:
        if time_filter == TimeRange.WEEK:
            time_filter_date = datetime.utcnow() - timedelta(days=7)
        elif time_filter == TimeRange.MONTH:
            time_filter_date = datetime.utcnow() - timedelta(days=30)
        elif time_filter == TimeRange.YEAR:
            # Assuming 'monthly' means the current calendar month
            today = datetime.utcnow()
            time_filter_date = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Build the monetary query
    monetary_query = (
        db.query(
            func.to_char(MonetaryDonation.created_at, 'MM/DD/YY').label('Date Donated'),
            DonationDrive.title.label('Donation Drive'),
            case(
                (MonetaryDonation.is_anonymous == True, 'Anonymous Donor'),
                else_=(User.first_name + ' ' + User.last_name)
            ).label('Name'),
            func.cast('Monetary', String).label('Donation Type'),
            ('₱' + func.to_char(MonetaryDonation.amount, 'FM999,999,990.00')).label('Donation Details'),
            MonetaryDonation.is_acknowledged.label('Is Acknowledged')
        )
        .join(DonationDrive, MonetaryDonation.drive_id == DonationDrive.drive_id)
        .join(User, MonetaryDonation.user_id == User.user_id)
        .filter(
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False,
            MonetaryDonation.created_at >= time_filter_date if time_filter_date else True,
            MonetaryDonation.is_acknowledged == is_acknowledged if is_acknowledged is not None else True
        )
    )

    # Build the in-kind query
    in_kind_query = (
        db.query(
            func.to_char(InKindDonation.created_at, 'MM/DD/YY').label('Date Donated'),
            DonationDrive.title.label('Donation Drive'),
            (User.first_name + ' ' + User.last_name).label('Name'),
            func.cast('In-kind', String).label('Donation Type'),
            InKindDonation.description.label('Donation Details'),
            InKindDonation.is_acknowledged.label('Is Acknowledged')
        )
        .join(DonationDrive, InKindDonation.drive_id == DonationDrive.drive_id)
        .join(User, InKindDonation.user_id == User.user_id)
        .filter(
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False,
            InKindDonation.created_at >= time_filter_date if time_filter_date else True,
            InKindDonation.is_acknowledged == is_acknowledged if is_acknowledged is not None else True
        )
    )

    # Combine the queries using union_all for counting
    union_query_count = union_all(monetary_query, in_kind_query)
    count_query = db.query(func.count()).select_from(union_query_count.subquery())
    total_records = count_query.scalar()

    # Calculate offset for pagination
    offset = (page - 1) * items_per_page

    # Apply pagination and ordering to the union query
    paginated_query = (
        union_query_count
        .order_by(text('"Date Donated" DESC'))
        .limit(items_per_page)
        .offset(offset)
    )

    # Execute the paginated query
    result = db.execute(paginated_query)
    
    rows = result.fetchall()
    data = [
        {
            "Date Donated": row[0],
            "Donation Drive": row[1],
            "Name": row[2],
            "Donation Type": row[3],
            "Donation Details": row[4],
            "Is Acknowledged": row[5]
        }
        for row in rows
    ]

    return data, total_records


def get_all_verified_monetary_donations(db: Session, drive_id: UUID) -> list[ShortenedMonetaryDonationsOut]:
    verified_monetary_donations = db.query(
        MonetaryDonation.donation_id,
        MonetaryDonation.date_donated,
        User.first_name,
        User.last_name,
        MonetaryDonation.amount,
        MonetaryDonation.proof,
        MonetaryDonation.is_anonymous
    ).join(
        User, MonetaryDonation.user_id == User.user_id
    ).filter(
        MonetaryDonation.drive_id == drive_id,
        MonetaryDonation.is_acknowledged == True
    ).all()

    verified_donations_list = []

    for donation in verified_monetary_donations:
        donation_date = donation[1].strftime("%m/%d/%Y") if donation[1] else None
        donation_time = donation[1].strftime("%I:%M %p") if donation[1] else None
        verified_out = ShortenedMonetaryDonationsOut(
            donation_id=donation[0],
            donation_date=donation_date,
            donation_time=donation_time,
            name=f"{donation[2]} {donation[3]}" if donation.is_anonymous == False else "Anonymous Donor",
            donation_details=donation[4] or 0,
            proof=f"{donation[5]}" if donation[5] else "No proof provided.",
            type="Monetary"
        )
        verified_donations_list.append(verified_out)

    return verified_donations_list

def get_all_verified_inkind_donations(db: Session, drive_id: UUID) -> list[ShortenedInKindDonationsOut]:
    verified_inkind_donations = db.query(
        InKindDonation.donation_id,
        InKindDonation.date_donated,
        User.first_name,
        User.last_name,
        InKindDonation.description
    ).join(
        User, InKindDonation.user_id == User.user_id
    ).filter(
        InKindDonation.drive_id == drive_id,
        InKindDonation.is_acknowledged == True
    ).all()

    verified_donations_list = []

    for donation in verified_inkind_donations:
        donation_date = donation[1].strftime("%m/%d/%Y") if donation[1] else None
        donation_time = donation[1].strftime("%I:%M %p") if donation[1] else None
        verified_out = ShortenedInKindDonationsOut(
            donation_id=donation[0],
            donation_date=donation_date,
            donation_time=donation_time,
            name=f"{donation[2]} {donation[3]}",
            donation_details=donation[4],
            type="In-kind"
        )
        verified_donations_list.append(verified_out)

    return verified_donations_list

def get_all_links_by_drive_id(db: Session, drive_id: UUID) -> list[str]:
    links = db.query(DonationDriveLink).filter(DonationDriveLink.drive_id == drive_id).all()
    return [link.link for link in links]

def donation_drive_overview(db: Session, drive_id: UUID) -> AdminOverviewDonationDrive:
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()

    drive_links = get_all_links_by_drive_id(db, drive_id)

    if not drive:
        return []
    
    date_started = drive.created_at.strftime("%m/%d/%Y") if drive.created_at else None

    return AdminOverviewDonationDrive(
        drive_id = drive.drive_id,
        title = drive.title,
        image = f"{drive.image}" if drive.image else None,
        created_at = date_started,
        description = drive.description,
        links = drive_links
    )

def verify_monetary_donation(db: Session, donation_id: UUID, choice: str) -> MonetaryDonationOut:
    donation = db.query(MonetaryDonation).filter(MonetaryDonation.donation_id == donation_id, MonetaryDonation.is_acknowledged.is_(None)).first()

    if not donation:
        return None

    if choice == "approve":
        donation.is_acknowledged = True
    elif choice == "disapprove":
        donation.is_acknowledged = False
    else:
        return False
        
    db.commit()

    return MonetaryDonationOut(
        donation_id = donation.donation_id,
        date_donated = donation.date_donated,
        amount = donation.amount,
        drive_id = donation.drive_id,
        user_id = donation.user_id,
        is_acknowledged = donation.is_acknowledged
    )

def verify_inkind_donation(db: Session, donation_id: UUID, choice: str) -> InKindDonationOut:
    donation = db.query(InKindDonation).filter(InKindDonation.donation_id == donation_id, InKindDonation.is_acknowledged.is_(None)).first()
    
    if not donation:
        return None

    if choice == "approve":
        donation.is_acknowledged = True
    elif choice == "disapprove":
        donation.is_acknowledged = False
    else:
        return False

    db.commit()

    return InKindDonationOut(
        donation_id = donation.donation_id,
        date_donated = donation.date_donated,
        description = donation.description,
        drive_id = donation.drive_id,
        user_id = donation.user_id,
        is_acknowledged = donation.is_acknowledged
    )

def close_donation_drive(db: Session, drive_id: UUID) -> dict:
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id, DonationDrive.is_closed == False).first()

    if not drive:
        return False

    # Update the is_closed field to True
    drive.is_closed = True
    db.commit()

    return {
        "drive_id": drive.drive_id,
        "title": drive.title,
        "is_closed": drive.is_closed,
        "created_at": drive.created_at.strftime("%m/%d/%Y") if drive.created_at else None, 
    }

def open_donation_drive(db: Session, drive_id: UUID) -> dict:
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id, DonationDrive.is_closed == True).first()

    if not drive:
        return False
    
    drive.is_closed = False
    db.commit()

    return {
        "drive_id": drive.drive_id,
        "title": drive.title,
        "is_closed": drive.is_closed,
        "created_at": drive.created_at.strftime("%m/%d/%Y") if drive.created_at else None,
    }


# Get the donor counts per batch per donation drive
def get_donor_counts_by_batch_for_drive(db: Session, drive_id: UUID):
    monetary_q = db.query(
        MonetaryDonation.drive_id.label("drive_id"),
        MonetaryDonation.user_id.label("user_id")
    ).filter(MonetaryDonation.drive_id == drive_id)

    in_kind_q = db.query(
        InKindDonation.drive_id.label("drive_id"),
        InKindDonation.user_id.label("user_id")
    ).filter(InKindDonation.drive_id == drive_id)

    combined_subq = union_all(monetary_q, in_kind_q).subquery()

    batch_counts = db.query(
        func.substr(User.student_number, 1, 4).label("batch"),
        func.count(distinct(combined_subq.c.user_id)).label("total_donors")
    ).join(
        User, combined_subq.c.user_id == User.user_id
    ).group_by(
        func.substr(User.student_number, 1, 4)
    ).order_by(
        func.count(distinct(combined_subq.c.user_id)).desc()
    ).all()

    total_donors = db.query(
        func.count(distinct(combined_subq.c.user_id))
    ).scalar()

    # Calculate percentage for each batch
    batches_with_percentage = [
        {
            "batch": row.batch,
            "total_donors": row.total_donors,
            "percentage": (row.total_donors / total_donors) * 100 if total_donors > 0 else 0
        }
        for row in batch_counts
    ]

    # Slice into top 3 and the rest
    top_3 = batches_with_percentage[:3]
    others = batches_with_percentage[3:]
    
    # Calculate aggregated values for "others" category
    others_total_donors = sum(batch["total_donors"] for batch in others)
    others_percentage = sum(batch["percentage"] for batch in others)
    
    # Create combined "others" entry
    combined_others = {
        "batch": "others",
        "total_donors": others_total_donors,
        "percentage": others_percentage
    }
    
    # Add combined "others" to top_3
    top_3_with_others = top_3 + [combined_others]

    return {
        "top_3": top_3_with_others,
        "others": others
    }
    
# Get the total number of donors for a specific donation drive
def get_total_donors_for_drive(db: Session, drive_id: UUID):
    monetary_q = db.query(
        MonetaryDonation.drive_id.label("drive_id"),
        MonetaryDonation.user_id.label("user_id")
    ).filter(MonetaryDonation.drive_id == drive_id)

    in_kind_q = db.query(
        InKindDonation.drive_id.label("drive_id"),
        InKindDonation.user_id.label("user_id")
    ).filter(InKindDonation.drive_id == drive_id)

    combined_subq = union_all(monetary_q, in_kind_q).subquery()

    total_donors = db.query(
        func.count(distinct(combined_subq.c.user_id)).label("total_donors")
    ).scalar()

    return total_donors

def get_top_and_other_donor_batches_monetary_amount(db: Session, drive_id: UUID):
    # Query for total amounts per batch, grouped by batch (first 4 digits of student_number)
    batch_counts = db.query(
        func.substr(User.student_number, 1, 4).label("batch"),
        func.sum(MonetaryDonation.amount).label("total_amount")
    ).join(
        User, MonetaryDonation.user_id == User.user_id
    ).filter(
        MonetaryDonation.drive_id == drive_id
    ).group_by(
        func.substr(User.student_number, 1, 4)
    ).order_by(
        func.sum(MonetaryDonation.amount).desc()
    ).all()

    # Total amount across all batches
    total_amount = db.query(
        func.sum(MonetaryDonation.amount)
    ).filter(
        MonetaryDonation.drive_id == drive_id
    ).scalar()

    # Calculate percentage of total amount for each batch
    batches_with_percentage = [
        {
            "batch": row.batch,
            "total_amount": row.total_amount or 0,  # Ensure no null value for amount
            "percentage_amount": (row.total_amount / total_amount) * 100 if total_amount > 0 else 0
        }
        for row in batch_counts
    ]

    # Slice into top 3 and the rest
    top_3 = batches_with_percentage[:3]
    others = batches_with_percentage[3:]
    
    # Calculate sum of "others" for the combined entry
    others_total_amount = sum(batch["total_amount"] for batch in others)
    others_percentage = sum(batch["percentage_amount"] for batch in others)
    
    # Add the combined "others" entry to top_3
    combined_others = {
        "batch": "others",
        "total_amount": others_total_amount,
        "percentage_amount": others_percentage
    }
    
    top_3_with_others = top_3 + [combined_others]

    return {
        "top_3": top_3_with_others,
        "others": others
    }

def get_donation_totals_with_percentages(db: Session, drive_id: UUID):
    # Query for the total number of monetary donations
    total_monetary_donations = db.query(
        func.count(MonetaryDonation.donation_id)
    ).filter(
        MonetaryDonation.drive_id == drive_id
    ).scalar()

    # Query for the total number of in-kind donations
    total_inkind_donations = db.query(
        func.count(InKindDonation.donation_id)
    ).filter(
        InKindDonation.drive_id == drive_id
    ).scalar()

    # Calculate the overall total donations (monetary + in-kind)
    overall_total_donations = total_monetary_donations + total_inkind_donations

    # Calculate the percentage of monetary donations
    percentage_monetary = (total_monetary_donations / overall_total_donations) * 100 if overall_total_donations > 0 else 0

    # Calculate the percentage of in-kind donations
    percentage_inkind = (total_inkind_donations / overall_total_donations) * 100 if overall_total_donations > 0 else 0

    # Format the percentages as strings with % symbol
    formatted_percentage_monetary = f"{percentage_monetary:.1f}%"
    formatted_percentage_inkind = f"{percentage_inkind:.1f}%"

    return [
        {
            "name": "monetary",
            "count": total_monetary_donations,
            "percentage": formatted_percentage_monetary
        },
        {
            "name": "in-kind",
            "count": total_inkind_donations,
            "percentage": formatted_percentage_inkind
        },
        {
            "name": "total",
            "count": overall_total_donations,
            "percentage": "100.0%"
        }
    ]

def get_weekly_donation_amounts(db: Session, drive_id: UUID):
    # Get the range of donation dates
    min_date, max_date = db.query(
        func.min(MonetaryDonation.date_donated),
        func.max(MonetaryDonation.date_donated)
    ).filter(MonetaryDonation.drive_id == drive_id).first()

    if not min_date or not max_date:
        return []

    # Align start date to Monday
    start_week = min_date - timedelta(days=min_date.weekday())
    end_week = max_date - timedelta(days=max_date.weekday())

    # Fetch donation totals grouped by week
    week_start = func.date_trunc('week', MonetaryDonation.date_donated).label("week_start")
    donations = db.query(
        week_start,
        func.sum(MonetaryDonation.amount).label("total_amount")
    ).filter(
        MonetaryDonation.drive_id == drive_id
    ).group_by(week_start).order_by(week_start).all()

    # Map donations by week for lookup
    donation_map = {
        week_start.date(): total_amount for week_start, total_amount in donations
    }

    # Build weekly output from start to end week
    result = []
    current = start_week
    while current <= end_week:
        amount = donation_map.get(current.date(), 0)
        result.append({
            "week": current.strftime("%m/%d"),
            "amount_in_thousands": round(amount / 1000, 2) if amount else 0
        })
        current += timedelta(weeks=1)

    return result

def get_top_drives_with_goals_reached(
    db: Session,
    time_filter: str,
    month: int = None,
    year: int = None,
):
    # Calculate date range based on the time filter
    current_date = datetime.now()
    
    if time_filter == "last_7_days":
        start_date = current_date - timedelta(days=7)
        end_date = current_date
    elif time_filter == "last_30_days":
        start_date = current_date - timedelta(days=30)
        end_date = current_date
    elif time_filter == "monthly":
        if not month or not year:
            raise ValueError("Month and year must be provided when using monthly filter")
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = datetime(year, month + 1, 1) - timedelta(days=1)
        # Set to end of day
        end_date = end_date.replace(hour=23, minute=59, second=59)
    else:
        raise ValueError("Invalid time filter. Must be 'last_7_days', 'last_30_days', or 'monthly'")

    # Get top 3 drives that have >= 100% of their percent funded
    drives = db.query(
        DonationDrive.drive_id,
        DonationDrive.title,
        DonationDrive.target_cost,
        func.sum(MonetaryDonation.amount).label("total_amount"),
        (func.sum(MonetaryDonation.amount) * 100.0 / DonationDrive.target_cost).label("percent_funded")
    ).join(
        MonetaryDonation, DonationDrive.drive_id == MonetaryDonation.drive_id
    ).filter(
        DonationDrive.is_closed == False,
        DonationDrive.created_at >= start_date,
        DonationDrive.created_at <= end_date,
        DonationDrive.target_cost > 0
    ).group_by(
        DonationDrive.drive_id
    ).having(
        (func.sum(MonetaryDonation.amount) * 100.0 / DonationDrive.target_cost) >= 100.0
    ).order_by(
        func.sum(MonetaryDonation.amount).desc()
    ).limit(3).all()

    # Format the results
    top_drives = []

    for drive in drives:
        drive_out = {
            "drive_id": drive.drive_id,
            "title": drive.title,
            "target_cost": drive.target_cost,
            "total_amount": drive.total_amount,
            "percent_funded": round(drive.percent_funded, 2) if drive.percent_funded else 0
        }
        top_drives.append(drive_out)

    return top_drives

def get_top_performing_drives(
    db: Session,
    time_filter: str,
    month: int = None,
    year: int = None
):
    # Calculate date range based on the time filter
    current_date = datetime.now()
    
    if time_filter == "last_7_days":
        end_date = current_date
        start_date = current_date - timedelta(days=7)
    elif time_filter == "last_30_days":
        end_date = current_date
        start_date = current_date - timedelta(days=30)
    elif time_filter == "monthly":
        if not month or not year:
            raise ValueError("Month and year must be provided when using monthly filter")
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = datetime(year, month + 1, 1) - timedelta(days=1)
        end_date = end_date.replace(hour=23, minute=59, second=59)
    else:
        raise ValueError("Invalid time filter. Must be 'last_7_days', 'last_30_days', or 'monthly'")

    # Calculate funding at the start of the period
    subquery_start = db.query(
        DonationDrive.drive_id,
        (func.sum(MonetaryDonation.amount) * 100.0 / DonationDrive.target_cost).label("percent_funded_start")
    ).join(
        MonetaryDonation, DonationDrive.drive_id == MonetaryDonation.drive_id
    ).filter(
        MonetaryDonation.created_at < start_date,
        DonationDrive.target_cost > 0,  # Prevent division by zero
        MonetaryDonation.is_acknowledged == True
    ).group_by(
        DonationDrive.drive_id
    ).subquery()
    
    # Calculate funding at the end of the period
    subquery_end = db.query(
        DonationDrive.drive_id,
        (func.sum(MonetaryDonation.amount) * 100.0 / DonationDrive.target_cost).label("percent_funded_end")
    ).join(
        MonetaryDonation, DonationDrive.drive_id == MonetaryDonation.drive_id
    ).filter(
        MonetaryDonation.created_at <= end_date,
        DonationDrive.target_cost > 0,
        MonetaryDonation.is_acknowledged == True
    ).group_by(
        DonationDrive.drive_id
    ).subquery()
    
    # Get drives with highest percentage increase
    query = db.query(
        DonationDrive.drive_id,
        DonationDrive.title,
        DonationDrive.target_cost,
        subquery_start.c.percent_funded_start,
        subquery_end.c.percent_funded_end,
        (subquery_end.c.percent_funded_end - func.coalesce(subquery_start.c.percent_funded_start, 0)).label("percent_increase")
    ).join(
        subquery_end, DonationDrive.drive_id == subquery_end.c.drive_id
    ).outerjoin(
        subquery_start, DonationDrive.drive_id == subquery_start.c.drive_id
    ).filter(
        DonationDrive.is_closed == False,
        DonationDrive.created_at <= end_date,
        DonationDrive.target_cost > 0
    ).order_by(
        desc("percent_increase")  # Order by the increase in percentage
    ).limit(3)

    drives = query.all()

    top_drives = []

    for i, drive in enumerate(drives, 1):
        percent_increase = round(drive.percent_increase) if drive.percent_increase else 0
        
        drive_out = {
            "rank": i,
            "drive_id": drive.drive_id,
            "title": drive.title,
            "percent_increase": percent_increase
        }
        top_drives.append(drive_out)

    return top_drives