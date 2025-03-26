from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

# Enums (same as SQLAlchemy models)
class GenderEnum(str, Enum):
    M = "M"
    F = "F"

class UserTypeEnum(str, Enum):
    admin = "admin"
    student = "student"
    alumni = "alumni"

class UserStandingEnum(str, Enum):
    freshman = "freshman"
    old_freshman = "old freshman"
    sophomore = "sophomore"
    junior = "junior"
    senior = "senior"
    graduating = "graduating"

class UserOut(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    email: str
    mobile_number: str
    age: int
    gender: GenderEnum
    city: str
    state: str
    country: str
    marital_status: Optional[str] = None
    image: Optional[str] = None
    verification_file: Optional[str] = None
    is_verified: bool
    is_banned: Optional[bool] = None
    user_type: UserTypeEnum
    position: Optional[str] = None
    student_number: Optional[str] = None
    standing: Optional[UserStandingEnum] = None
    graduation_year: Optional[int] = None
    graduation_semester: Optional[str] = None
    employment_status: Optional[str] = None
    job_title: Optional[str] = None
    work_location: Optional[str] = None
    work_mode: Optional[str] = None
    employer_class: Optional[str] = None
    tenured_status: Optional[str] = None
    salary_grade: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
class UserIn(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    student_number: Optional[str] = None
    graduation_year: Optional[int] = None
    graduation_semester: Optional[str] = None
    verification_file: Optional[str] = None
    user_type: UserTypeEnum