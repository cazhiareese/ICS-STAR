from pydantic import BaseModel
from typing import List
from datetime import datetime

class JobPostingOut(BaseModel):
    title: str
    company: str
    description: str
    user_name: str
    tags: List[str]
    interested_count: int
    
    class Config:
        from_attributes = True

class JobPostingForAdminOut(BaseModel):
    title: str
    user_name: str
    interested_count: int
    date_posted: datetime
    
    class Config:
        from_attributes = True