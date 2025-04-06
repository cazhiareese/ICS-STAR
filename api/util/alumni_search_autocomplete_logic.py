from sqlalchemy import or_, distinct, func, desc
from sqlalchemy.orm import Session
from models.usermodel import User, UserTypeEnum, UserSkill 
from config import config
from config.database import get_db
from typing import List

# Get suggestions for job titles based on partial input in the text field
# 
# Arguments:
# db: Session - database session
# query_text: str - partial input in the text field
# limit: int - maximum number of suggestions to return
#
# Returns: a list of job title suggestions
def get_job_title_suggestions(db: Session, query_text: str, limit: int = 4) -> List[str]:
    # Only fetch from alumni users for consistency
    results = db.query(distinct(User.job_title))\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.job_title.ilike(f"%{query_text}%"))\
                .filter(User.job_title.isnot(None))\
                .order_by(User.job_title)\
                .limit(limit)\
                .all()
    
    # The return should be strings only since we just want to show the titles
    return [result[0] for result in results]

# Get suggestions for skills based on partial input in the text field
#
# Arguments:
# db: Session - database session
# query_text: str - partial input in the text field
# limit: int - maximum number of suggestions to return
#
# Returns: a list of skill suggestions
def get_skill_suggestions(db: Session, query_text: str, limit: int = 5) -> List[str]:
    # Join with User table to only fetch skills from alumni
    results = db.query(distinct(UserSkill.skill))\
                .join(User, User.user_id == UserSkill.user_id)\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(UserSkill.skill.ilike(f"%{query_text}%"))\
                .order_by(UserSkill.skill)\
                .limit(limit)\
                .all()
    
    return [result[0] for result in results]

# Get suggestions for alumni users based on partial input in the text field
#
# Arguments:
# db: Session - database session
# query_text: str - partial input in the text field
# limit: int - maximum number of suggestions to return
# 
# Returns: a list of full name suggestions
def get_name_suggestions(db: Session, query_text: str, limit: int = 8) -> List[str]:
    # Query for users with matching first or last name
    users = db.query(User)\
              .filter(User.user_type == UserTypeEnum.alumni)\
              .filter(
                or_(
                    User.first_name.ilike(f"%{query_text}%"),
                    User.last_name.ilike(f"%{query_text}%")
                )
              )\
              .order_by(User.first_name, User.last_name)\
              .limit(limit)\
              .all()
    
    # Return full names
    return [f"{user.first_name} {user.last_name}" for user in users]

# Get suggestions for industries based on partial input in the text field
# 
# Arguments:
# db: Session - database session
# query_text: str - partial input in the text field
# limit: int - maximum number of suggestions to return
# 
# Returns: a list of industry suggestions
def get_industry_suggestions(db: Session, query_text: str, limit: int = 4) -> List[str]:
    results = db.query(distinct(User.industry))\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.industry.ilike(f"%{query_text}%"))\
                .filter(User.industry.isnot(None))\
                .order_by(User.industry)\
                .limit(limit)\
                .all()
    

    return [result[0] for result in results]

# Get suggestions for cities based on partial input in the text field
#
# Arguments:
# db: Session - database session
# query_text: str - partial input in the text field
# limit: int - maximum number of suggestions to return
#
# Returns: a list of city suggestions
def get_city_suggestions(db: Session, query_text: str, limit: int = 4) -> List[str]:
    results = db.query(distinct(User.city))\
                .filter(User.user_type == UserTypeEnum.alumni)\
                .filter(User.city.ilike(f"%{query_text}%"))\
                .filter(User.city.isnot(None))\
                .order_by(User.city)\
                .limit(limit)\
                .all()

    return [result[0] for result in results]

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