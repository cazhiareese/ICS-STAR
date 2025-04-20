from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List

class EventOut(BaseModel):
    event_id: UUID
    title: str
    description: str
    location: str
    event_datetime: datetime

    class Config:
        from_attributes = True

class OneEventOut(BaseModel):
    event_id: UUID
    title: str
    description: str
    image: str
    location: str
    datetimes: List[datetime]
    links: List[str]
    tags: List[str]

    class Config:
        from_attributes = True
