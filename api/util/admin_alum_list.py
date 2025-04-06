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
        User.is_verified == True,
        User.user_type == 'alumni',
    ).all()

    count_alumni = (
        db.query(
            func.count()
        ).where(
            User.is_verified == True,
            User.user_type == 'alumni',
        ).scalar()
    )

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

    return {"list": alum_list, "count": count_alumni}


def get_alumni_list_filter(db: Session, batch: Optional[str] = None, industry: Optional[str] = None, country: Optional[str] = None, order_by:list[str] = None):

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
        User.is_verified == True,
        User.user_type == 'alumni',
    )

    if batch:
        query = query.filter(
        func.split_part(User.student_number, '-', 1)== batch
    )

    if industry:
        query = query.filter(
        User.industry == industry
    )

    if country:
        query = query.filter(
        User.country == country
    )

    if order_by:
        for order in order_by:
            order_parts = order.lower().split('_') 

            order_field = '_'.join(order_parts[:-1]) if len(order_parts) > 1 else order_parts[0]
            order_direction = order_parts[-1] if len(order_parts) > 1 else 'asc'
           
            print(order_field)
            print(order_direction)


            if order_field == 'name':
                print("here_name")
                # Order by last_name then first_name
                if order_direction == 'desc':
                    query = query.order_by(desc(User.last_name), desc(User.first_name))
                else:
                    query = query.order_by(asc(User.last_name), asc(User.first_name))
            elif order_field == 'batch':
                print("here_batch")
                order_column = func.split_part(User.student_number, '-', 1)

            elif order_field == 'updated':

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
    order_by: Optional[List[str]] = None,
    needs_verified: Optional[bool] = False,
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
        ).label('is_inactive'),
        User.email,
        User.student_number,
        User.graduation_year,
        User.graduation_semester,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg')
    )
    
    if not needs_verified:
        query = query.filter(
        User.is_verified == False,
        User.user_type == 'alumni'
        )
    else:
        query = query.filter(
        User.is_verified == True,
        User.user_type == 'alumni'
        )

    

        # Append appropriate filters to the initial query
    if name:
        # We have to also catch if full name was inputted (e.g. "John Doe" or "John Michael Doe")
        #
        # Split the name by space and filter for each part
        name_parts = name.split()
        if len(name_parts) == 1:
            query = query.filter(or_(User.first_name.ilike(f"%{name_parts[0]}%"), User.last_name.ilike(f"%{name_parts[0]}%")))
        else:
            # Filter for first name and last name separately
            query = query.filter(or_(User.first_name.ilike(f"%{name_parts[0]}%"), User.last_name.ilike(f"%{name_parts[-1]}%")))

    if graduation_year:
        query = query.filter(User.graduation_year == graduation_year)
    
    if job_title:
        # Split the job title string by comma and strip whitespace
        #
        # Then, we find all users with job titles that match any of the inputted titles
        job_titles_list = [j.strip() for j in job_title.split(',') if j.strip()]

        if job_titles_list:
            # Create an OR condition for each job title
            query = query.filter(or_(*[User.job_title.ilike(f"%{j}%") for j in job_titles_list]))
        
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))
    
    if skill:
        # Split the skills string by comma and strip whitespace
        skills_list = [s.strip() for s in skill.split(',') if s.strip()]
        
        if skills_list:
            # Create an OR condition for each skill
            skill_subquery = db.query(UserSkill.user_id).filter(or_(*[UserSkill.skill.ilike(f"%{s}%") for s in skills_list])).distinct().subquery()
            
            # Filter main query to users who have any of the skills
            query = query.filter(User.user_id.in_(db.query(skill_subquery.c.user_id)))

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
            affiliation_subquery = db.query(UserAffiliation.user_id).filter(or_(*[UserAffiliation.affiliation.ilike(f"%{a}%") for a in affiliation_list])).distinct().subquery()

            query = query.filter(User.user_id.in_(db.query(affiliation_subquery.c.user_id)))

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
            elif order_field == 'job':
                order_column = User.job_title
            elif order_field == 'updated':
                order_column = User.updated_at
            elif order_field == 'regisdate':
                order_column = User.created_at
            else:
                continue  # skip invalid fields
            
            # Apply ordering for non-name fields
            if order_field != 'name':
                if order_direction == 'desc':
                    query = query.order_by(desc(order_column))
                else:
                    query = query.order_by(asc(order_column))
    else:
        if not needs_verified:
            query = query.order_by(desc(User.created_at))
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

        if needs_verified:
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
        else:
            al = {
                 "user_id": alum["user_id"],
                "name": f"{alum['first_name']} {alum['last_name']}",
                "email": alum["email"],
                "student_number": alum["student_number"],
                "grad_class": f"{alum['graduation_year']} - {alum['graduation_semester']}",
                "date_of_reg": alum["date_of_reg"],
            }
        alum_list.append(al)

    return alum_list


def get_student_filter(
    db: Session, 
    name: Optional[str] = None, 
    standing: Optional[str] = None,
    batch: Optional[str] = None,
    affiliation: Optional[str] = None,
    order_by: Optional[List[str]] = None,
    needs_verified: Optional[bool] = False,
) -> List[Dict]:
    one_year_ago = datetime.now() - timedelta(days=365)
    
    # Base query
    query = db.query(
        User.user_id,
        User.first_name, 
        User.last_name,
        func.split_part(User.student_number, '-', 1).label("batch"),
        User.standing,
        func.to_char(User.updated_at, 'MM/DD/YYYY').label('last_updated'), 
        case(
            (User.updated_at < one_year_ago, True),
            else_=False
        ).label('is_inactive'),
        User.email,
        User.student_number,
        User.graduation_year,
        User.graduation_semester,
        func.to_char(User.created_at, 'MM/DD/YYYY').label('date_of_reg')
    ).filter(
         User.user_type == 'student'
    )
    
    if not needs_verified:
        query = query.filter(
            User.is_verified == False,
           
        )
    else:
        query = query.filter(
            User.is_verified == True,
        )

    # Append appropriate filters to the initial query
    if name:
        name_parts = name.split()
        if len(name_parts) == 1:
            query = query.filter(or_(User.first_name.ilike(f"%{name_parts[0]}%"), User.last_name.ilike(f"%{name_parts[0]}%")))
        else:
            query = query.filter(or_(User.first_name.ilike(f"%{name_parts[0]}%"), User.last_name.ilike(f"%{name_parts[-1]}%")))

    if standing:
        query = query.filter(User.standing == standing)

    if batch:
        query = query.filter(User.student_number.startswith(batch))
    
    if affiliation:
        affiliation_list = [a.strip() for a in affiliation.split(',') if a.strip()]
        if affiliation_list:
            affiliation_subquery = db.query(UserAffiliation.user_id).filter(or_(*[UserAffiliation.affiliation.ilike(f"%{a}%") for a in affiliation_list])).distinct().subquery()
            query = query.filter(User.user_id.in_(db.query(affiliation_subquery.c.user_id)))

    if order_by:
        for order in order_by:
            order_parts = order.lower().split('_')
            order_field = order_parts[0]
            order_direction = order_parts[1] if len(order_parts) > 1 else 'asc'
            if order_field == 'name':
                if order_direction == 'desc':
                    query = query.order_by(desc(User.last_name), desc(User.first_name))
                else:
                    query = query.order_by(asc(User.last_name), asc(User.first_name))
            elif order_field == 'batch':
                order_column = func.split_part(User.student_number, '-', 1)
            elif order_field == 'updated':
                order_column = User.updated_at
            elif order_field == 'regisdate':
                order_column = User.created_at
            else:
                continue
            
            if order_field != 'name':
                if order_direction == 'desc':
                    query = query.order_by(desc(order_column))
                else:
                    query = query.order_by(asc(order_column))
    else:
        if not needs_verified:
            query = query.order_by(desc(User.created_at))
        else:
        # Default ordering if none specified
            query = query.order_by(asc(User.last_name), asc(User.first_name))


    students = query.all()

    if not students:
        raise HTTPException(status_code=404, detail="No students found")

    students_dict = [row._asdict() for row in students]
    student_list = []
    
    for student in students_dict:
        report_check = db.query(Report.report_id).filter(Report.reported_user_id == student["user_id"]).all()
        check = len(report_check) > 0

        if needs_verified:
            student_data = {
                "user_id": student["user_id"],
                "name": f"{student['first_name']} {student['last_name']}",
                "batch": student["batch"],
                "standing": student["standing"],
                "last_updated": student["last_updated"],
                "is_reported": check,
                "is_inactive": student["is_inactive"]
            }
        else:
            student_data = {
                "user_id": student["user_id"],
                "name": f"{student['first_name']} {student['last_name']}",
                "email": student["email"],
                "student_number": student["student_number"],
                "standing": student["standing"],
                "date_of_reg": student["date_of_reg"],
            }
        student_list.append(student_data)

    return student_list