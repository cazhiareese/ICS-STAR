from enum import Enum
from uuid import UUID
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class EmploymentTypeEnum(str, Enum):
    fulltime = "fulltime"
    parttime = "parttime"
    contractual = "contractual"
    freelance = "freelance"
    internship = "internship"
    apprenticeship = "apprenticeship"

class JobModeEnum(str, Enum):
    onsite = "onsite"
    remote = "remote"
    hybrid = "hybrid"

class JobPostingOut(BaseModel):
    post_id: UUID
    user_id: UUID
    title: str
    company: str
    description: Optional[str] = None
    user_name: str
    tags: List[str]
    interested_count: int
    employment_type: EmploymentTypeEnum
    mode: JobModeEnum
    link: str
    image: Optional[str] = None
    
    class Config:
        from_attributes = True

class JobPostingForAdminOut(BaseModel):
    post_id: UUID
    title: str
    user_name: str
    interested_count: int
    date_posted: str
    company: str
    description: Optional[str] = None
    user_name: str
    employment_type: EmploymentTypeEnum
    mode: JobModeEnum
    
    
    class Config:
        from_attributes = True