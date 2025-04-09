from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation, DonationDriveLink
from schemas.donation_schema import DonationDriveOut, OneDonationDriveOut
from config.database import get_db
from util.alum_donation_util import get_donation_drive_data, get_one_donation_drive, general_donation_drive
from util.userutil import get_current_user
from models.usermodel import User
from schemas.user import UserTypeEnum
from uuid import UUID

router = APIRouter()

@router.get("/donationdrive", response_model=List[DonationDriveOut])
def get_donation_drives(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    drives = db.query(DonationDrive).filter(
        and_(
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False
        )
    ).all()
    
    donation_data = [get_donation_drive_data(db, drive) for drive in drives]

    return donation_data

@router.get("/donationdrive-limit", response_model=List[DonationDriveOut])
def get_donation_drives(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    drives = db.query(DonationDrive).filter(
        and_(
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False
        )
    ).limit(5).all()
    
    donation_data = [get_donation_drive_data(db, drive) for drive in drives]

    return donation_data

@router.get("/one-donation-drive/{drive_id}", response_model=OneDonationDriveOut)
def get_one_drive(
    drive_id: UUID,
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    drive = db.query(DonationDrive).filter(
        and_(
            DonationDrive.drive_id == drive_id,
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False
        )
    ).first()
    
    if not drive:
        raise HTTPException(status_code=404, detail="Donation drive not found")
    
    return get_one_donation_drive(db, drive)

@router.get("/gen-donation-drive", response_model=OneDonationDriveOut)
def get_one_drive(
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    drive = db.query(DonationDrive).filter(
        and_(
            DonationDrive.is_general == True,
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False
        )
    ).first()
    
    if not drive:
        raise HTTPException(status_code=404, detail="Donation drive not found")
    
    return general_donation_drive(db, drive)