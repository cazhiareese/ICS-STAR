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

        # Retrieve affiliations for specific user (if possible)
        user_affiliations = db.query(UserAffiliation).filter(UserAffiliation.user_id == user.user_id).all()
        affiliations_list = [affiliation.affiliation for affiliation in user_affiliations]
        
        alumni_entry = {
            "user_id": str(user.user_id),
            "full_name": f"{user.first_name} {user.last_name}",
            "batch": user.student_number[:4],
            "graduation_year": user.graduation_year,
            "job_title": user.job_title,
            "industry": user.industry,
            "skills": skills_list if skills_list else None,
            "location": user.city,
            "email": user.email,
            "picture": user.image,
            "affiliations": affiliations_list if affiliations_list else None,
            "facebook": user.facebook,
            "linkedin": user.linkedin,
            "github": user.github,
        }
        alumni_list.append(alumni_entry)
    
    return alumni_list