from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserOut
from config.database import get_db
from models.usermodel import User
from routers.admin_account_management import isAdmin
from util.user_information_reports import get_user_filtered_city, get_user_filtered_state, get_user_filtered_country
router = APIRouter()


@router.get("/admin/get_users_city")
async def get_per_loc(db: Session = Depends(get_db)):
    user_per_city = get_user_filtered_city(db)

    return {"message": "success", "data": user_per_city}

@router.get("/admin/get_users_state")
async def get_per_loc(db: Session = Depends(get_db)):
    user_per_state = get_user_filtered_state(db)

    return {"message": "success", "data": user_per_state}

@router.get("/admin/get_users_country")
async def get_per_loc(db: Session = Depends(get_db)):
    user_per_country = get_user_filtered_country(db)

    return {"message": "success", "data": user_per_country}

