from datetime import datetime, timedelta
from typing import Dict, List, Optional
from fastapi import Depends, APIRouter, HTTPException, Query, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session
from config.database import get_db
from models.usermodel import User, UserTypeEnum, UserEmploymentStatus
from routers.admin_account_management import isAdmin

from util.user_information_stats import  employment_class_util, get_active_alumni_stats, get_employment_status, get_cities_country, get_job_util, get_top_country_batch, grouped_by_industry, salary_grade_util, tenure_status_util, unemployment_reason_util, work_mode_util

from util.admin_alum_list import get_alumni_list_filter,  get_alumni_filter, get_all_alumni, get_student_filter

router = APIRouter(
    tags=["Admin Stats"],
    responses={404: {"description": "Not found"}}
)



@router.get("/admin/all_alumni")
async def get_all_alumni_route(db: Session = Depends(get_db)):
    all_alumni = get_all_alumni(db)

    return{"message": "success", "data": all_alumni}

@router.get("/admin/stats/get_active_by_batch")
async def get_active_batch(db: Session= Depends(get_db), order:Optional[str] = None, page: int =1):
    active_batch, total_pages = get_active_alumni_stats(db, order=order, page=page, alumni_general=False)

    return{"message": "success", "total_pages": total_pages, "data": active_batch}

@router.get("/admin/stats/get_active/{batch}")
async def get_active_batch(db: Session= Depends(get_db), batch:Optional[str] = None):
    one_year_ago = datetime.now() - timedelta(days=365)
    query = db.query(
            func.count().label("total_users"),
            func.sum(
                case(
                    (User.updated_at >= one_year_ago, 1),
                    else_=0
                )
            ).label("active_users"),
            func.sum(
                case(
                    (User.updated_at < one_year_ago, 1),
                    else_=0
                )
            ).label("inactive_users")
        ).where(User.is_onboarded == True, User.is_verified == True, User.user_type == 'alumni', func.split_part(User.student_number, '-', 1) == batch, User.student_number.is_not(None)).first()


    active_batch = {
        "total_users": query.total_users,
        "active_users" : query.active_users,
        "active_percentage": round((query.active_users/query.total_users)*100, 2) if query.total_users else 0,
        "inactive_users": query.inactive_users,
        "inactive_percentage": round((query.inactive_users/query.total_users)*100, 2) if query.total_users else 0,
    }
    return{"message": "success", "data": active_batch}

@router.get("/admin/stats/getAllYears")
async def get_all_years(db: Session=Depends(get_db)):
    query = db.query(
        func.split_part(User.student_number, '-', 1).label("batch")
    ).filter(User.user_type == UserTypeEnum.alumni, User.is_onboarded == True).distinct().order_by('batch').all()
    print(query)

    return {"message": "success", "data": [batch[0] for batch in query if batch[0] is not None]}

@router.get("/admin/stats/get_batch_employment")
async def get_batch_employment(db:Session=Depends(get_db), batch:str=""):
    batch_employ = get_employment_status(db, batch)


    return{"message": "success", "data": batch_employ}

@router.get("/admin/stats/get_batch_top_jobs")
async def get_batch_top_jobs(db:Session=Depends(get_db), batch:str=""):
    top_jobs = get_job_util(db, batch=batch, industry=None, country=None)

    return{"message":"success", "data":top_jobs}


@router.get("/admin/stats/get_batch_top_industries")
async def get_batch_top_industries(db:Session=Depends(get_db), batch:str=""):

    top_industries =  grouped_by_industry(db, batch=batch, country =None, limit=True)


    return{"message":"success", "data":top_industries}

@router.get("/admin/stats/get_batch_top_countries")
async def get_batch_top_countries(db:Session=Depends(get_db), batch:str=""):
    top_countries =  get_top_country_batch(db, batch, limit=True)

    return{"message":"success", "data":top_countries}

@router.get("/admin/stats/get_country_top_jobs")
async def get_country_top_jobs(db:Session=Depends(get_db), country:str=""):
    top_jobs = get_job_util(db, batch=None, industry=None, country=country)

    return{"message":"success", "data":top_jobs}

@router.get("/admin/stats/get_industry_jobs")
async def get_country_top_jobs(db:Session=Depends(get_db), industry:str=""):
    top_jobs = get_job_util(db, batch=None, industry=industry, country=None)

    return{"message":"success", "data":top_jobs}

@router.get("/admin/stats/get_country_top_industries")
async def get_country_top_industries(db:Session=Depends(get_db), country:str=""):

    top_industries = grouped_by_industry(db, batch=None, country =country, limit=True)


    return{"message":"success", "data":top_industries}

@router.get("/admin/stats/get_country_cities")
async def get_country_cities(db:Session=Depends(get_db), country:str=""):
    cities = get_cities_country(db, country)

    return{"message":"success", "data":cities}


##ADD ORDER BY- pwede input ay 'name', 'batch', 'last_updated'
@router.get("/admin/stats/alumni_batch_filter")
async def get_alumni_batch(db: Session = Depends(get_db), batch: str="", order_by: list[str]=Query([]), page:int=1):
    alumni_batch, total_pages = get_alumni_list_filter(db, batch=batch, industry = None, country=None, page=page, order_by= order_by)

    return{"message":"success", "page":page, "total_pages": total_pages, "data":alumni_batch}

@router.get("/admin/stats/alumni_industry_filter")
async def get_alumni_industry(db: Session = Depends(get_db), industry: str="", order_by: list[str]=Query([]), page: int=1):
    alumni_industry, total_pages = get_alumni_list_filter(db, batch=None, industry = industry, country=None, order_by= order_by, page=page)

    return{"message":"success","page":page, "total_pages": total_pages,   "data":alumni_industry}

@router.get("/admin/stats/alumni_country_filter")
async def get_alumni_country(db: Session = Depends(get_db), country: str="",order_by: list[str]=Query([]), page:int=1):
    alumni_country, total_pages = get_alumni_list_filter(db, batch=None, industry = None, country=country, page=page,order_by= order_by)

    return{"message":"success","page":page, "total_pages": total_pages, "data":alumni_country}

@router.get("/admin/filter/alum")
async def search_alumni(
    name: Optional[str] = None,
    graduation_year: Optional[int] = None,
    job_title: Optional[str] = None,
    city: Optional[str] = None,
    skill: Optional[str] = None,
    industry: Optional[str] = None,
    batch: Optional[str] = None,
    affiliation: Optional[str] = None,
    order_by: list[str]=Query([]),
    page: int = 1,
    db: Session = Depends(get_db)
):
    
    results,total_pages = get_alumni_filter(db, 
                                name=name,
                                page=page,
                                graduation_year=graduation_year, 
                                job_title=job_title, 
                                city=city, skill=skill, 
                                industry=industry, 
                                batch=batch, 
                                affiliation=affiliation, 
                                order_by=order_by, 
                                needs_verified=True)

    
    # Raise 404 if no results found
    if not results:
        raise HTTPException(status_code=404, detail="No alumni found matching the search criteria")
    
    return {
        "message": "success",
        "page": page,
        "total_pages": total_pages,
        "items": results
    }


@router.get("/admin/filter/unverified/alum")
async def search_alumni_unverified(
    name: Optional[str] = None,
    graduation_year: Optional[int] = None,
    batch: Optional[str] = None,
    order_by: list[str]=Query([]),
    db: Session = Depends(get_db),
    page: int = 1
):
    
    results, total_pages = get_alumni_filter(db, 
                                name=name, 
                                graduation_year=graduation_year,
                                page =page, 
                                job_title=None, 
                                city=None, 
                                skill=None, 
                                industry=None, 
                                batch=batch, 
                                affiliation=None, 
                                order_by=order_by, 
                                needs_verified=False)
    
    # Raise 404 if no results found
    if not results:
        raise HTTPException(status_code=404, detail="No alumni found matching the search criteria")
    
    return {
        "message": "success",
        "page": page,
        "total_pages": total_pages,
        "items": results
    }


@router.get("/admin/filter/student")
async def search_student(
    name: Optional[str] = None,
    batch: Optional[str] = None,
    affiliation: Optional[str] = None,
    order_by: list[str]=Query([]),
    standing: Optional[str] = None,
    db: Session = Depends(get_db),
    page: int =1
):
    
    results, total_pages = get_student_filter(db, name=name, 
                                 batch=batch, 
                                 standing=standing, 
                                 affiliation=affiliation, 
                                 order_by=order_by, 
                                 page=page,
                                 needs_verified=True)
    
    # Raise 404 if no results found
    if not results:
        raise HTTPException(status_code=404, detail="No student found matching the search criteria")
    
    return {
        "message": "success",
        "page": page,
        "total_pages": total_pages,
        "items": results
    }

@router.get("/admin/filter/unverified/student")
async def search_student(
    name: Optional[str] = None,
    batch: Optional[str] = None,
    order_by: list[str]=Query([]),
    db: Session = Depends(get_db),
    page:int =1
):
    
    results, total_pages = get_student_filter(db, 
                                 name=name, 
                                 batch=batch, 
                                 standing=None, 
                                 affiliation=None, 
                                 order_by=order_by, 
                                 page =page,
                                 needs_verified=False)
    
    # Raise 404 if no results found
    if not results:
        raise HTTPException(status_code=404, detail="No alumni student matching the search criteria")
    
    return {
        "message": "success",
        "page": page,
        "total_pages": total_pages,
        "items": results
    }

@router.get("/admin/unverified/count")
async def count_unverified(db: Session = Depends(get_db)):

    count_unverified =  (
        db.query(
            func.count()
        ).where(
            User.is_verified == False,
        ).scalar()
    )


    if count_unverified is None:
        raise HTTPException(status_code=404, detail="Cannot count unverified users")
    
    return {"message": "success","count": count_unverified}


@router.get("/admin/stats/employment_status")
async def get_employment(db:Session=Depends(get_db), batch: Optional[str] = None):
    batch_employ = get_employment_status(db, batch=batch)


    return{"message": "success", "data": batch_employ}

@router.get("/admin/stats/employment_class")
async def get_employment_class(db:Session=Depends(get_db), batch: Optional[str] = None):
    batch_employ_class = employment_class_util(db, industry= None, batch=batch)


    return{"message": "success", "data": batch_employ_class}

@router.get("/admin/stats/industry/employment_class")
async def get_employment_class(db:Session=Depends(get_db), industry:str = None):
    batch_employ_class = employment_class_util(db, industry= industry, batch=None)


    return{"message": "success", "data": batch_employ_class}


@router.get("/admin/stats/industry/count")
async def get_industry_count(db:Session=Depends(get_db),  batch: Optional[str] = None):
    industry_count = grouped_by_industry(db, batch=batch, country =None, limit=False)
    return{"message": "success", "data": industry_count}

@router.get("/admin/stats/industry/salary_grade")
async def get_salary_count(db:Session=Depends(get_db), industry:str=None):
    industry_count = salary_grade_util(db, industry = industry, batch=None)
    return{"message": "success", "data": industry_count}


@router.get("/admin/stats/industry/tenured_status")
async def get_tenure_count(db:Session=Depends(get_db), industry:str=None):
    tenure_count = tenure_status_util(db, industry = industry)
    return{"message": "success", "data": tenure_count}

@router.get("/admin/stats/industry/work_type")
async def get_worktype_count(db:Session=Depends(get_db), industry:str=None):
    work_mode = work_mode_util(db, industry = industry)
    return{"message": "success", "data": work_mode}

@router.get("/admin/stats/salary_grade")
async def get_worktype_count(db:Session=Depends(get_db), batch:Optional[str] = None):
    sal_grade = salary_grade_util(db, industry = None, batch=batch)
    return{"message": "success", "data": sal_grade}

@router.get("/admin/stats/countries")
async def country_route(db: Session = Depends(get_db), batch: Optional[str] = None):

    top_countries =  get_top_country_batch(db, batch, limit=False)

    return{"message":"success", "data":top_countries}

@router.get("/admin/stats/activity")
async def general_activity_route(db: Session = Depends(get_db)):
    activity_data= get_active_alumni_stats(db, alumni_general = True, page=1)


    return{"message": "success", "data": activity_data}


@router.get("/admin/stats/batch/unemployment")
async def batch_unemployment(db: Session = Depends(get_db), batch: Optional[str] = None):
    unemployment_reason = unemployment_reason_util(db, batch = batch)

    return{"message": "success", "data": unemployment_reason}
@router.get("/get-all-industries")
async def get_industries(db: Session= Depends(get_db)):
    query = db.query(
       User.industry,
       func.count().label("count")
    ).filter(User.is_onboarded == True, User.employment_status == UserEmploymentStatus.employed).distinct().group_by(User.industry).order_by(User.industry).all()

    return {"message": "success", "data": [{"industry": industry.industry, "count": industry.count} for industry in query if industry[0] is not None or industry[0] != ""]}

@router.get("/get-all-countries")
async def get_industries(db: Session= Depends(get_db)):
    query = db.query(
       User.country,
       func.count().label("count")
    ).filter(User.is_onboarded == True).distinct().group_by(User.country).order_by(User.country).all()

    return {"message": "success", "data": [{"country": country.country, "count": country.count} for country in query if country[0] is not None or country[0] != ""]}