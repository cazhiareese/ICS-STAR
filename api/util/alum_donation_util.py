from config.config import STORAGE_STRING
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation
from schemas.donation_schema import DonationDriveOut

def get_donation_drive_data(db: Session, drive: DonationDrive) -> DonationDriveOut:
    monetary_data = db.query(
        func.coalesce(func.sum(MonetaryDonation.amount), 0).label('total_amount_donated'),
        func.count(MonetaryDonation.donation_id).label('monetary_count')
    ).filter(MonetaryDonation.drive_id == drive.drive_id).one()

    total_amount_donated = monetary_data.total_amount_donated
    monetary_count = monetary_data.monetary_count
    
    in_kind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar()

    donation_count = monetary_count + in_kind_count

    return DonationDriveOut(
        title=drive.title,
        description=drive.description,
        target_cost=float(drive.target_cost or 0),
        image_url=drive.image,
        total_amount_donated=float(total_amount_donated or 0),
        donation_count=donation_count
    )