from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserOut
from config.database import get_db
from models.usermodel import User
from routers.admin_account_management import isAdmin
from util.user_information_stats import get_alumni_batch_filter, get_alumni_country_filter, get_alumni_industry_filter, get_batch_employment_status, get_cities_country, get_top_country_batch, get_top_industries_batch, get_top_industries_country, get_top_job_batch, get_top_job_country, get_user_filter_batch, get_user_filtered_city, get_user_filtered_state, get_user_filtered_country, get_user_all_batch, get_user_grouped_industry, get_user_grouped_job_title, get_all_alumni, get_active_by_batch


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
@router.get("/admin/stats/get_users_state", dependencies=None)
async def get_per_loc(db: Session = Depends(get_db), verbose: bool=True):
    user_per_state = get_user_filtered_state(db, verbose)

    return {"message": "success", "data": user_per_state}

#Get alumni and students per country(for admin users only)
#Arguments: db session
#Returns: List of dictionaries classified if alumni or student, countries with list of user_ids
@router.get("/admin/stats/get_users_country",dependencies=None )
async def get_per_loc(db: Session = Depends(get_db), verbose: bool=True):
    user_per_country = get_user_filtered_country(db, verbose)

    return {"message": "success", "data": user_per_country}


@router.get("/admin/stats/batch", dependencies=None)
async def get_per_batch(db: Session = Depends(get_db), verbose: bool=True):
    user_per_batch = get_user_all_batch(db, verbose)

    return {"message": "success", "data": user_per_batch}

@router.get("/admin/filter/batch-alumni", dependencies=None)
async def get_filtered_batch(db: Session = Depends(get_db), batch: str =""):
    user_from_batch = get_user_filter_batch(db, batch, "alumni")

    return {"message": "success", "data": user_from_batch}

@router.get("/admin/filter/batch-student", dependencies=None)
async def get_filtered_batch(db: Session = Depends(get_db), batch: str =""):
    user_from_batch = get_user_filter_batch(db, batch, "student")

    return {"message": "success", "data": user_from_batch}


@router.get("/admin/stats/industry", dependencies=None)
async def get_grouped_industry(db: Session = Depends(get_db), verbose: bool=True):
    user_grouped_industry = get_user_grouped_industry(db, verbose)

    return {"message": "success", "data": user_grouped_industry}

@router.get("/admin/stats/job_title", dependencies=None)
async def get_grouped_industry(db: Session = Depends(get_db), verbose: bool=True):
    user_grouped_job_title = get_user_grouped_job_title(db, verbose)

    return {"message": "success", "data": user_grouped_job_title}


@router.get("/admin/all_alumni")
async def get_all_alumni_route(db: Session = Depends(get_db)):
    all_alumni = get_all_alumni(db)

    return{"message": "success", "data": all_alumni}

@router.get("/admin/stats/get_active_by_batch")
async def get_active_batch(db: Session= Depends(get_db), order:str="total_users"):
    active_batch = get_active_by_batch(db, order)

    return{"message": "success", "data": active_batch}

@router.get("/admin/stats/get_batch_employment")
async def get_batch_employment(db:Session=Depends(get_db), batch:str=""):
    batch_employ = get_batch_employment_status(db, batch)


    return{"message": "success", "data": batch_employ}

@router.get("/admin/stats/get_batch_top_jobs")
async def get_batch_top_jobs(db:Session=Depends(get_db), batch:str=""):
    top_jobs = get_top_job_batch(db, batch)

    return{"message":"success", "data":top_jobs}


@router.get("/admin/stats/get_batch_top_industries")
async def get_batch_top_industries(db:Session=Depends(get_db), batch:str=""):
    top_industries =  get_top_industries_batch(db, batch)

    return{"message":"success", "data":top_industries}

@router.get("/admin/stats/get_batch_top_countries")
async def get_batch_top_countries(db:Session=Depends(get_db), batch:str=""):
    top_countries =  get_top_country_batch(db, batch)

    return{"message":"success", "data":top_countries}

@router.get("/admin/stats/get_country_top_jobs")
async def get_country_top_jobs(db:Session=Depends(get_db), country:str=""):
    top_jobs = get_top_job_country(db, country)

    return{"message":"success", "data":top_jobs}

@router.get("/admin/stats/get_country_top_industries")
async def get_country_top_industries(db:Session=Depends(get_db), country:str=""):
    top_industries = get_top_industries_country(db, country)

    return{"message":"success", "data":top_industries}

@router.get("/admin/stats/get_country_cities")
async def get_country_cities(db:Session=Depends(get_db), country:str=""):
    cities = get_cities_country(db, country)

    return{"message":"success", "data":cities}


##ADD ORDER BY
@router.get("/admin/stats/alumni_batch_filter")
async def get_alumni_batch(db: Session = Depends(get_db), batch: str=""):
    alumni_batch = get_alumni_batch_filter(db, batch)

    return{"message":"success", "data":alumni_batch}

@router.get("/admin/stats/alumni_industry_filter")
async def get_alumni_industry(db: Session = Depends(get_db), industry: str=""):
    alumni_industry = get_alumni_industry_filter(db, industry)

    return{"message":"success", "data":alumni_industry}

@router.get("/admin/stats/alumni_country_filter")
async def get_alumni_country(db: Session = Depends(get_db), country: str=""):
    alumni_country = get_alumni_country_filter(db, country)

    return{"message":"success", "data":alumni_country}


