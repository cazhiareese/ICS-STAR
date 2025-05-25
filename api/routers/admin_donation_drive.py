from fastapi import Depends, HTTPException, APIRouter, Form, UploadFile, File
from fastapi.responses import FileResponse
from typing import Optional, List
from sqlalchemy.orm import Session
from models.donationmodel import DonationDrive, DonationDriveLink
from schemas.donation_schema import DonationDriveOut, OneDonationDriveOut
from config.database import get_db
from util.donation_util import create_donation_drive, get_donors_csv
from uuid import UUID
from util.userutil import require_admin

router = APIRouter()

# Create donation drive
@router.post("/create-donation-drives", dependencies=[Depends(require_admin)],)
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
    
@router.get("/get-donors-csv/{drive_id}", dependencies=[Depends(require_admin)],)
def donor_list(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    drive = db.query(DonationDrive.drive_id, DonationDrive.title).filter(DonationDrive.drive_id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Donation drive not found.")
    
    csv_file_path = get_donors_csv(drive.drive_id, db)
    filename = f"{drive.title}.csv"

    return FileResponse(
        path=csv_file_path,
        filename=filename,
        media_type="text/csv"
    )

# Edit the target goal of a donation drive
@router.put("/edit-donation-drive/goal/{drive_id}", dependencies=[Depends(require_admin)])
async def edit_donation_drive_goal(
    drive_id: UUID,
    target_cost: float = Form(...),
    db: Session = Depends(get_db)
):
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=200, detail="Donation drive not found.")
    
    drive.target_cost = target_cost
    db.commit()
    db.refresh(drive)
    return {"message": "Donation drive goal updated successfully."}

# Edit the description and links of a donation drive
@router.put("/edit-donation-drive/description-links/{drive_id}",dependencies=[Depends(require_admin)],)
async def edit_donation_drive_description_links(
    drive_id: UUID,
    description: str = Form(...),
    support_links: Optional[list[str]] = Form(None),
    db: Session = Depends(get_db)
):
    drive = db.query(DonationDrive).filter(DonationDrive.drive_id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=200, detail="Donation drive not found.")
    
    drive.description = description
    db.commit()
    db.refresh(drive)

    if support_links:
        # Clear existing links
        db.query(DonationDriveLink).filter(DonationDriveLink.drive_id == drive_id).delete()
        db.commit()

        # Add new links
        for link in support_links:
            new_link = DonationDriveLink(drive_id=drive_id, link=link)
            db.add(new_link)
        db.commit()
    return {"message": "Donation drive description and links updated successfully."}