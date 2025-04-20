from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class EventOut(BaseModel):
    event_id: UUID
    title: str
    description: str
    location: str
    event_datetime: datetime

    class Config:
        from_attributes = True
