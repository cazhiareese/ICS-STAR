from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from models.usermodel import User, UserTypeEnum, UserSkill 
from config import config
from config.database import get_db
from typing import List

# Get Top 4 job titles by counting occurrences of each distinct job title
def get_top_job_titles(db: Session) -> List[str]:
    results = db.query(User.job_title, func.count(User.job_title).label('count'))\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.job_title.isnot(None))\
                .group_by(User.job_title)\
                .order_by(desc('count'))\
                .limit(4)\
                .all()
    
    return [result[0] for result in results]

# Get Top 4 skills by counting occurrences
def get_top_skills(db: Session) -> List[str]:
    results = db.query(UserSkill.skill, func.count(UserSkill.skill).label('count'))\
                .join(User, User.user_id == UserSkill.user_id)\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(UserSkill.skill.isnot(None))\
                .group_by(UserSkill.skill)\
                .order_by(desc('count'))\
                .limit(4)\
                .all()
    
    return [result[0] for result in results]

# Get Top 4 industries by counting occurrences
def get_top_industries(db: Session) -> List[str]:
    results = db.query(User.industry, func.count(User.industry).label('count'))\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.industry.isnot(None))\
                .group_by(User.industry)\
                .order_by(desc('count'))\
                .limit(4)\
                .all()
    
    return [result[0] for result in results]

# Get Top 4 cities by counting occurrences
def get_top_cities(db: Session) -> List[str]:
    results = db.query(User.city, func.count(User.city).label('count'))\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.city.isnot(None))\
                .group_by(User.city)\
                .order_by(desc('count'))\
                .limit(4)\
                .all()
    
    return [result[0] for result in results]

# Get all job titles
def get_all_job_titles(db: Session) -> List[str]:
    results = db.query(User.job_title)\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.job_title.isnot(None))\
                .distinct()\
                .order_by(User.job_title)\
                .all()
    
    return [result[0] for result in results]

# Get all skills
def get_all_skills(db: Session) -> List[str]:
    results = db.query(UserSkill.skill)\
                .join(User, User.user_id == UserSkill.user_id)\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(UserSkill.skill.isnot(None))\
                .distinct()\
                .order_by(UserSkill.skill)\
                .all()
    
    return [result[0] for result in results]

# Get all industries
def get_all_industries(db: Session) -> List[str]:
    results = db.query(User.industry)\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.industry.isnot(None))\
                .distinct()\
                .order_by(User.industry)\
                .all()
    
    return [result[0] for result in results]

# Get all cities
def get_all_cities(db: Session) -> List[str]:
    results = db.query(User.city)\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.city.isnot(None))\
                .distinct()\
                .order_by(User.city)\
                .all()
    
    return [result[0] for result in results]