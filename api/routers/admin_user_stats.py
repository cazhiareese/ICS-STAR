from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserOut
from config.database import get_db
from models.usermodel import User
from routers.admin_account_management import isAdmin
from util.user_information_stats import get_user_filter_batch, get_user_filtered_city, get_user_filtered_state, get_user_filtered_country, get_user_all_batch, get_user_grouped_industry, get_user_grouped_job_title
router = APIRouter()

#Get alumni and students per city (for admin users only)
#Arguments: db session
#Returns: List of dictionaries classified if alumni or student, cities with list of user_ids
@router.get("/admin/stats/get_users_city")
async def get_per_loc(db: Session = Depends(get_db), verbose: bool=True):
    user_per_city = get_user_filtered_city(db, verbose)

    return {"message": "success", "data": user_per_city}

#Get alumni and students per state(for admin users only)
#Arguments: db session
#Returns: List of dictionaries classified if alumni or student, states with list of user_ids
@router.get("/admin/stats/get_users_state", dependencies=[Depends(isAdmin)])
async def get_per_loc(db: Session = Depends(get_db), verbose: bool=True):
    user_per_state = get_user_filtered_state(db, verbose)

    return {"message": "success", "data": user_per_state}

#Get alumni and students per country(for admin users only)
#Arguments: db session
#Returns: List of dictionaries classified if alumni or student, countries with list of user_ids
@router.get("/admin/stats/get_users_country",dependencies=[Depends(isAdmin)] )
async def get_per_loc(db: Session = Depends(get_db), verbose: bool=True):
    user_per_country = get_user_filtered_country(db, verbose)

    return {"message": "success", "data": user_per_country}


@router.get("/admin/stats/batch", dependencies=[Depends(isAdmin)])
async def get_per_batch(db: Session = Depends(get_db), verbose: bool=True):
    user_per_batch = get_user_all_batch(db, verbose)

    return {"message": "success", "data": user_per_batch}

@router.get("/admin/filter/batch-alumni", dependencies=[Depends(isAdmin)])
async def get_filtered_batch(db: Session = Depends(get_db), batch: str =""):
    user_from_batch = get_user_filter_batch(db, batch, "alumni")

    return {"message": "success", "data": user_from_batch}

@router.get("/admin/filter/batch-student", dependencies=[Depends(isAdmin)])
async def get_filtered_batch(db: Session = Depends(get_db), batch: str =""):
    user_from_batch = get_user_filter_batch(db, batch, "student")

    return {"message": "success", "data": user_from_batch}


@router.get("/admin/stats/industry", dependencies=[Depends(isAdmin)])
async def get_grouped_industry(db: Session = Depends(get_db), verbose: bool=True):
    user_grouped_industry = get_user_grouped_industry(db, verbose)

    return {"message": "success", "data": user_grouped_industry}

@router.get("/admin/stats/job_title", dependencies=[Depends(isAdmin)])
async def get_grouped_industry(db: Session = Depends(get_db), verbose: bool=True):
    user_grouped_job_title = get_user_grouped_job_title(db, verbose)

    return {"message": "success", "data": user_grouped_job_title}

