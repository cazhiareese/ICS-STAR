from sqlalchemy import or_
from sqlalchemy.orm import Session
from models.usermodel import User, UserTypeEnum, UserSkill 
from config import config
from config.database import get_db
from typing import Optional, List, Dict

def logic_search_alumni(
    db: Session, 
    name: Optional[str] = None, 
    graduation_year: Optional[int] = None,
    job_title: Optional[str] = None,
    city: Optional[str] = None,
    skill: Optional[str] = None
) -> List[Dict]:
    # Start with base query for alumni
    query = db.query(User).filter(User.user_type == UserTypeEnum.alumni)

    # If name is provided, add name filtering
    if name:
        query = query.filter(or_(User.first_name.ilike(f"%{name}%"), User.last_name.ilike(f"%{name}%")))

    # Optional filters
    if graduation_year:
        query = query.filter(User.graduation_year == graduation_year)
    
    if job_title:
        query = query.filter(User.job_title.ilike(f"%{job_title}%"))
    
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))
    
    if skill:
        query = query.join(UserSkill, User.user_id == UserSkill.user_id).filter(UserSkill.skill.ilike(f"%{skill}%"))

    # Execute query
    results = query.all()
    
    # If no results, return empty list
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
            "graduation_year": user.graduation_year,
            "job_title": user.job_title,
            "skills": skills_list,
            "location": user.city,
            "email": user.email
        }
        alumni_list.append(alumni_entry)
    
    return alumni_list