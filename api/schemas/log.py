from enum import Enum
from typing import Optional
from pydantic import BaseModel
class Log(BaseModel):
    log_id : int
    date_time : str
    is_active : bool
    user_id : str

    class Config:
        from_attributes = True

class TimeRange(str, Enum):
    WEEK = "7days"
    MONTH = "30days"
    YEAR = "year"

class VisitResponse(BaseModel):
    date: str
    visits: int
class TopJobResponse(BaseModel):
    title: str
    company: str
    image: Optional[str]
    date_posted: str
    interested_count: int

class JobsResponse(BaseModel):
    title: str
    company: str
    date_posted: str
    link: str
    interested_count: int
class TopDriveResponse(BaseModel):
    title: str
    image: Optional[str]
    donor_count: int
    
class TopDonationDriveResponse(BaseModel):
    title: str
    donor_count: int
    amount_gathered: float
    target_cost: float
    percentage_progress: float