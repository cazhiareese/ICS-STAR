from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation
from schemas.donation_schema import DonationDriveOut
from config.database import get_db
from util.alum_donation_util import get_donation_drive_data
from util.userutil import get_current_user
from models.usermodel import User
from schemas.user import UserTypeEnum

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