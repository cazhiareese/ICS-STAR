from pydantic import BaseModel
from typing import List

class JobPostingOut(BaseModel):
    title: str
    company: str
    description: str
    user_name: str
    tags: List[str]
    interested_count: int
    
    class Config:
        from_attributes = True