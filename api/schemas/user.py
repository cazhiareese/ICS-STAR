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
    mobile_number: Optional[str] = None  
    age: int
    gender: GenderEnum  
    city: str
    state: str
    country: str
    marital_status: Optional[str] = None
    user_type: UserTypeEnum  
    is_verified: bool
    is_banned: Optional[bool] = None
    standing: Optional[UserStandingEnum] = None
    graduation_year: Optional[int] = None
    graduation_semester: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  
