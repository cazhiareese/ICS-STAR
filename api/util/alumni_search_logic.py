from sqlalchemy import or_
from sqlalchemy.orm import Session
from models.usermodel import User, UserTypeEnum, UserSkill, UserAffiliation
from config import config
from config.database import get_db
from typing import Optional, List, Dict

# Search for alumni with optional filters
#
# Arguments: 
# db: Session - database session
# name: Optional[str] - name of alumni
# graduation_year: Optional[int] - graduation year of alumni
# job_title: Optional[str] - job title of alumni
# city: Optional[str] - city of alumni
# skill: Optional[str] - skill of alumni
#
# Returns: a list of dictionaries containing alumni information
def logic_search_alumni(
    db: Session, 
    name: Optional[str] = None, 
    graduation_year: Optional[int] = None,
    job_title: Optional[str] = None,
    city: Optional[str] = None,
    skill: Optional[str] = None,
    industry: Optional[str] = None,
    batch: Optional[str] = None,
    affiliation: Optional[str] = None
) -> List[Dict]:
    # Initial query which will get all alumni users
    query = db.query(User).filter(User.user_type == UserTypeEnum.alumni)

    # Append appropriate filters to the initial query
    if name:
        query = query.filter(or_(User.first_name.ilike(f"%{name}%"), User.last_name.ilike(f"%{name}%")))

    if graduation_year:
        query = query.filter(User.graduation_year == graduation_year)
    
    if job_title:
        query = query.filter(User.job_title.ilike(f"%{job_title}%"))
    
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

    # Execute the final query
    results = query.all()
    
    # If no results, return empty list to flag 404
    if not results:
        return []
    
    alumni_list = []
    for user in results:
        # Retrieve skills for specific user (if possible)
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.user_id).all()
        skills_list = [skill.skill for skill in user_skills]
        
        alumni_entry = {
            "user_id": str(user.user_id),
            "full_name": f"{user.first_name} {user.last_name}",
            "batch": user.student_number[:4],
            "graduation_year": user.graduation_year,
            "job_title": user.job_title,
            "industry": user.industry,
            "skills": skills_list,
            "location": user.city,
            "email": user.email,
            "picture": user.image,
            "affiliations": [affiliation.affiliation for affiliation in user.affiliations]
        }
        alumni_list.append(alumni_entry)
    
    return alumni_list