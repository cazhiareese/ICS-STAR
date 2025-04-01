
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.usermodel import User
from models.report_model import Report
from sqlalchemy import func, case, text, desc
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
    alumni = db.query(
        User.user_id, User.first_name, User.last_name, 
        User.student_number, User.city, User.state, User.country, 
        User.job_title, User.updated_at
    ).filter(User.user_type == 'alumni').all()

    if not alumni:
        raise HTTPException(status_code=404, detail="No alumni found")

    alum_list = []
    for alum in alumni:
        # select * from reports where user_id = alum[0];
        report_check = db.query(Report.report_id).filter(Report.reported_user_id == alum[0]).all()

        check = True
        if len(report_check) == 0:
            check = False
        al = {
            "user_id": alum[0],
            "name": f"{alum[1]} {alum[2]}",
            "batch": alum[3].split("-")[0] if alum[3] else None,
            "location_base": ", ".join(filter(None, [alum[4], alum[5], alum[6]])),
            "job_title": alum[7],
            "updated_at": alum[8],
            "is_reported":check
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
        .filter(User.job_title.isnot(None), func.split_part(User.student_number, '-', 1)== batch)  
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
        .filter(User.industry.isnot(None), func.split_part(User.student_number, '-', 1)== batch)  
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
        .filter(User.country.isnot(None), func.split_part(User.student_number, '-', 1)== batch)  
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


        
        






