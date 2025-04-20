from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional

class EventOut(BaseModel):
    event_id: UUID
    title: str
    image: Optional[str]
    description: str
    location: str
    is_closed: bool
    dates: List[datetime]
    tags: Optional[List[str]]

    class Config:
        from_attributes = True

class OneEventOut(BaseModel):
    event_id: UUID
    title: str
    description: str
    image: Optional[str]
    location: str
    is_closed: bool
    datetimes: List[datetime]
    links: Optional[List[str]]
    tags: Optional[List[str]]

    class Config:
        from_attributes = True

class DemographicsOut(BaseModel):
    batch: str
    rsvp_count: int
