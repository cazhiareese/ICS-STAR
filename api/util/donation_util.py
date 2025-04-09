from config.config import STORAGE_STRING, supabase_client
from config.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.donationmodel import MonetaryDonation, InKindDonation, DonationDriveLink, DonationDrive
from schemas.donation_schema import MonetaryDonationOut, InKindDonationOut, DonationDriveOut, OneDonationDriveOut
from fastapi import HTTPException
from fastapi import UploadFile, File, Depends 

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024

# Function to get all donations of a user
def get_user_donations(db: Session, user_id: str) -> list[MonetaryDonationOut | InKindDonationOut]:
    monetary_donations = get_user_monetary_donations(db, user_id)
    in_kind_donations = get_user_in_kind_donations(db, user_id)

    donations = monetary_donations + in_kind_donations

    return donations

# Function to get the monetary donations of a user
def get_user_monetary_donations(db: Session, user_id: str) -> list[MonetaryDonationOut]:
    monetary_donations = db.query(
        MonetaryDonation
        ).filter(
            MonetaryDonation.user_id == user_id
            ).all()
    
    MonetaryDonationOutList = []

    for donation in monetary_donations:

        drive = db.query(DonationDrive).filter(DonationDrive.drive_id == donation.drive_id).first()
        mon_donation = MonetaryDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            amount=float(donation.amount or 0),
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None
        )

        MonetaryDonationOutList.append(mon_donation)

    return MonetaryDonationOutList

# Function to get the in-kind donations of a user
def get_user_in_kind_donations(db: Session, user_id: str) -> list[InKindDonationOut]:
    in_kind_donations = db.query(
        InKindDonation
        ).filter(
            InKindDonation.user_id == user_id
            ).all()
    
    InKindDonationOutList = []

    for donation in in_kind_donations:
        drive = db.query(DonationDrive).filter(DonationDrive.drive_id == donation.drive_id).first()
        in_kind_donation = InKindDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            amount=float(donation.amount or 0),
            description=donation.description,
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None
        )

        InKindDonationOutList.append(in_kind_donation)

    return InKindDonationOutList

# Function to get the monetary donations of a user with acknowledgment status
def get_user_monetary_donations_acknowledged(db: Session, user_id: str) -> list[MonetaryDonationOut]:
    monetary_donations = db.query(
        MonetaryDonation
        ).filter(
            MonetaryDonation.user_id == user_id,
            MonetaryDonation.is_acknowledged == True
            ).all()
    
    MonetaryDonationOutList = []

    for donation in monetary_donations:
        drive = db.query(DonationDrive).filter(DonationDrive.drive_id == donation.drive_id).first()
        mon_donation = MonetaryDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            amount=float(donation.amount or 0),
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None
        )

        MonetaryDonationOutList.append(mon_donation)

    return MonetaryDonationOutList

# Function to get the in-kind donations of a user with acknowledgment status
def get_user_in_kind_donations_acknowledged(db: Session, user_id: str) -> list[InKindDonationOut]:
    in_kind_donations = db.query(
        InKindDonation
        ).filter(
            InKindDonation.user_id == user_id,
            InKindDonation.is_acknowledged == True
            ).all()
    
    InKindDonationOutList = []

    for donation in in_kind_donations:
        drive = db.query(DonationDrive).filter(DonationDrive.drive_id == donation.drive_id).first()
        in_kind_donation = InKindDonationOut(
            donation_id=donation.donation_id,
            date_donated=donation.date_donated,
            amount=float(donation.amount or 0),
            description=donation.description,
            drive_id=donation.drive_id,
            user_id=donation.user_id,
            is_acknowledged=donation.is_acknowledged,
            donation_drive_title=drive.title if drive else None
        )

        InKindDonationOutList.append(in_kind_donation)

    return InKindDonationOutList

# Function to create a donation drive
async def create_donation_drive(
        title: str,
        description: str,
        target_cost: float,
        image: UploadFile = File(None),
        support_links: list[str] = None,
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
            supabase_client.storage.from_("128storage").upload(file_name, file)
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

    return donation_drive