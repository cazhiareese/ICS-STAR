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