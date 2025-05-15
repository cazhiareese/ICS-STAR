from typing import List, Optional
from config.config import STORAGE_STRING, SUPABASE_BUCKET, supabase_client
from config.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.donationmodel import MonetaryDonation, InKindDonation, DonationDriveLink, DonationDrive
from models.usermodel import User
from schemas.donation_schema import MonetaryDonationOut, InKindDonationOut, DonationDriveOut, OneDonationDriveOut, DonationHistoryOut
from fastapi import HTTPException
from fastapi import UploadFile, File, Depends 
from uuid import UUID
import os
import csv
import tempfile

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024

def get_user_donation_history_details(db: Session, user_id: UUID):
    donation_history = get_user_donations(db, user_id)
    donation_history_out = []

    for donation in donation_history:
        if isinstance(donation, MonetaryDonationOut):
            donation_history_out.append(DonationHistoryOut(
                donation_id=donation.donation_id,
                date_donated=donation.date_donated,
                details=donation.amount,
                drive_id=donation.drive_id,
                user_id=donation.user_id,  
                type="Monetary",
                is_acknowledged=donation.is_acknowledged,
                donation_drive_title=donation.donation_drive_title,
                proof=donation.proof,
                is_anonymous=donation.is_anonymous,
            ))
        elif isinstance(donation, InKindDonationOut):
            donation_history_out.append(DonationHistoryOut(
                donation_id=donation.donation_id,
                date_donated=donation.date_donated,
                details=donation.description,
                drive_id=donation.drive_id,
                user_id=donation.user_id,  
                type="In-Kind",
                is_acknowledged=donation.is_acknowledged,
                donation_drive_title=donation.donation_drive_title,
            ))
        
    return donation_history_out


# Function to get all donations of a user
def get_user_donations(db: Session, user_id: str) -> list[MonetaryDonationOut | InKindDonationOut]:
    monetary_donations = get_user_monetary_donations(db, user_id)
    in_kind_donations = get_user_in_kind_donations(db, user_id)

    donations = monetary_donations + in_kind_donations

    return donations

# Function to get the monetary donations of a user
def get_user_monetary_donations(db: Session, user_id: str, isIncreasing: Optional[bool] = None, isNewest: Optional[bool] = None) -> list[MonetaryDonationOut]:

    query = db.query(
        MonetaryDonation.donation_id,
        MonetaryDonation.date_donated,
        MonetaryDonation.amount,
        MonetaryDonation.drive_id,
        MonetaryDonation.user_id,
        MonetaryDonation.is_acknowledged,
        MonetaryDonation.proof,
        MonetaryDonation.is_anonymous,
        ).filter(MonetaryDonation.user_id == user_id)
    
    if isIncreasing is not None:
        if isIncreasing:
            query = query.order_by(MonetaryDonation.amount.asc())
        else:
            query = query.order_by(MonetaryDonation.amount.desc())
    
    if isNewest is not None:
        if isNewest:
            query = query.order_by(MonetaryDonation.date_donated.desc())
        else:
            query = query.order_by(MonetaryDonation.date_donated.asc())
    
    monetary_donations = query.all()
    
    MonetaryDonationOutList = []

    for donation in monetary_donations:
        drive = db.query(
            DonationDrive.drive_id,
            DonationDrive.title
        ).filter(DonationDrive.drive_id == donation.drive_id).first()

        mon_donation = MonetaryDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            amount=float(donation.amount or 0),
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None,
            proof=donation.proof,
            is_anonymous=donation.is_anonymous,
            type="Monetary"
        )

        MonetaryDonationOutList.append(mon_donation)

    return MonetaryDonationOutList

# Function to get the in-kind donations of a user
def get_user_in_kind_donations(db: Session, user_id: str, isNewest: Optional[bool] = None) -> list[InKindDonationOut]:
    query = db.query(
        InKindDonation.donation_id,
        InKindDonation.date_donated,
        InKindDonation.description,
        InKindDonation.drive_id,
        InKindDonation.user_id,
        InKindDonation.is_acknowledged,
        ).filter(InKindDonation.user_id == user_id)
    
    if isNewest is not None:
        if isNewest:
            query = query.order_by(InKindDonation.date_donated.desc())  # Newest first
        else:
            query = query.order_by(InKindDonation.date_donated.asc())   # Oldest first
    
    in_kind_donations = query.all()
    
    InKindDonationOutList = []

    for donation in in_kind_donations:
        drive = db.query(
            DonationDrive.drive_id,
            DonationDrive.title
            ).filter(DonationDrive.drive_id == donation.drive_id).first()
        in_kind_donation = InKindDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            description=donation.description,
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None,
            type="In-Kind"
        )

        InKindDonationOutList.append(in_kind_donation)

    return InKindDonationOutList

# Function to get the monetary donations of a user with acknowledgment status
def get_user_monetary_donations_acknowledged(db: Session, user_id: str, isIncreasing: Optional[bool] = None, isNewest: Optional[bool] = None) -> list[MonetaryDonationOut]:
    query = db.query(
        MonetaryDonation.donation_id,
        MonetaryDonation.date_donated,
        MonetaryDonation.amount,
        MonetaryDonation.drive_id,
        MonetaryDonation.user_id,
        MonetaryDonation.is_acknowledged,
        MonetaryDonation.proof,
        MonetaryDonation.is_anonymous,
        ).filter(MonetaryDonation.user_id == user_id,
                 MonetaryDonation.is_acknowledged == True)
    
    if isIncreasing is not None:
        if isIncreasing:
            query = query.order_by(MonetaryDonation.amount.asc())
        else:
            query = query.order_by(MonetaryDonation.amount.desc())
    
    if isNewest is not None:
        if isNewest:
            query = query.order_by(MonetaryDonation.date_donated.desc())
        else:
            query = query.order_by(MonetaryDonation.date_donated.asc())
    
    monetary_donations = query.all()
    
    MonetaryDonationOutList = []

    for donation in monetary_donations:
        drive = db.query(
            DonationDrive.drive_id,
            DonationDrive.title
        ).filter(DonationDrive.drive_id == donation.drive_id).first()

        mon_donation = MonetaryDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            amount=float(donation.amount or 0),
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None,
            proof=donation.proof,
            is_anonymous=donation.is_anonymous,
            type="Monetary"
        )

        MonetaryDonationOutList.append(mon_donation)

    return MonetaryDonationOutList

# Function to get the in-kind donations of a user with acknowledgment status
def get_user_in_kind_donations_acknowledged(db: Session, user_id: str, isNewest: Optional[bool] = None) -> list[InKindDonationOut]:
    query = db.query(
        InKindDonation.donation_id,
        InKindDonation.date_donated,
        InKindDonation.description,
        InKindDonation.drive_id,
        InKindDonation.user_id,
        InKindDonation.is_acknowledged,
        ).filter(InKindDonation.user_id == user_id,
                 InKindDonation.is_acknowledged == True)
    
    if isNewest is not None:
        if isNewest:
            query = query.order_by(InKindDonation.date_donated.desc())  # Newest first
        else:
            query = query.order_by(InKindDonation.date_donated.asc())   # Oldest first
    
    in_kind_donations = query.all()
    
    InKindDonationOutList = []

    for donation in in_kind_donations:
        drive = db.query(
            DonationDrive.drive_id,
            DonationDrive.title
            ).filter(DonationDrive.drive_id == donation.drive_id).first()
        in_kind_donation = InKindDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            description=donation.description,
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None,
            type="In-Kind"
        )

        InKindDonationOutList.append(in_kind_donation)

    return InKindDonationOutList

# Function to create a donation drive
async def create_donation_drive(
        title: str,
        description: str,
        target_cost: float,
        image: Optional[UploadFile] = None,
        support_links: Optional[List[str]] = None,
        db: Session = Depends(get_db),
        
):
    if image:
        file = await image.read()
        if len(file) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the limit of 10MB.")
        if image.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="File type not allowed.")
        
        file_extension = image.filename.split(".")[-1].lower()
        file_name = f"donation_drive/{title.replace(' ', '_')}.{file_extension}"

        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(file_name, file)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image. Error: {str(e)}")
        
        image_url = f"{STORAGE_STRING}{file_name}"
    else:
        image_url = None

    donation_drive = DonationDrive(
        title=title,
        description=description,
        target_cost=target_cost,
        image=image_url,
    )

    db.add(donation_drive)
    db.commit()
    db.refresh(donation_drive)

    if support_links:
        for link in support_links:
            donation_drive_link = DonationDriveLink(
                drive_id=donation_drive.drive_id,
                link=link
            )
            db.add(donation_drive_link)
        db.commit()
        db.refresh(donation_drive_link)
        db.refresh(donation_drive)

    return donation_drive

def get_donors_csv(
    drive_id: UUID,
    db: Session
):
    with tempfile.NamedTemporaryFile(delete=False, mode="w", newline='', encoding="utf-8", suffix=".csv") as tmpfile:
        file_path = tmpfile.name

        writer = csv.writer(tmpfile)
        writer.writerow(["Date Donated", "First Name", "Last Name", "Email", "Donation Type", "Donation"])

        # Monetary donors
        monetary_donors = (
            db.query(
                MonetaryDonation.date_donated,
                MonetaryDonation.is_anonymous,
                User.first_name,
                User.last_name,
                User.email,
                func.sum(MonetaryDonation.amount).label("total_amount")
            )
            .join(MonetaryDonation, MonetaryDonation.user_id == User.user_id)
            .filter(MonetaryDonation.drive_id == drive_id)
            .group_by(User.user_id, User.first_name, User.last_name, MonetaryDonation.date_donated, MonetaryDonation.is_anonymous)
            .order_by(MonetaryDonation.date_donated.asc())
            .all()
        )

        for donor in monetary_donors:
            formatted_date = donor.date_donated.strftime('%b %d, %Y')
            writer.writerow([
                f'{formatted_date}',
                donor.first_name if not donor.is_anonymous else 'Anonymous',
                donor.last_name if not donor.is_anonymous else 'N/A',
                donor.email if not donor.is_anonymous else "N/A",
                "monetary",
                str(donor.total_amount)
            ])

        # In-kind donors
        in_kind_donors = (
            db.query(
                InKindDonation.date_donated,
                User.first_name,
                User.last_name,
                User.email,
                func.array_agg(InKindDonation.description).label("donated_items")
            )
            .join(InKindDonation, InKindDonation.user_id == User.user_id)
            .filter(InKindDonation.drive_id == drive_id)
            .group_by(User.user_id, User.first_name, User.last_name, InKindDonation.date_donated)
            .order_by(InKindDonation.date_donated.asc())
            .all()
        )

        for donor in in_kind_donors:
            formatted_date = donor.date_donated.strftime('%b %d, %Y')
            writer.writerow([
                formatted_date,
                donor.first_name,
                donor.last_name,
                donor.email,
                "in-kind",
                ", ".join(donor.donated_items)
            ])

    return file_path