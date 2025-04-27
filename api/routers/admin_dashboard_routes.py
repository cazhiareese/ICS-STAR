from typing import Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from config.database import get_db
from models.usermodel import User
from models.donationmodel import MonetaryDonation, InKindDonation
from models.report_model import Report, ReportStatusEnum

router = APIRouter(
    prefix="/admin_dashboard",
    tags=["Admin Dashboard"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal Server Error"},
    },
)

# Fetch number of unverified users
@router.get("/unverified_users_count", response_model=Dict[str, int])
async def get_unverified_users_count(
    db: Session = Depends(get_db)
    ):
    try:
        unverified_users_count = db.query(User).filter(User.is_verified == False).count()
        return {"unverified_users_count": unverified_users_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
