from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.donation_schema import AdminDonationDriveOut, AdminOneDonationDriveOut
from config.database import get_db
from util.admin_donations_logic import search_donation_drives, view_donation_drive
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
    # Convert string dates to datetime objects if custom filter is selected
    custom_start_date = None
    custom_end_date = None
    if filter_type == "custom" and custom_start and custom_end:
        custom_start_date = datetime.date.fromisoformat(custom_start)
        custom_end_date = datetime.date.fromisoformat(custom_end)
    
    results = search_donation_drives(db, title, date_filter=filter_type, custom_start_date=custom_start_date, custom_end_date=custom_end_date)

    return results

@router.get("/admin/donations/{drive_id}", response_model=AdminOneDonationDriveOut)
def view_drive(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = view_donation_drive(db, drive_id)

    return results