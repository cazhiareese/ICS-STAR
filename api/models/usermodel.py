from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from config.config import Base

class User(Base):
    __tablename__ = "user"

    userid = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    mobile = Column(String, unique=True, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    last_login = Column(String, nullable=True)
    marital_status = Column(String, nullable=False)
    image = Column(Text, nullable=True)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False) # Alum and student
    verification_file = Column(Text, nullable=True)
    user_type = Column(String, nullable=False) 
    position = Column(String, nullable=True) # Admin
    is_banned = Column(Boolean, default=False) # Alum and student
    student_number = Column(String, nullable=True) # Alum and student
    standing = Column(String, nullable=True) # Student
    # Alum
    graduation_year = Column(Integer, nullable=True)
    graduation_semester = Column(String, nullable=True) 
    employment_status = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    work_location = Column(String, nullable=True)
    work_mode = Column(String, nullable=True)
    employer_class = Column(String, nullable=True)
    tenured_status = Column(String, nullable=True)
    salary_grade = Column(String, nullable=True)
    # Multivalued
    skills = relationship("UserSkill", back_populates="user")
    scholarships = relationship("UserScholarship", back_populates="user")
    affiliations = relationship("UserAffiliation", back_populates="user")

class UserSkill(Base):
    __tablename__ = "user_skill"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.userid"))
    skill = Column(String, nullable=False)

    user = relationship("User", back_populates="skills")

class UserScholarship(Base):
    __tablename__ = "user_scholarship"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.userid"))
    scholarship = Column(String, nullable=False)

    user = relationship("User", back_populates="scholarships")


class UserAffiliation(Base):
    __tablename__ = "user_affiliation"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.userid"))
    affiliation = Column(String, nullable=False)

    user = relationship("User", back_populates="affiliations")
