from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from models.usermodel import User
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation, DonationDriveLink
from schemas.donation_schema import AdminDonationDriveOut, AdminOneDonationDriveOut, PercentOut, AdminOverviewDonationDrive, MonetaryDonationOut, InKindDonationOut, GenericDriveOut, ShortenedMonetaryDonationsOut, ShortenedInKindDonationsOut, AdminGenericDriveView
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

    return drive_out_list

def get_all_open_drives(db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.is_closed == False)
    
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

    return drive_out_list

def get_all_closed_drives(db: Session) -> list[AdminDonationDriveOut]:
    query = db.query(DonationDrive).filter(DonationDrive.is_closed == True)
    
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

    pending_monetary_donations = get_all_pending_monetary_donations(db, drive_id)
    pending_inkind_donations = get_all_pending_inkind_donations(db, drive_id)
    
    verified_monetary_donations = get_all_verified_monetary_donations(db, drive_id)
    verified_inkind_donations = get_all_verified_inkind_donations(db, drive_id)

    drive_links = get_all_links_by_drive_id(db, drive_id)

    # Format the pending donations list
    pending_verifications = []
    
    # Add pending monetary donations to the list
    for donation in pending_monetary_donations:
        pending_verifications.append({
            "donation_id": donation.donation_id,
            "date_donated": donation.donation_date,
            "name": donation.name,
            "donation_type": "Monetary",
            "donation_details": f"₱{donation.donation_details:,.2f}",
            "proof": donation.proof
        })
    
    # Add pending in-kind donations to the list
    for donation in pending_inkind_donations:
        pending_verifications.append(donation)

    # Format the verified donations list
    verified_donations = []
    
    # Add verified monetary donations to the list
    for donation in verified_monetary_donations:
        verified_donations.append({
            "donation_id": donation.donation_id,
            "date_donated": donation.donation_date,
            "name": donation.name,
            "donation_type": "Monetary",
            "donation_details": f"₱{donation.donation_details:,.2f}",
            "proof": donation.proof
        })
    
    # Add verified in-kind donations to the list
    for donation in verified_inkind_donations:
        verified_donations.append({
            "donation_id": donation.donation_id,
            "date_donated": donation.donation_date,
            "name": donation.name,
            "donation_type": "In-kind",
            "donation_details": donation.donation_details
        })

    date_started = drive.created_at.strftime("%m/%d/%Y") if drive.created_at else None

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
        links = drive_links,
        created_at = date_started,
        description = drive.description
    )

# this is the same as view_donation_drive, except it is hardcoded to the drive_id of the generic drive and we will return total amount
# of verified monetary, and unverified monetary donations instead of the percent progress 
def view_generic_drive(db: Session, drive_id: UUID) -> AdminDonationDriveOut:
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()

    if not drive:
        return []
    
    pending_monetary_donations = get_all_pending_monetary_donations(db, drive_id)
    pending_inkind_donations = get_all_pending_inkind_donations(db, drive_id)
    
    verified_monetary_donations = get_all_verified_monetary_donations(db, drive_id)
    verified_inkind_donations = get_all_verified_inkind_donations(db, drive_id)
    
    # Calculate total amount raised from acknowledged monetary donations only
    total_amount = db.query(func.sum(MonetaryDonation.amount)).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        or_(
            MonetaryDonation.is_acknowledged == True,
            MonetaryDonation.is_acknowledged.is_(None)
        )
    ).scalar() or 0

    pending_verifications = []
    
    # Add pending monetary donations to the list
    for donation in pending_monetary_donations:
        date_donated = donation.date_donated.strftime("%-m/%d/%y %I:%M %p") if donation.date_donated else None
        pending_verifications.append({
            "donation_id": donation.donation_id,
            "name": donation.name,
            "donation_details": f"₱{donation.donation_details:,.2f}",
            "date_donated": date_donated,
        })
    
    # Add pending in-kind donations to the list
    for donation in pending_inkind_donations:
        date_donated = donation.date_donated.strftime("%-m/%d/%y %I:%M %p") if donation.date_donated else None
        pending_verifications.append({
            "donation_id": donation.donation_id,
            "name": donation.name,
            "donation_details": donation.donation_details,
            "date_donated": date_donated,
        })

    # Format the verified donations list
    verified_donations = []
    
    # Add verified monetary donations to the list
    for donation in verified_monetary_donations:
        date_donated = donation.date_donated.strftime("%m/%d/%Y") if donation.date_donated else None
        verified_donations.append({
            "donation_id": donation.donation_id,
            "date_donated": date_donated,
            "name": donation.name,
            "donation_type": "Monetary",
            "donation_details": f"₱{donation.donation_details:,.2f}"
        })
    
    # Add verified in-kind donations to the list
    for donation in verified_inkind_donations:
        date_donated = donation.date_donated.strftime("%m/%d/%Y") if donation.date_donated else None
        verified_donations.append({
            "donation_id": donation.donation_id,
            "date_donated": date_donated,
            "name": donation.name,
            "donation_type": "In-kind",
            "donation_details": donation.donation_details
        })

    
    # Get the total amount of monetary donations for the generic drive
    total_verified_monetary = db.query(func.sum(MonetaryDonation.amount)).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged == True
    ).scalar() or 0

    return AdminGenericDriveView(
        drive_id = drive.drive_id,
        title = drive.title,
        grand_total = total_amount,
        pending_list = pending_verifications,
        verified_list = verified_donations,
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
    # Get the generic drive by hardcoded ID
    generic_drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()

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

def get_all_pending_monetary_donations(db: Session, drive_id: UUID) -> list[ShortenedMonetaryDonationsOut]:
    pending_monetary_donations = db.query(
        MonetaryDonation.donation_id,
        User.first_name,
        User.last_name,
        MonetaryDonation.amount,
        MonetaryDonation.date_donated,
        MonetaryDonation.proof
    ).join(
        User, MonetaryDonation.user_id == User.user_id
    ).filter(
        MonetaryDonation.drive_id == drive_id,
        MonetaryDonation.is_acknowledged.is_(None)
    ).all()

    pending_donations_list = []

    for donation in pending_monetary_donations:
        # Separate date and time
        donation_date = donation[4].strftime("%m/%d/%Y") if donation[4] else None
        donation_time = donation[4].strftime("%I:%M %p") if donation[4] else None
        pending_out = ShortenedMonetaryDonationsOut(
            donation_id=donation[0],
            donation_date=donation_date,
            donation_time=donation_time,
            name=f"{donation[1]} {donation[2]}",
            donation_details=donation[3] or 0,
            proof=f"{STORAGE_STRING}{donation[5]}" if donation[5] else "No proof provided.",
            type="Monetary"
        )
        pending_donations_list.append(pending_out)

    return pending_donations_list

def get_all_pending_inkind_donations(db: Session, drive_id: UUID) -> list[ShortenedInKindDonationsOut]:
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

    return pending_donations_list

def get_all_verified_monetary_donations(db: Session, drive_id: UUID) -> list[ShortenedMonetaryDonationsOut]:
    verified_monetary_donations = db.query(
        MonetaryDonation.donation_id,
        MonetaryDonation.date_donated,
        User.first_name,
        User.last_name,
        MonetaryDonation.amount,
        MonetaryDonation.proof
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
            name=f"{donation[2]} {donation[3]}",
            donation_details=donation[4] or 0,
            proof=f"{STORAGE_STRING}{donation[5]}" if donation[5] else "No proof provided.",
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
        image = f"{STORAGE_STRING}{drive.image}" if drive.image else None,
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