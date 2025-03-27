from sqlalchemy import or_
from sqlalchemy.orm import Session
from models.usermodel import User, UserTypeEnum 
from config import config
from config.database import get_db
from typing import Optional, List, Dict

def logic_search_alumni(
    db: Session, 
    name: Optional[str] = None, 
    graduation_year: Optional[int] = None,
    job_title: Optional[str] = None,
    work_location: Optional[str] = None
) -> List[Dict]:

    # Base query filtered to only include alumni
    query = db.query(User).filter(User.user_type == UserTypeEnum.alumni)
    
    # Name search (case-insensitive, matches first or last name)
    if name:
        query = query.filter(or_(User.first_name.ilike(f"%{name}%"), User.last_name.ilike(f"%{name}%")))
    
    # Additional optional filters
    if graduation_year:
        query = query.filter(User.graduation_year == graduation_year)
    
    if job_title:
        query = query.filter(User.job_title.ilike(f"%{job_title}%"))
    
    if work_location:
        query = query.filter(User.work_location.ilike(f"%{work_location}%"))
    
    # Execute query and transform results
    results = query.all()
    
    # If no results, return empty list
    if not results:
        return []
    
    # Map results to dictionary for easy serialization
    alumni_list = [
        {
            "user_id": str(user.user_id),
            "full_name": f"{user.first_name} {user.last_name}",
            "graduation_year": user.graduation_year,
            "job_title": user.job_title,
            "work_location": user.work_location,
            "email": user.email
        } 
        for user in results
    ]
    
    return alumni_list