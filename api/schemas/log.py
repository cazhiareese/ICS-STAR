from enum import Enum
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