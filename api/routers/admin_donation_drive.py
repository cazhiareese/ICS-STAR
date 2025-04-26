from fastapi import Depends, HTTPException, APIRouter, Form, UploadFile, File
from typing import Optional, List
from sqlalchemy.orm import Session
from models.donationmodel import DonationDrive, DonationDriveLink
from schemas.donation_schema import DonationDriveOut, OneDonationDriveOut
from config.database import get_db
from util.donation_util import create_donation_drive, get_donors
from uuid import UUID

router = APIRouter()

# Create donation drive
@router.post("/create-donation-drives")
async def create_donation_drive_endpoint(
    title: str = Form(...),
    description: str = Form(...),
    target_cost: float = Form(...),
    support_links: Optional[list[str]] = Form(None),
    image: Optional[UploadFile] = File(None), 
    db: Session = Depends(get_db)
):
    return await create_donation_drive(
        title=title,
        description=description,
        target_cost=target_cost,
        image=image,
        support_links=support_links,
        db=db
    )
    
@router.get("/get-donors/{drive_id}")
def donor_list(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Donation drive not found.")
    
    return get_donors(drive.drive_id, db)