from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class JobSearchOut(BaseModel):
    id: UUID
    title: str
    company: str
    description: Optional[str] = None,
    employment_type: str
    posted_by: str
    created_at: str
    interested_in: int
    tags: List[str] = []

    class Config:
        from_attributes = True

class UserInterestedOut(BaseModel):
    id: UUID
    name: str
    batch: str
    image: Optional[str] = None
    location: Optional[str] = None
    title: str
    industry: Optional[str] = None
    date_of_interest: str

    class Config:
        from_attributes = True

class JobPostingOverviewOut(BaseModel):
    title: str
    company: str
    posted_by: str
    poster_location: str
    total_interested: int
    created_at: str

    class Config:
        from_attributes = True