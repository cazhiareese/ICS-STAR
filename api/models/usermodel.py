from sqlalchemy import create_engine, Column, String, UUID, DateTime, Boolean, Integer, Enum, ForeignKey, func
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.pool import NullPool
import uuid
from enum import Enum as PyEnum
from config.config import Base
from sqlalchemy.dialects.postgresql import ENUM


# Enums
class GenderEnum(PyEnum):
   M = 'M'
   F = 'F'


class UserTypeEnum(PyEnum):
   admin = 'admin'
   student = 'student'
   alumni = 'alumni'

class UserStandingEnum(str, PyEnum):
   freshman = 'freshman'
   old_freshman = 'old freshman'
   sophomore = 'sophomore'
   junior = 'junior'
   senior = 'senior'
   graduating = 'graduating'
   
class UserEmploymentStatus(str, PyEnum):
    employed = "employed"
    self_employed = "self-employed"
    unemployed = "unemployed"
    unemployed_no_exp = "unemployed_no_experience"

class UnemploymentReasonEnum(str, PyEnum):
   training = "Undergoing professional training"
   academics = "Currently pursuing academic studies"
   seek = "Still seeking work"
   cannot_start = "Cannot start working at present"
   other = "Other"

class UserGradSemEnum(str, PyEnum):
    first_sem = "1st Semester"
    second_sem = "2nd Semester"
    midyear = "Midyear"

# Models
class User(Base):
   __tablename__ = 'users'
  
   user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
   first_name = Column(String(50), nullable=False)
   last_name = Column(String(50), nullable=False)
   mobile_number = Column(String(15))
   age = Column(Integer)
   gender = Column(Enum(GenderEnum))
   city = Column(String(50))
   state = Column(String(50))
   country = Column(String(50))
   marital_status = Column(String(20))
   image = Column(String(255))
   password = Column(String(255), nullable=False)
   email = Column(String(100), unique=True, nullable=False)
   verification_file = Column(String(255))
   is_verified = Column(Boolean, nullable=False, default=False)
   user_type = Column(Enum(UserTypeEnum), nullable=False)
   position = Column(String(50))
   is_banned = Column(Boolean, default=False)
   student_number = Column(String(15), unique=True)
   standing = Column(
    ENUM(
        UserStandingEnum,
        name='user_standing_enum',  # Must match your PostgreSQL enum type name exactly
        create_type=False,  # Important - tells SQLAlchemy the type already exists
        values_callable=lambda x: [e.value for e in UserStandingEnum]  # Explicit values
    ),
    nullable=True
)
   graduation_year = Column(Integer)
   graduation_semester = Column(String(20))
   employment_status = Column(String(50))
   industry = Column(String(100))
   company_name = Column(String(100))
   job_title = Column(String(100))
   work_location = Column(String(100))
   work_mode = Column(String(50))
   employer_class = Column(String(50))
   tenured_status = Column(String(10))
   salary_grade = Column(String(10))
   facebook = Column(String(255))
   linkedin = Column(String(255))
   github = Column(String(255))
   created_at = Column(DateTime(timezone=True), server_default=func.now())
   updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


   skills = relationship("UserSkill", back_populates="user")
   scholarships = relationship("UserScholarship", back_populates="user")
   affiliations = relationship("UserAffiliation", back_populates="user")
   logs = relationship("Log", back_populates="user")
   reports = relationship("Report", foreign_keys="[Report.reporter_id]", back_populates="reporter", lazy="joined")
   account_reports = relationship("Report", foreign_keys="[Report.reported_user_id]", back_populates="reported_user", lazy="joined")
   reasons = relationship("UnemploymentReason", back_populates="user")
   monetary_donations = relationship("MonetaryDonation", foreign_keys="[MonetaryDonation.user_id]", back_populates="user", lazy="joined")
   in_kind_donations = relationship("InKindDonation", foreign_keys="[InKindDonation.user_id]", back_populates="user", lazy="joined")
   job_postings = relationship("JobPosting", foreign_keys="[JobPosting.user_id]", back_populates="user", lazy="joined")
   interested_job_postings = relationship("JobPostingInterestedIn", foreign_keys="[JobPostingInterestedIn.user_id]", back_populates="user", lazy="joined")
   applied_job_postings = relationship("AppliesFor", foreign_keys="[AppliesFor.user_id]", back_populates="user", lazy="joined")
   
   
   
class UnemploymentReason(Base):
   __tablename__ = 'unemployment_reason'
   user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), primary_key=True)
   reason = Column(String(255), primary_key=True)
   created_at = Column(DateTime(timezone=True), server_default=func.now())
   updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
   
   user = relationship("User", back_populates="reasons")

class UserSkill(Base):
   __tablename__ = 'user_skill'
   user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), primary_key=True)
   skill = Column(String(100), primary_key=True)
   created_at = Column(DateTime(timezone=True), server_default=func.now())
   updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
  
   user = relationship("User", back_populates="skills")


class UserScholarship(Base):
   __tablename__ = 'user_scholarship'
   user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), primary_key=True)
   scholarship = Column(String(100), primary_key=True)
   created_at = Column(DateTime(timezone=True), server_default=func.now())
   updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
  
   user = relationship("User", back_populates="scholarships")


class UserAffiliation(Base):
   __tablename__ = 'user_affiliation'
   user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), primary_key=True)
   affiliation = Column(String(100), primary_key=True)
   role = Column(String(100))
   created_at = Column(DateTime(timezone=True), server_default=func.now())
   updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
  
   user = relationship("User", back_populates="affiliations")

class Orgs(Base):
   __tablename__ = 'org'
  
   org_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
   name = Column(String(255), nullable=False)
   alias = Column(String(50))