from typing import Dict, List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from util.alumni_search_logic import logic_search_alumni
from models.usermodel import User, UserAffiliation, UserSkill, UserTypeEnum
from models.report_model import Report
from sqlalchemy import func, case, or_, text, desc,asc
from datetime import datetime, timedelta

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