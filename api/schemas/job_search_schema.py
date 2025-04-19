from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class JobSearchOut(BaseModel):
    id: UUID
    title: str
    company: str
    description: str
    posted_by: str
    interested_in: int

    class Config:
        from_attributes = True

class UserInterestedOut(BaseModel):
    id: UUID
    name: str
    batch: str
    image: str
    location: Optional[str] = None
    title: str
    industry: Optional[str] = None
    date_of_interest: str

    class Config:
        from_attributes = True