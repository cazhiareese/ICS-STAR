
from typing import Dict, List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from util.alumni_search_logic import logic_search_alumni
from models.usermodel import UnemploymentReason, User, UserAffiliation, UserEmploymentStatus, UserSkill, UserTypeEnum
from models.report_model import Report
from sqlalchemy import func, case, or_, text, desc,asc
from datetime import datetime, timedelta



def get_active_alumni_stats(db: Session, order: Optional[str] = None, alumni_general: bool = False, page: int =1):
    one_year_ago = datetime.now() - timedelta(days=365)
    ITEMS_PER_PAGE = 5
    if alumni_general:
        # Return general alumni statistics (not broken down by batch)
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
        ).where(User.is_verified == True, User.user_type == 'alumni', User.student_number.is_not(None))
        
        result = query.first()
        if not result:
            raise HTTPException(status_code=404, detail="No alumni users found")
            
        result_dict = result._asdict()
        return {
            "total_alumni": result_dict["total_users"],
            "active_alumni": result_dict["active_users"],
            "active_alumni_percentage": round((result_dict["active_users"]/result_dict["total_users"])*100, 2) if result_dict["total_users"] else 0,
            "inactive_alumni": result_dict["inactive_users"],
            "inactive_alumni_percentage": round((result_dict["inactive_users"]/result_dict["total_users"])*100, 2) if result_dict["total_users"] else 0,
        }
    else:
        # Return batch-based statistics (original functionality)
        query = (
            db.query(
                func.split_part(User.student_number, '-', 1).label("batch"),
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
            ).where(User.is_verified == True, User.student_number.is_not(None))
            .group_by("batch")
        )
        subq = query.subquery()

        total_batches = db.query(func.count()).select_from(subq).scalar()
        print(total_batches)

        if order:
            order_parts = order.lower().split('_')
            field = text('_'.join(order_parts[:-1]))
            direction = order_parts[-1] if len(order_parts) > 1 else 'asc'
            
            if direction == "desc":
                query = query.order_by(desc(field))
            else:
                query = query.order_by(field)
        

        offset = (page - 1) * ITEMS_PER_PAGE
        query = query.offset(offset).limit(ITEMS_PER_PAGE)

        result = query.all()

        total_pages = max((total_batches + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE, 1)
        if not result:
            raise HTTPException(status_code=404, detail="No users found for any batch")

        # Convert each row to a dictionary
        result_dicts = [row._asdict() for row in result]

        results_analyzed = []
        for res in result_dicts:
            results_analyzed.append({
                "batch": res["batch"],
                "total_users": res["total_users"],
                "active_users": res["active_users"],
                "active_users_percentage": round((res["active_users"]/res["total_users"])*100, 2) if res["total_users"] else 0,
                "inactive_users": res["inactive_users"],
                "inactive_users_percentage": round((res["inactive_users"]/res["total_users"])*100, 2) if res["total_users"] else 0,
            })


        return results_analyzed, total_pages

def get_employment_status(db: Session, batch:Optional[str] = None):

    sum_query = (
    db.query(
        func.count()
    )
    .filter(

        User.is_verified == True,

        User.user_type == 'alumni',
        User.employment_status.is_not(None),
        
    )
    )

    if batch:
        sum_query = sum_query.filter(
            func.split_part(User.student_number, '-', 1) == batch
        )
    
    total_alumni_sum = sum_query.scalar()

    query = (
        db.query(
            User.employment_status.label("employment_status"),
            func.count().label("total_alumni")

        ).filter(User.is_verified == True, User.user_type == 'alumni', User.employment_status.is_not(None))

    )

    if batch:
        query = query.filter(func.split_part(User.student_number, '-', 1)== batch)
    
    employment = query.group_by(User.employment_status).all()

    if not employment:
        raise HTTPException(status_code=404, detail="No alumni with employment status")

    employment_dicts = [row._asdict() for row in employment]

    employment_status_batch = []
    for emp in employment_dicts:
       employment_status_batch.append({"status": emp["employment_status"],
            "count" : emp["total_alumni"],
            "percentage": round((emp["total_alumni"]/total_alumni_sum) * 100,2)
        })
    
    return employment_status_batch


def get_job_util(db: Session, batch:Optional[str] = None, industry: Optional[str] = None, country: Optional[str] = None):
    sum_query= (
    db.query(
        func.count()
    )
    .filter(

        User.is_verified == True,

        User.user_type == 'alumni',
        User.job_title.is_not(None)
    )
    ) 

    query = (
        db.query(
            User.job_title,
            func.count().label("job_count")
        )
        .filter( User.is_verified == True,User.user_type == 'alumni', User.job_title.isnot(None))  

        
    )

    if batch:
        sum_query = sum_query.filter(func.split_part(User.student_number, '-', 1)== batch)
        query = query.filter(func.split_part(User.student_number, '-', 1)== batch).group_by(User.job_title).order_by(func.count().desc()).limit(5)

    elif country: 
        sum_query = sum_query.filter(User.country == country)
        query = query.filter(User.country == country).group_by(User.job_title).order_by(func.count().desc()).limit(5)

    elif industry:
        sum_query = sum_query.filter(User.industry == industry)
        query = query.filter(User.industry == industry).group_by(User.job_title).order_by(func.count().desc())
    else:

        query = query.group_by(User.job_title).order_by(func.count().desc())


    total_employed = sum_query.scalar()

    top_jobs = query.all()
    if not top_jobs:
        raise HTTPException(status_code=404, detail="No top jobs")

    top_jobs_dict = [row._asdict() for row in top_jobs]

    batch_top_jobs = []

    for job in top_jobs_dict:
        batch_top_jobs.append({
            "job_title": job["job_title"],
            "count": job["job_count"],
            "percentage": round((job["job_count"]/total_employed)*100,2)
        })
    
    return batch_top_jobs


def get_top_country_batch(db: Session, batch: Optional[str] = None, limit: bool= False):
    sum_query= (
    db.query(
        func.count()
    )
    .where(
        User.is_verified == True,
        User.country.is_not(None),
        
    ))
     
    
    query = (
        db.query(
            User.country,
            func.count().label("count")
        )
        .filter(User.is_verified == True, User.user_type == 'alumni', User.country.isnot(None))  

    )

    if batch:
        sum_query = sum_query.filter(func.split_part(User.student_number, '-', 1) == batch)
        if limit: 
            query = query.filter(func.split_part(User.student_number, '-', 1)== batch).group_by(User.country).order_by(func.count().desc()).limit(5) 
        else: 
            query = query.filter(func.split_part(User.student_number, '-', 1)== batch).group_by(User.country).order_by(func.count().desc())
    else:
        query = query.group_by(User.country).order_by(func.count().desc())

    total_in_country = sum_query.scalar()
    top_countries =  query.all()
    if not top_countries:
        raise HTTPException(status_code=404, detail="No top countries")

    top_countries_dict = [row._asdict() for row in top_countries]

    batch_top_countries = []

    for country in top_countries_dict:
        batch_top_countries.append({
            "country": country["country"],
            "count": country["count"],
            "percentage": round((country["count"]/total_in_country)*100,2)
        })
    
    return batch_top_countries



def get_cities_country(db:Session, country:str):
    total_in_country= (
    db.query(
        func.count()
    )
    .where(
        User.is_verified == True,
        User.user_type == 'alumni',
        User.city.is_not(None),
        User.country == country
    )
    .scalar() 
    )


    grouped_city= (
        db.query(User.city, func.count().label("count"))
        .filter(User.is_verified == True, User.user_type == 'alumni', User.country == country, User.city.is_not(None))
        .group_by(User.city).all()
    )

    if not grouped_city:
        raise HTTPException(status_code=404, detail="No top cities")
    
    cities_dicts = [row._asdict() for row in grouped_city]

    cities_country = []
    for city in cities_dicts:
       cities_country.append({"city": city["city"],
            "count" : city["count"],
            "percentage": round((city["count"]/total_in_country) * 100,2)
        })
       
    return cities_country



def employment_class_util(db: Session, industry:Optional[str] = None, batch: Optional[str] = None):

    sum_query = (
    db.query(
        func.count()
    )
    .filter(
        User.is_verified == True,
        User.user_type == 'alumni',
        User.employer_class.is_not(None),
        
    )
    )

    query = (
        db.query(
            User.employer_class.label("employer_class"),
            func.count().label("total_alumni")
        ).filter( User.is_verified == True,User.user_type == 'alumni', User.employer_class.is_not(None))
    )

    if batch:
        sum_query = sum_query.filter(func.split_part(User.student_number, '-', 1)== batch)
        query = query.filter(func.split_part(User.student_number, '-', 1)== batch)

    if industry:
        sum_query = sum_query.filter(
            User.industry == industry
        )
        query = query.filter( User.industry == industry)
    
    total_alumni_sum = sum_query.scalar()
    employment = query.group_by(User.employer_class).all()

    if not employment:
        raise HTTPException(status_code=404, detail="No alumni with employment class")

    employment_dicts = [row._asdict() for row in employment]

    employment_class_list = []
    for emp in employment_dicts:
       employment_class_list.append({"class": emp["employer_class"],
            "count" : emp["total_alumni"],
            "percentage": round((emp["total_alumni"]/total_alumni_sum) * 100,2)
        })
    
    return employment_class_list



def salary_grade_util(db: Session, industry:Optional[str] = None, batch:Optional[str] = None ):

    sum_query= (
    db.query(
        func.count()
    )
    .where(
        User.is_verified == True,
        User.user_type == 'alumni',
        User.salary_grade.is_not(None),
    )
    )

    query = (
        db.query(
            User.salary_grade,
            func.count().label("count")
        )
        .filter(User.is_verified == True, User.user_type == 'alumni', User.salary_grade.isnot(None))  
        
    )

    if batch:
        sum_query = sum_query.filter(func.split_part(User.student_number, '-', 1)== batch)
        query = query.filter(func.split_part(User.student_number, '-', 1)== batch)


    if industry:
        sum_query = sum_query.filter(User.industry == industry)
        query = query.filter(User.industry == industry)
    
    total_employed = sum_query.scalar()

    top_salary = query.group_by(User.salary_grade).order_by(func.count().desc()).all()

    if not top_salary:
        raise HTTPException(status_code=404, detail="No top industries")

    top_salaries_dict = [row._asdict() for row in top_salary]
    top_salaries_list = []

    for sal in top_salaries_dict:
        top_salaries_list.append({
            "salary_grade": sal["salary_grade"],
            "count": sal["count"],
            "percentage": round((sal["count"]/total_employed)*100,2)
        })
    
    return top_salaries_list


def grouped_by_industry(db: Session, batch: Optional[str] = None, country: Optional[str] = None, limit: bool = False):
    sum_query= (
    db.query(
        func.count()
    )
    .where(
        User.is_verified == True,
        User.user_type == 'alumni',
        User.industry.is_not(None),
    )
    )

    
    query = (
        db.query(
            User.industry,
            func.count().label("industry_count")
        )
        .filter(User.is_verified == True,User.user_type == 'alumni', User.industry.isnot(None))  
    )

    if batch:
        sum_query = sum_query.filter(func.split_part(User.student_number, '-', 1)== batch)
        if limit:
            query = query.filter(func.split_part(User.student_number, '-', 1)== batch).group_by(User.industry).order_by(func.count().desc()).limit(5)
        else: 
            query = query.filter(func.split_part(User.student_number, '-', 1)== batch).group_by(User.industry).order_by(func.count().desc())

    elif country: 
        sum_query = sum_query.filter(User.country == country)
        query = query.filter(User.country == country).group_by(User.industry).order_by(func.count().desc()).limit(5)
    else:
        query = query.group_by(User.industry).order_by(func.count().desc())
    
    total_employed = sum_query.scalar()
    top_industries = query.all()
    if not top_industries:
        raise HTTPException(status_code=404, detail="No top industries")

    top_industries_dict = [row._asdict() for row in top_industries]

    top_industries_list = []

    for ind in top_industries_dict:
        top_industries_list.append({
            "industry": ind["industry"],
            "count": ind["industry_count"],
            "percentage": round((ind["industry_count"]/total_employed)*100,2)
        })
    
    return top_industries_list

def tenure_status_util(db: Session, industry: Optional[str] = None):
    sum_query= (
    db.query(
        func.count()
    )
    .where(
        User.is_verified == True,
        User.user_type == 'alumni',
        User.tenured_status.is_not(None),
    ))
     

    query = (
        db.query(
            User.tenured_status,
            func.count().label("count")
        )

        .filter(User.is_verified == True,User.user_type == 'alumni', User.tenured_status.isnot(None))
        
    )

    if industry:
        sum_query = sum_query.filter(User.industry == industry)
        query = query.filter(User.industry == industry)
    
    total_employed = sum_query.scalar()

    tenure = query.group_by(User.tenured_status).order_by(func.count().desc()).all()

    if not tenure:
        raise HTTPException(status_code=404, detail="No top industries")

    tenure_dict = [row._asdict() for row in tenure]
    tenure_list = []

    for ten in tenure_dict:
        tenure_list.append({
            "tenured_status": ten["tenured_status"],
            "count": ten["count"],
            "percentage": round((ten["count"]/total_employed)*100,2)
        })
    
    return tenure_list

def work_mode_util(db: Session, industry: Optional[str] = None):
    sum_query= (
    db.query(
        func.count()
    )
    .where(

        User.is_verified == True,
        User.user_type == 'alumni',
        User.work_mode.is_not(None),
    ))
    

    query = (
        db.query(
            User.work_mode,
            func.count().label("count")
        )
        .filter(User.is_verified == True,User.user_type == 'alumni', User.work_mode.isnot(None))         
    )

    if industry:
        sum_query = sum_query.filter(User.industry == industry)
        query = query.filter(User.industry == industry)
    
    total_employed = sum_query.scalar()

    mode = query.group_by(User.work_mode).order_by(func.count().desc()).all()

    if not mode:

        raise HTTPException(status_code=404, detail="No work mode available")


    mode_dict = [row._asdict() for row in mode]
    mode_list = []

    for mod in mode_dict:
        mode_list.append({
            "work_mode": mod["work_mode"],
            "count": mod["count"],
            "percentage": round((mod["count"]/total_employed)*100,2)
        })
    
    return mode_list


def unemployment_reason_util(db: Session, batch: Optional[str] = None):
    unemployed_query = (
    db.query(
        func.count()
    )
    .filter(
        User.is_verified == True,
        User.user_type == 'alumni',
        or_(User.employment_status == UserEmploymentStatus.unemployed, User.employment_status == UserEmploymentStatus.unemployed_no_exp)
        
    )
    )
    
    query = (
    db.query(
        UnemploymentReason.reason,
        func.count(User.user_id).label('user_count')
    )
    .join(UnemploymentReason, User.reasons)
    .group_by(UnemploymentReason.reason)  # Only group by reason now
    )

    if batch:
        unemployed_query = unemployed_query.filter(func.split_part(User.student_number, '-', 1)== batch)
        query = query.filter(func.split_part(User.student_number, '-', 1)== batch)  # Filter to just one batch   
    
    total_unemployed = unemployed_query.scalar()
    unemployed_reason = query.all()

    if not unemployed_reason:
        raise HTTPException(status_code=404, detail="No unemployment reason")


    reason_dict = [row._asdict() for row in unemployed_reason]
    reason_list = []

    for reas in reason_dict:
        reason_list.append({
            "work_mode": reas["reason"],
            "count": reas["user_count"],
            "percentage": round((reas["user_count"]/total_unemployed)*100,2)
        })
    
    return reason_list



