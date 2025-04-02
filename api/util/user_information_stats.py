
from typing import Dict, List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from util.alumni_search_logic import logic_search_alumni
from models.usermodel import User, UserAffiliation, UserSkill, UserTypeEnum
from models.report_model import Report
from sqlalchemy import func, case, or_, text, desc,asc
from datetime import datetime, timedelta


def get_user_filtered_city (db: Session, verbose: bool):
    # [location : {alumni: [{}], student: [{}]}]
    cities = db.query(User.city).distinct().where(User.city.is_not(None), User.user_type != 'admin').all()

    if cities is None:
        raise HTTPException(status_code=404, detail="No locations found")
    city_list = [loc[0] for loc in cities]

    alum_with_loc = []
    stud_with_loc = []
    for loc in city_list:
        alum_loc = db.query(User.user_id, User.user_type).filter(User.city == loc, User.user_type=='alumni').all()
        stud_loc = db.query(User.user_id, User.user_type).filter(User.city == loc, User.user_type=='student').all()

        if alum_loc is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {loc}")

        if stud_loc is None:
            raise HTTPException(status_code=404, detail=f"No stud from this {loc}")
        
        # alum_loc_dict = {loc: [UserOut.model_validate(user) for user in alum_loc]}
        # stud_loc_dict = {loc: [UserOut.model_validate(user) for user in stud_loc]}
        if verbose:
            alum_loc_dict = {loc: [user[0] for user in alum_loc]}
            stud_loc_dict = {loc: [user[0] for user in stud_loc]}
        else:
            alum_loc_dict = {loc: len(alum_loc)}
            stud_loc_dict = {loc: len(stud_loc)}

        alum_with_loc.append(alum_loc_dict)
        stud_with_loc.append(stud_loc_dict)

    
    return {'students': stud_with_loc, 'alumni': alum_with_loc}

def get_user_filtered_state (db: Session, verbose:bool):
    states = db.query(User.state).distinct().where(User.state.is_not(None), User.user_type != 'admin').all()

    if states is None:
        raise HTTPException(status_code=404, detail="No locations found")
    state_list = [loc[0] for loc in states]

    alum_with_loc = []
    stud_with_loc = []
    for loc in state_list:
        alum_loc = db.query(User.user_id, User.user_type).filter(User.state == loc, User.user_type=='alumni').all()
        stud_loc = db.query(User.user_id, User.user_type).filter(User.state == loc, User.user_type=='student').all()

        if alum_loc is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {loc}")

        if stud_loc is None:
            raise HTTPException(status_code=404, detail=f"No stud from this {loc}")
        
        # alum_loc_dict = {loc: [UserOut.model_validate(user) for user in alum_loc]}
        # stud_loc_dict = {loc: [UserOut.model_validate(user) for user in stud_loc]}

        
        if verbose:
            alum_loc_dict = {loc: [user[0] for user in alum_loc]}
            stud_loc_dict = {loc: [user[0] for user in stud_loc]}
        else:
            alum_loc_dict = {loc: len(alum_loc)}
            stud_loc_dict = {loc: len(stud_loc)}
        alum_with_loc.append(alum_loc_dict)
        stud_with_loc.append(stud_loc_dict)

    
    return {'students': stud_with_loc, 'alumni': alum_with_loc}

def get_user_filtered_country (db: Session, verbose:bool):

    countries = db.query(User.country).distinct().where(User.country.is_not(None), User.user_type != 'admin').all()

    if countries is None:
        raise HTTPException(status_code=404, detail="No locations found")
    country_list = [loc[0] for loc in countries]

    alum_with_loc = []
    stud_with_loc = []
    for loc in country_list:
        alum_loc = db.query(User.user_id, User.user_type).filter(User.country== loc, User.user_type=='alumni').all()
        stud_loc = db.query(User.user_id, User.user_type).filter(User.country == loc, User.user_type=='student').all()

        if alum_loc is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {loc}")

        if stud_loc is None:
            raise HTTPException(status_code=404, detail=f"No stud from this {loc}")
        
        # alum_loc_dict = {loc: [UserOut.model_validate(user) for user in alum_loc]}
        # stud_loc_dict = {loc: [UserOut.model_validate(user) for user in stud_loc]}
        
        if verbose:
            alum_loc_dict = {loc: [user[0] for user in alum_loc]}
            stud_loc_dict = {loc: [user[0] for user in stud_loc]}
        else:
            alum_loc_dict = {loc: len(alum_loc)}
            stud_loc_dict = {loc: len(stud_loc)}
        alum_with_loc.append(alum_loc_dict)
        stud_with_loc.append(stud_loc_dict)

    
    return {'students': stud_with_loc, 'alumni': alum_with_loc}


def get_user_all_batch (db: Session,verbose:bool):
    batches = db.query(func.split_part(User.student_number, '-', 1)).distinct().filter(User.student_number.is_not(None), User.user_type != 'admin').all()

    if batches is None:
        raise HTTPException(status_code=404, detail="No batches found")
    
    batches_formatted = [batch[0] for batch in batches]

    alum_batch_list = []
    stud_batch_list = []
    for batch in batches_formatted:
        alumni_batch = db.query(User.user_id).filter(User.student_number.like(f"{batch}-%"), User.user_type == 'alumni').all()
        student_batch = db.query(User.user_id).filter(User.student_number.like(f"{batch}-%"), User.user_type == 'student').all()

        if verbose:
            alum_batch_dict = {batch: [user[0] for user in alumni_batch]}
            stud_batch_dict = {batch: [user[0] for user in student_batch]}
        else:
            alum_batch_dict = {batch: len(alumni_batch)}
            stud_batch_dict = {batch: len(student_batch)}

        alum_batch_list.append(alum_batch_dict)
        stud_batch_list.append(stud_batch_dict)

    return {'alumni': alum_batch_list, 'students': stud_batch_list}

def get_user_filter_batch(db: Session, batch: str, type: str):
    user_batch =  db.query(User.user_id).filter(User.student_number.like(f"{batch}-%"), User.user_type == type).all()

    # return [UserOut.model_validate(user) for user in user_batch]
    return[user[0] for user in user_batch]


def get_user_grouped_industry(db: Session, verbose:bool):
    industries = db.query(User.industry).distinct().where(User.industry.is_not(None), User.user_type != 'admin').all()
    if industries is None:
            raise HTTPException(status_code=404, detail="No locations found")
    industry_list = [ind[0] for ind in industries]

    alum_with_ind = []

    for ind in industry_list:
        alum_ind = db.query(User.user_id, User.user_type).filter(User.industry== ind, User.user_type=='alumni').all()


        if alum_ind is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {ind}")
        
        # alum_ind_dict = {ind: [UserOut.model_validate(user) for user in alum_ind]}
        if verbose:
            alum_ind_dict = {ind: [user[0] for user in alum_ind]}
        else:
            alum_ind_dict = {ind: len(alum_ind)}

        alum_with_ind.append(alum_ind_dict)

    return alum_with_ind

def get_user_grouped_job_title(db: Session, verbose:bool):
    jobs = db.query(User.job_title).distinct().where(User.job_title.is_not(None), User.user_type != 'admin').all()
    if jobs is None:
            raise HTTPException(status_code=404, detail="No locations found")
    job_list = [ind[0] for ind in jobs]

    alum_with_job = []

    for job in job_list:
        alum_job = db.query(User.user_id, User.user_type).filter(User.job_title== job, User.user_type=='alumni').all()


        if alum_job is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {job}")
        
        # alum_job_dict = {job: [UserOut.model_validate(user) for user in alum_job]}
        if verbose:
            alum_job_dict = {job: [user[0] for user in alum_job]}
        else:
            alum_job_dict = {job: len(alum_job)}

        alum_with_job.append(alum_job_dict)

    return alum_with_job

def get_all_alumni(db: Session):

    one_year_ago = datetime.now() - timedelta(days=365)
    alumni = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        func.split_part(User.student_number, '-', 1).label("batch"),
        User.city,
        User.state,
        User.country,
        User.job_title,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_updated'), 
        case(
            (User.updated_at < one_year_ago, True),
            else_=False
        ).label('is_inactive')
    ).filter(
        User.user_type == 'alumni',
    ).all()

    if not alumni:
        raise HTTPException(status_code=404, detail="No alumni found")

    alums_dict = [row._asdict() for row in alumni]
    alum_list = []
    
    for alum in alums_dict:
        # select * from reports where user_id = alum[0];
        report_check = db.query(Report.report_id).filter(Report.reported_user_id == alum["user_id"]).all()

        check = True
        if len(report_check) == 0:
            check = False
        al = {
            "user_id": alum["user_id"],
            "name": f"{alum['first_name']} {alum['last_name']}",
            "batch": alum["batch"],
            "location_base": ", ".join(filter(None, [alum["city"], alum["state"], alum["country"]])),
            "job_title": alum["job_title"],
            "last_updated": alum["last_updated"],
            "is_reported":check,
            "is_inactive": alum["is_inactive"]
        }
        alum_list.append(al)

    return alum_list


def get_active_by_batch(db: Session, order: str):
    one_year_ago = datetime.now() - timedelta(days=365)
    result = (
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
    ).where(User.student_number.is_not(None))
    .group_by("batch")
    .order_by(desc(order))
    .all()
    )
    if not result:
        raise HTTPException(status_code=404, detail="No users found for this batch")

    # Convert each row to a dictionary
    result_dicts = [row._asdict() for row in result]

    results_analyzed = []
    for res in result_dicts:
        results_analyzed.append({
            "batch": res["batch"],
            "total_users": res["total_users"],
            "active_users":res["active_users"],
            "active_users_percentage": round((res["active_users"]/res["total_users"])*100,2),
            "inactive_users":res["inactive_users"],
            "inactive_users_percentage": round((res["inactive_users"]/res["total_users"])*100,2),
        })

    return results_analyzed

def get_batch_employment_status(db: Session, batch:str):

    total_alumni_sum = (
    db.query(
        func.count()
    )
    .where(
        User.user_type == 'alumni',
        User.employment_status.is_not(None),
        func.split_part(User.student_number, '-', 1) == batch
    )
    .scalar()  # Returns single value
    ) 

    employment = (
        db.query(
            User.employment_status.label("employment_status"),
            func.count().label("total_alumni")
        ).where(User.user_type == 'alumni', func.split_part(User.student_number, '-', 1)== batch).group_by(User.employment_status).all()
    )

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


def get_top_job_batch(db: Session, batch:str):
    total_employed= (
    db.query(
        func.count()
    )
    .where(
        User.user_type == 'alumni',
        User.job_title.is_not(None),
        func.split_part(User.student_number, '-', 1) == batch
    )
    .scalar()  
    ) 
    
    top_jobs = (
        db.query(
            User.job_title,
            func.count().label("job_count")
        )
        .filter(User.user_type == 'alumni', User.job_title.isnot(None), func.split_part(User.student_number, '-', 1)== batch)  
        .group_by(User.job_title)
        .order_by(func.count().desc())
        .limit(5)  
        .all()
    )

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


def get_top_industries_batch(db: Session, batch:str):
    total_employed= (
    db.query(
        func.count()
    )
    .where(
        User.user_type == 'alumni',
        User.industry.is_not(None),
        func.split_part(User.student_number, '-', 1) == batch
    )
    .scalar() 
    ) 
    
    top_industries = (
        db.query(
            User.industry,
            func.count().label("industry_count")
        )
        .filter(User.user_type == 'alumni', User.industry.isnot(None), func.split_part(User.student_number, '-', 1)== batch)  
        .group_by(User.industry)
        .order_by(func.count().desc())  
        .limit(5) 
        .all()
    )

    if not top_industries:
        raise HTTPException(status_code=404, detail="No top industries")

    top_industries_dict = [row._asdict() for row in top_industries]

    batch_top_industries = []

    for ind in top_industries_dict:
        batch_top_industries.append({
            "industry": ind["industry"],
            "count": ind["industry_count"],
            "percentage": round((ind["industry_count"]/total_employed)*100,2)
        })
    
    return batch_top_industries

def get_top_country_batch(db: Session, batch:str):
    total_in_country= (
    db.query(
        func.count()
    )
    .where(
        User.country.is_not(None),
        func.split_part(User.student_number, '-', 1) == batch
    )
    .scalar() 
    ) 
    
    top_countries = (
        db.query(
            User.country,
            func.count().label("count")
        )
        .filter(User.user_type == 'alumni', User.country.isnot(None), func.split_part(User.student_number, '-', 1)== batch)  
        .group_by(User.country)
        .order_by(func.count().desc())  
        .limit(5) 
        .all()
    )

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


def get_top_job_country(db: Session, country:str):
    total_employed= (
    db.query(
        func.count()
    )
    .where(
        User.user_type == 'alumni',
        User.job_title.is_not(None),
        User.country == country
    )
    .scalar()  
    ) 
    
    top_jobs = (
        db.query(
            User.job_title,
            func.count().label("job_count")
        )
        .filter(User.user_type == 'alumni', User.job_title.isnot(None), User.country == country)  
        .group_by(User.job_title)
        .order_by(func.count().desc())
        .limit(5)  
        .all()
    )

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


def get_top_industries_country(db: Session, country:str):
    total_employed= (
    db.query(
        func.count()
    )
    .where(
        User.user_type == 'alumni',
        User.industry.is_not(None),
        User.country == country
    )
    .scalar() 
    ) 
    
    top_industries = (
        db.query(
            User.industry,
            func.count().label("industry_count")
        )
        .filter(User.user_type == 'alumni', User.industry.isnot(None), User.country == country)  
        .group_by(User.industry)
        .order_by(func.count().desc())  
        .limit(5) 
        .all()
    )

    if not top_industries:
        raise HTTPException(status_code=404, detail="No top industries")

    top_industries_dict = [row._asdict() for row in top_industries]

    batch_top_industries = []

    for ind in top_industries_dict:
        batch_top_industries.append({
            "industry": ind["industry"],
            "count": ind["industry_count"],
            "percentage": round((ind["industry_count"]/total_employed)*100,2)
        })
    
    return batch_top_industries


def get_cities_country(db:Session, country:str):
    total_in_country= (
    db.query(
        func.count()
    )
    .where(
        User.user_type == 'alumni',
        User.city.is_not(None),
        User.country == country
    )
    .scalar() 
    )


    grouped_city= (
        db.query(User.city, func.count().label("count"))
        .filter(User.user_type == 'alumni', User.country == country, User.city.is_not(None))
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


def get_alumni_batch_filter(db: Session, batch: str, order_by:list[str]):

    one_year_ago = datetime.now() - timedelta(days=365)
    query = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        func.split_part(User.student_number, '-', 1).label("batch"),
        User.city,
        User.state,
        User.country,
        User.job_title,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_updated'), 
        case(
            (User.updated_at < one_year_ago, True),
            else_=False
        ).label('is_inactive')
    ).filter(
        User.user_type == 'alumni',
        func.split_part(User.student_number, '-', 1)== batch
    )

    if order_by:
        for order in order_by:
            order_parts = order.lower().split('_')
            order_field = order_parts[0]
            order_direction = order_parts[1] if len(order_parts) > 1 else 'asc'
            
            if order_field == 'name':
                # Order by last_name then first_name
                if order_direction == 'desc':
                    query = query.order_by(desc(User.last_name), desc(User.first_name))
                else:
                    query = query.order_by(asc(User.last_name), asc(User.first_name))
            elif order_field == 'batch':
                order_column = func.split_part(User.student_number, '-', 1)

            elif order_field == 'last_updated':
                order_column = User.updated_at
            else:
                continue  # skip invalid fields
            
            # Apply ordering for non-name fields
            if order_field != 'name':
                if order_direction == 'desc':
                    query = query.order_by(desc(order_column))
                else:
                    query = query.order_by(asc(order_column))
    else:
        # Default ordering if none specified
        query = query.order_by(asc(User.last_name), asc(User.first_name))
    
    alumni = query.all()

    if not alumni:
        raise HTTPException(status_code=404, detail="No alumni found")

    alums_dict = [row._asdict() for row in alumni]
    alum_list = []
    
    for alum in alums_dict:
        # select * from reports where user_id = alum[0];
        report_check = db.query(Report.report_id).filter(Report.reported_user_id == alum["user_id"]).all()

        check = True
        if len(report_check) == 0:
            check = False
        al = {
            "user_id": alum["user_id"],
            "name": f"{alum['first_name']} {alum['last_name']}",
            "batch": alum["batch"],
            "location_base": ", ".join(filter(None, [alum["city"], alum["state"], alum["country"]])),
            "job_title": alum["job_title"],
            "last_updated": alum["last_updated"],
            "is_reported":check,
            "is_inactive": alum["is_inactive"]
        }
        alum_list.append(al)

    return alum_list


def get_alumni_industry_filter(db: Session, industry: str, order_by:list[str]):

    one_year_ago = datetime.now() - timedelta(days=365)
    query = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        func.split_part(User.student_number, '-', 1).label("batch"),
        User.city,
        User.state,
        User.country,
        User.job_title,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_updated'), 
        case(
            (User.updated_at < one_year_ago, True),
            else_=False
        ).label('is_inactive')
    ).filter(
        User.user_type == 'alumni',
        User.industry == industry
    )

    if order_by:
        for order in order_by:
            order_parts = order.lower().split('_')
            order_field = order_parts[0]
            order_direction = order_parts[1] if len(order_parts) > 1 else 'asc'
            
            if order_field == 'name':
                # Order by last_name then first_name
                if order_direction == 'desc':
                    query = query.order_by(desc(User.last_name), desc(User.first_name))
                else:
                    query = query.order_by(asc(User.last_name), asc(User.first_name))
            elif order_field == 'batch':
                order_column = func.split_part(User.student_number, '-', 1)

            elif order_field == 'last_updated':
                order_column = User.updated_at
            else:
                continue  # skip invalid fields
            
            # Apply ordering for non-name fields
            if order_field != 'name':
                if order_direction == 'desc':
                    query = query.order_by(desc(order_column))
                else:
                    query = query.order_by(asc(order_column))
    else:
        # Default ordering if none specified
        query = query.order_by(asc(User.last_name), asc(User.first_name))
    
    alumni = query.all()

    if not alumni:
        raise HTTPException(status_code=404, detail="No alumni found")

    alums_dict = [row._asdict() for row in alumni]
    alum_list = []
    
    for alum in alums_dict:
        # select * from reports where user_id = alum[0];
        report_check = db.query(Report.report_id).filter(Report.reported_user_id == alum["user_id"]).all()

        check = True
        if len(report_check) == 0:
            check = False
        al = {
            "user_id": alum["user_id"],
            "name": f"{alum['first_name']} {alum['last_name']}",
            "batch": alum["batch"],
            "location_base": ", ".join(filter(None, [alum["city"], alum["state"], alum["country"]])),
            "job_title": alum["job_title"],
            "last_updated": alum["last_updated"],
            "is_reported":check,
            "is_inactive": alum["is_inactive"]
        }
        alum_list.append(al)

    return alum_list  

def get_alumni_country_filter(db: Session, country: str, order_by:list[str]):

    one_year_ago = datetime.now() - timedelta(days=365)
    
    query = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        func.split_part(User.student_number, '-', 1).label("batch"),
        User.city,
        User.state,
        User.country,
        User.job_title,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_updated'), 
        case(
            (User.updated_at < one_year_ago, True),
            else_=False
        ).label('is_inactive')
    ).filter(
        User.user_type == 'alumni',
        User.country == country
    )
    
    if order_by:
        for order in order_by:
            order_parts = order.lower().split('_')
            order_field = order_parts[0]
            order_direction = order_parts[1] if len(order_parts) > 1 else 'asc'
            
            if order_field == 'name':
                # Order by last_name then first_name
                if order_direction == 'desc':
                    query = query.order_by(desc(User.last_name), desc(User.first_name))
                else:
                    query = query.order_by(asc(User.last_name), asc(User.first_name))
            elif order_field == 'batch':
                order_column = func.split_part(User.student_number, '-', 1)

            elif order_field == 'last_updated':
                order_column = User.updated_at
            else:
                continue  # skip invalid fields
            
            # Apply ordering for non-name fields
            if order_field != 'name':
                if order_direction == 'desc':
                    query = query.order_by(desc(order_column))
                else:
                    query = query.order_by(asc(order_column))
    else:
        # Default ordering if none specified
        query = query.order_by(asc(User.last_name), asc(User.first_name))
    
    alumni = query.all()

    if not alumni:
        raise HTTPException(status_code=404, detail="No alumni found")

    alums_dict = [row._asdict() for row in alumni]
    alum_list = []
    
    for alum in alums_dict:
        # select * from reports where user_id = alum[0];
        report_check = db.query(Report.report_id).filter(Report.reported_user_id == alum["user_id"]).all()

        check = True
        if len(report_check) == 0:
            check = False
        al = {
            "user_id": alum["user_id"],
            "name": f"{alum['first_name']} {alum['last_name']}",
            "batch": alum["batch"],
            "location_base": ", ".join(filter(None, [alum["city"], alum["state"], alum["country"]])),
            "job_title": alum["job_title"],
            "last_updated": alum["last_updated"],
            "is_reported":check,
            "is_inactive": alum["is_inactive"]
        }
        alum_list.append(al)

    return alum_list

def get_alumni_filter(
    db: Session, 
    name: Optional[str] = None, 
    graduation_year: Optional[int] = None,
    job_title: Optional[str] = None,
    city: Optional[str] = None,
    skill: Optional[str] = None,
    industry: Optional[str] = None,
    batch: Optional[str] = None,
    affiliation: Optional[str] = None,
    order_by: Optional[List[str]] = None
) -> List[Dict]:
    one_year_ago = datetime.now() - timedelta(days=365)
    
    # Base query
    query = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        func.split_part(User.student_number, '-', 1).label("batch"),
        User.city,
        User.state,
        User.country,
        User.job_title,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_updated'), 
        case(
            (User.updated_at < one_year_ago, True),
            else_=False
        ).label('is_inactive')
    ).filter(
        User.user_type == 'alumni'
    )

    if name:
        query = query.filter(or_(User.first_name.ilike(f"%{name}%"), User.last_name.ilike(f"%{name}%")))

    if graduation_year:
        query = query.filter(User.graduation_year == graduation_year)
    
    if job_title:
        # Split the job title string by comma and strip whitespace
        job_title_list = [j.strip() for j in job_title.split(',') if j.strip()]

        if job_title_list:
            if len(job_title_list) > 1:
                subquery = db.query(User.user_id).filter(User.job_title.ilike(f"%{job_title_list[0]}%")).subquery()
                
                for j in job_title_list[1:]:
                    job_title_subquery = db.query(User.user_id).filter(User.job_title.ilike(f"%{j}%")).subquery()
                    
                    subquery = db.query(subquery.c.user_id).filter(subquery.c.user_id.in_(db.query(job_title_subquery.c.user_id))).subquery()
                
                query = query.filter(User.user_id.in_(db.query(subquery.c.user_id)))
            else:
                query = query.filter(User.job_title.ilike(f"%{job_title_list[0]}%"))
    
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))
    
    if skill:
        # Split the skills string by comma and strip whitespace
        skills_list = [s.strip() for s in skill.split(',') if s.strip()]
        
        if skills_list:
            if len(skills_list) > 1: # If multiple skills were inputted
                subquery = db.query(UserSkill.user_id).filter(UserSkill.skill.ilike(f"%{skills_list[0]}%")).subquery()
                
                # For each additional skill, filter the users further
                for s in skills_list[1:]:
                    skill_subquery = db.query(UserSkill.user_id).filter(UserSkill.skill.ilike(f"%{s}%")).subquery()
                    
                    subquery = db.query(subquery.c.user_id).filter(subquery.c.user_id.in_(db.query(skill_subquery.c.user_id))).subquery()
                
                # Finally, filter the main query to include only users with all skills
                query = query.filter(User.user_id.in_(db.query(subquery.c.user_id)))
            else: # If only one skill was inputted
                query = query.join(UserSkill, User.user_id == UserSkill.user_id).filter(UserSkill.skill.ilike(f"%{skills_list[0]}%"))


    if industry:
        query = query.filter(User.industry.ilike(f"%{industry}%"))

    if batch:
        # Match the first 4 characters of the student number in the db to the batch input
        query = query.filter(User.student_number.startswith(batch))
    
    if affiliation:
        # Affiliation is a separate table so we need to join it
        #
        # There can also be multiple affiliations so we need to filter for each one
        affiliation_list = [a.strip() for a in affiliation.split(',') if a.strip()]

        if affiliation_list:
            subquery = db.query(User.user_id).join(User.affiliations).filter(UserAffiliation.affiliation.ilike(f"%{affiliation_list[0]}%")).subquery()
            
            for a in affiliation_list[1:]:
                affiliation_subquery = db.query(User.user_id).join(User.affiliations).filter(UserAffiliation.affiliation.ilike(f"%{a}%")).subquery()
                
                subquery = db.query(subquery.c.user_id).filter(subquery.c.user_id.in_(db.query(affiliation_subquery.c.user_id))).subquery()
            
            query = query.filter(User.user_id.in_(db.query(subquery.c.user_id)))
    

    if order_by:
        for order in order_by:
            order_parts = order.lower().split('_')
            order_field = order_parts[0]
            order_direction = order_parts[1] if len(order_parts) > 1 else 'asc'
            
            if order_field == 'name':
                # Order by last_name then first_name
                if order_direction == 'desc':
                    query = query.order_by(desc(User.last_name), desc(User.first_name))
                else:
                    query = query.order_by(asc(User.last_name), asc(User.first_name))
            elif order_field == 'batch':
                order_column = func.split_part(User.student_number, '-', 1)
            elif order_field == 'city':
                order_column = User.city
            elif order_field == 'job_title':
                order_column = User.job_title
            elif order_field == 'last_updated':
                order_column = User.updated_at
            else:
                continue  # skip invalid fields
            
            # Apply ordering for non-name fields
            if order_field != 'name':
                if order_direction == 'desc':
                    query = query.order_by(desc(order_column))
                else:
                    query = query.order_by(asc(order_column))
    else:
        # Default ordering if none specified
        query = query.order_by(asc(User.last_name), asc(User.first_name))

    alumni = query.all()

    if not alumni:
        raise HTTPException(status_code=404, detail="No alumni found")

    alums_dict = [row._asdict() for row in alumni]
    alum_list = []
    
    for alum in alums_dict:
        # select * from reports where user_id = alum[0];
        report_check = db.query(Report.report_id).filter(Report.reported_user_id == alum["user_id"]).all()

        check = True
        if len(report_check) == 0:
            check = False
        al = {
            "user_id": alum["user_id"],
            "name": f"{alum['first_name']} {alum['last_name']}",
            "batch": alum["batch"],
            "location_base": ", ".join(filter(None, [alum["city"], alum["state"], alum["country"]])),
            "job_title": alum["job_title"],
            "last_updated": alum["last_updated"],
            "is_reported":check,
            "is_inactive": alum["is_inactive"]
        }
        alum_list.append(al)

    return alum_list



    
