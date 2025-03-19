from sqlalchemy import Column, String, UUID, Boolean, Integer, ForeignKey, Enum
from config import config

class User(config.Base):
    __tablename__ = 'users'
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    mobile_number = Column(String(15), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(Enum('M', 'F'), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    country = Column(String(50), nullable=False)
    marital_status = Column(String(20))
    image = Column(String(255))
    password = Column(String(255), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    verification_file = Column(String(255))
    user_type = Column(Enum('admin', 'student', 'alumni'), nullable=False)
    position = Column(String(50))
    is_banned = Column(Boolean)
    student_number = Column(String(15), unique=True)
    standing = Column(String(50))
    graduation_year = Column(Integer)
    graduation_semester = Column(String(20))
    employment_status = Column(String(50))
    job_title = Column(String(100))
    work_location = Column(String(100))
    work_mode = Column(String(50))
    employer_class = Column(String(50))
    tenured_status = Column(String(10))
    salary_grade = Column(String(10))

class UserSkill(config.Base):
    __tablename__ = 'user_skill'
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True)
    skill = Column(String(100), nullable=False)

class UserScholarship(config.Base):
    __tablename__ = 'user_scholarship'
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True)
    scholarship = Column(String(100), nullable=False)

class UserAffiliation(config.Base):
    __tablename__ = 'user_affiliation'
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True)
    affiliation = Column(String(100), nullable=False)