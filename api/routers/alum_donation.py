from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation, DonationDriveLink
from schemas.donation_schema import DonationDriveOut, OneDonationDriveOut
from config.database import get_db
from util.alum_donation_util import get_donation_drive_data, get_one_donation_drive, general_donation_drive, make_donation, fetch_drive_suggestions
from util.userutil import get_current_user
# from models.usermodel import User
from schemas.user import CurrentUser
from schemas.user import UserTypeEnum
from uuid import UUID

router = APIRouter()

@router.get("/drive-suggestions")
def get_drive_suggestions(
    q: str = Query(..., min_length=1, description="Search donation drive title"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    return fetch_drive_suggestions(db, q, limit)

@router.get("/donationdrive", response_model=List[DonationDriveOut])
def get_donation_drives(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    drives = db.query(DonationDrive).filter(
        and_(
            DonationDrive.is_general == False,
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False
        )
    ).all()
    
    donation_data = [get_donation_drive_data(db, drive) for drive in drives]

    return donation_data

@router.get("/donationdrive-limit", response_model=List[DonationDriveOut])
def get_donation_drives(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    drives = db.query(DonationDrive).filter(
        and_(
            DonationDrive.is_general == False,
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
    user: CurrentUser = Depends(get_current_user)
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
    user: CurrentUser = Depends(get_current_user)
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

@router.post("/make-donation/{drive_id}")
async def make_donations(
    drive_id: UUID,
    monetary_donation: bool = Form(...),
    in_kind_donation: bool = Form(...),
    amount: Optional[float] = Form(None),
    description: Optional[str] = Form(None),
    proof: Optional[UploadFile] = File(None),
    is_anonymous: Optional[bool] = Form(None),
    is_general: Optional[bool] = Form(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    drive = db.query(DonationDrive).filter(
        DonationDrive.drive_id == drive_id,
        DonationDrive.is_deleted == False,
        DonationDrive.is_closed == False
    ).first()
    
    
    if not drive:
        raise HTTPException(
            status_code=404,
            detail="Donation drive not found"
        )
    
    return await make_donation(
        db, user, drive, monetary_donation, in_kind_donation, amount, description, proof, is_anonymous
    )
    
@router.post("/make-general-donation")
async def make_donations(
    monetary_donation: bool = Form(...),
    in_kind_donation: bool = Form(...),
    amount: Optional[float] = Form(None),
    description: Optional[str] = Form(None),
    proof: Optional[UploadFile] = File(None),
    is_anonymous: Optional[bool] = Form(None),
    is_general: Optional[bool] = Form(None),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    
    if user.user_type.value == UserTypeEnum.student:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    if is_general:
        drive = db.query(DonationDrive).filter(
            DonationDrive.is_general == True,
            DonationDrive.is_deleted == False,
            DonationDrive.is_closed == False
        ).first()
    
    
    if not drive:
        raise HTTPException(
            status_code=404,
            detail="Donation drive not found"
        )
    
    return await make_donation(
        db, user, drive, monetary_donation, in_kind_donation, amount, description, proof, is_anonymous
    )