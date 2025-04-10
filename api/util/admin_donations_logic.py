from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.usermodel import User
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation
from schemas.donation_schema import AdminDonationDriveOut, AdminOneDonationDriveOut, PercentOut
import datetime
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
    date_filter: str = None,
    custom_start_date: datetime.date = None,
    custom_end_date: datetime.date = None
) -> list[AdminDonationDriveOut]:
    
    query = db.query(DonationDrive)
    
    # Apply search filter if provided
    if search_string:
        query = query.filter(DonationDrive.title.ilike(f"%{search_string}%"))
    
    # Apply date filters
    today = datetime.date.today()
    
    if date_filter == "last_7_days":
        seven_days_ago = today - datetime.timedelta(days=7)
        query = query.filter(DonationDrive.created_at >= seven_days_ago)
    
    elif date_filter == "this_week":
        # Start of week is Sunday
        start_of_week = today - datetime.timedelta(days=today.weekday() + 1)
        query = query.filter(DonationDrive.created_at >= start_of_week)
    
    elif date_filter == "this_month":
        start_of_month = today.replace(day=1)
        query = query.filter(DonationDrive.created_at >= start_of_month)
    
    elif date_filter == "this_year":
        start_of_year = today.replace(month=1, day=1)
        query = query.filter(DonationDrive.created_at >= start_of_year)
    
    elif date_filter == "custom" and custom_start_date and custom_end_date:
        query = query.filter(DonationDrive.created_at >= custom_start_date, DonationDrive.created_at <= custom_end_date)
    
    drives = query.all()
    
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
        remaining_percentage = percent_info.remaining_percent

        drive_out = AdminDonationDriveOut(
            drive_id = drive.drive_id,
            title = drive.title,
            created_at = drive.created_at,
            donation_count = total_count,
            percent_funded = total_percentage,
            amount_raised = total_amount,
            remaining_percent = remaining_percentage,
        )
        drive_out_list.append(drive_out)

    return drive_out_list

# Viewing a specific donation drive
#
# Arguments:
# db: Session - database session
# drive_id: UUID - ID of the donation drive to view
# 
# Returns: AdminOneDonationDriveOut object containing details of the donation drive
def view_donation_drive(db: Session, drive_id: UUID) -> AdminDonationDriveOut:
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()
    
    total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id,MonetaryDonation.is_acknowledged == True).scalar() or 0
    
    percent_info = get_percent_funded(db, drive.drive_id)
    total_percentage = percent_info.percent_funded
    remaining_percentage = percent_info.remaining_percent

    # Get pending monetary donations with user information
    pending_monetary_details = db.query(
        MonetaryDonation.donation_id,
        User.first_name,
        User.last_name,
        MonetaryDonation.amount,
        MonetaryDonation.date_donated
    ).join(
        User, MonetaryDonation.user_id == User.user_id
    ).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged == False
    ).all()
    
    # Get pending in-kind donations with user information
    pending_inkind_details = db.query(
        InKindDonation.donation_id,
        User.first_name,
        User.last_name,
        InKindDonation.description,
        InKindDonation.date_donated
    ).join(
        User, InKindDonation.user_id == User.user_id
    ).filter(
        InKindDonation.drive_id == drive.drive_id,
        InKindDonation.is_acknowledged == False
    ).all()

    # Format the pending donations list
    pending_verifications = []
    
    for donation in pending_monetary_details:
        # Format date donated to MM/DD/YYYY
        date_donated = donation[4].strftime("%m/%d/%Y") if donation[4] else None
        pending_verifications.append({
            "donation_id": donation[0],
            "name": f"{donation[1]} {donation[2]}",
            "donation_details": f"₱{donation[3]:,.2f}",
            "date_donated": date_donated,
        })
    
    for donation in pending_inkind_details:
        date_donated = donation[4].strftime("%m/%d/%Y") if donation[4] else None
        pending_verifications.append({
            "donation_id": donation[0],
            "name": f"{donation[1]} {donation[2]}",
            "donation_details": donation[3],
            "date_donated": date_donated,
        })

    # Get verified monetary donations with user information
    verified_monetary_details = db.query(
        MonetaryDonation.donation_id,
        MonetaryDonation.date_donated,
        User.first_name,
        User.last_name,
        MonetaryDonation.amount
    ).join(
        User, MonetaryDonation.user_id == User.user_id
    ).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged == True
    ).all()
    
    # Get verified in-kind donations with user information
    verified_inkind_details = db.query(
        InKindDonation.donation_id,
        InKindDonation.date_donated,
        User.first_name,
        User.last_name,
        InKindDonation.description
    ).join(
        User, InKindDonation.user_id == User.user_id
    ).filter(
        InKindDonation.drive_id == drive.drive_id,
        InKindDonation.is_acknowledged == True
    ).all()

    # Format the verified donations list
    verified_donations = []
    
    for donation in verified_monetary_details:
        date_donated = donation[1].strftime("%m/%d/%Y") if donation[1] else None
        verified_donations.append({
            "donation_id": donation[0],
            "date_donated": date_donated,
            "name": f"{donation[2]} {donation[3]}",
            "donation_type": "Monetary",
            "donation_details": f"₱{donation[4]:,.2f}"
        })
    
    for donation in verified_inkind_details:
        date_donated = donation[1].strftime("%m/%d/%Y") if donation[1] else None
        verified_donations.append({
            "donation_id": donation[0],
            "date_donated": date_donated,
            "name": f"{donation[2]} {donation[3]}",
            "donation_type": "In-kind",
            "donation_details": donation[4]
        })

    return AdminOneDonationDriveOut(
        drive_id = drive.drive_id,
        title = drive.title,
        percent_funded = total_percentage,
        pending_list = pending_verifications,
        verified_list = verified_donations,
        current_amount = total_amount,
        target_cost = drive.target_cost,
        is_closed = drive.is_closed,
        remaining_percent = remaining_percentage,
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

    total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(MonetaryDonation.drive_id == drive.drive_id,MonetaryDonation.is_acknowledged == True).scalar() or 0 

    # Calculate percentage
    total_percentage = (total_amount / drive.target_cost) * 100 if drive.target_cost else 0

    # Calculate remaining percent
    remaining_percentage = 100 - total_percentage if total_percentage <= 100 else 0

    return PercentOut(
        percent_funded=round(total_percentage, 2),
        remaining_percent=round(remaining_percentage, 2)
    )