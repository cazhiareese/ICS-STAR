from fastapi import Depends, HTTPException, UploadFile, File
from config.config import supabase_client, STORAGE_STRING
from config.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation, DonationDriveLink
from models.usermodel import User
from schemas.donation_schema import DonationDriveOut, OneDonationDriveOut
from datetime import datetime, timezone
from typing import Optional
import uuid

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png", "pdf", "heic", "docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024

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
        target_cost=float(drive.target_cost or 0) if drive.target_cost else None,
        image_url=drive.image,
        total_amount_donated=float(total_amount_donated or 0),
        donation_count=donation_count,
        created_at=drive.created_at
    )
    
def get_one_donation_drive(db: Session, drive: DonationDrive) -> OneDonationDriveOut:
    monetary_data = db.query(
        func.coalesce(func.sum(MonetaryDonation.amount), 0).label('total_amount_donated'),
        func.count(MonetaryDonation.donation_id).label('monetary_count')
    ).filter(MonetaryDonation.drive_id == drive.drive_id).one()

    total_amount_donated = monetary_data.total_amount_donated
    fund_percentage = (monetary_data.total_amount_donated / drive.target_cost * 100) if drive.target_cost else None
    
    monetary_count = monetary_data.monetary_count
    in_kind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar()

    donation_count = monetary_count + in_kind_count
    
    links = db.query(DonationDriveLink.link).filter(DonationDriveLink.drive_id == drive.drive_id).all()
    link_list = [link[0] for link in links] if links else None

    return OneDonationDriveOut(
        title=drive.title,
        description=drive.description,
        target_cost=float(drive.target_cost or 0) if drive.target_cost else None,
        image_url=drive.image,
        total_amount_donated=float(total_amount_donated or 0),
        in_kind_count=in_kind_count,
        donation_count=donation_count,
        fund_percentage = round(fund_percentage, 2) if fund_percentage else None,
        link=link_list,
        created_at=drive.created_at
    )
    
def general_donation_drive(db: Session, drive: DonationDrive) -> OneDonationDriveOut:
    monetary_data = db.query(
        func.coalesce(func.sum(MonetaryDonation.amount), 0).label('total_amount_donated'),
        func.count(MonetaryDonation.donation_id).label('monetary_count')
    ).filter(MonetaryDonation.drive_id == drive.drive_id).one()

    total_amount_donated = monetary_data.total_amount_donated    
    monetary_count = monetary_data.monetary_count
    in_kind_count = db.query(func.count(InKindDonation.donation_id)).filter(InKindDonation.drive_id == drive.drive_id).scalar()

    donation_count = monetary_count + in_kind_count
    
    links = db.query(DonationDriveLink.link).filter(DonationDriveLink.drive_id == drive.drive_id).all()
    link_list = [link[0] for link in links] if links else None

    return OneDonationDriveOut(
        title=drive.title,
        description=drive.description,
        target_cost=float(drive.target_cost or 0) if drive.target_cost else None,
        image_url=drive.image,
        total_amount_donated=float(total_amount_donated or 0),
        in_kind_count=in_kind_count,
        donation_count=donation_count,
        link=link_list,
        created_at=drive.created_at
    )


async def upload_proof(
    db: Session,
    proof: Optional[UploadFile] = File(None),
):
    if proof:
        file_content = await proof.read()
        if len(file_content) > MAX_FILE_SIZE or proof.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid proof of payment")

        proof_ext = proof.filename.split(".")[-1]
        proof_name = f"proof_of_payment/{uuid.uuid4()}.{proof_ext}"
        try:
            supabase_client.storage.from_("128storage").upload(proof_name, file_content)
        except Exception as e:
            print("Upload Error:", e)
        proof_url = f"{STORAGE_STRING}{proof_name}"
    else:
        raise HTTPException(status_code=400, detail="Proof of payment required")

    return proof_url

async def make_donation(
    db: Session,
    user: User,
    drive: DonationDrive,
    monetary_donation: bool = False,
    in_kind_donation: bool = False,
    amount: Optional[float] = None,
    description: Optional[str] = None,
    proof: Optional[UploadFile] = File(None),
    is_anonymous = Optional[bool],
    is_general = Optional[bool],
):
    if not monetary_donation and not in_kind_donation:
        raise HTTPException(
            status_code=400,
            detail="Please specify either monetary or in-kind donation"
        )
    
    if monetary_donation and in_kind_donation:
        raise HTTPException(
            status_code=400,
            detail="Cannot process both donation types simultaneously"
        )
    
    if monetary_donation:
        if amount is None or amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid amount"
            )
        
        proof_of_payment = await upload_proof(db, proof)
        
        monetary = MonetaryDonation(
            date_donated = datetime.now(timezone.utc),
            amount = amount,
            drive_id = drive.drive_id,
            user_id = user.user_id,
            is_anonymous = is_anonymous if is_anonymous else False,
            proof = proof_of_payment,
        )
        try:
            db.add(monetary)
            db.commit()
            db.refresh(monetary)
        except Exception as e:
            raise HTTPException(status_code=500, details=e)
        
        return {
            "donation_drive": drive.title,
            "date": monetary.date_donated,
            "user": f"{user.first_name} {user.last_name}",
            "status": "Pending Acknowledgement",
            "amount": monetary.amount
        }
    
    if in_kind_donation:
        if not description:
            raise HTTPException(status_code=400, detail="Description is required for in-kind donations")
        
        in_kind = InKindDonation(
            date_donated = datetime.now(timezone.utc),
            description = description,
            drive_id = drive.drive_id,
            user_id = user.user_id
        )
        try:
            db.add(in_kind)
            db.commit()
            db.refresh(in_kind)
        except Exception as e:
            raise HTTPException(status_code=500, details=e)

        return {
            "donation_drive": drive.title,
            "date": in_kind.date_donated,
            "user": f"{user.first_name} {user.last_name}",
            "status": "Pending Acknowledgement",
            "details": in_kind.description
        }