from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.donation_schema import AdminDonationDriveOut, AdminOneDonationDriveOut, PercentOut
from config.database import get_db
from util.admin_donations_logic import search_donation_drives, view_donation_drive, get_percent_funded
import datetime
from uuid import UUID

router = APIRouter()

@router.get("/admin/donations/search", response_model=List[AdminDonationDriveOut])
def search_drives(
    title: str = "",
    filter_type: str = None,
    custom_start: str = None, 
    custom_end: str = None,
    db: Session = Depends(get_db)
):
    # String date input format is MM/DD/YYYY
    # Convert string dates to datetime objects if custom filter is selected
    custom_start_date = None
    custom_end_date = None
    if filter_type == "custom" and custom_start and custom_end:
        try:
            custom_start_date = datetime.datetime.strptime(custom_start, "%m/%d/%Y").date()
            custom_end_date = datetime.datetime.strptime(custom_end, "%m/%d/%Y").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Please use MM/DD/YYYY.")
    
    results = search_donation_drives(db, title, date_filter=filter_type, custom_start_date=custom_start_date, custom_end_date=custom_end_date)

    return results

@router.get("/admin/donations/{drive_id}", response_model=AdminOneDonationDriveOut)
def view_drive(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = view_donation_drive(db, drive_id)

    return results

@router.get("/admin/donations/{drive_id}/percent-funded", response_model=PercentOut)
def percent_funded(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    percent = get_percent_funded(db, drive_id)

    if percent is None:
        raise HTTPException(status_code=404, detail="Drive not found")

    return percent