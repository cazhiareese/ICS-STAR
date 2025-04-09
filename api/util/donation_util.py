from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.donationmodel import MonetaryDonation, InKindDonation, DonationDriveLink, DonationDrive
from schemas.donation_schema import MonetaryDonationOut, InKindDonationOut, DonationDriveOut, OneDonationDriveOut

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
