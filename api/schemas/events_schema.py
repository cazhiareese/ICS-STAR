from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional

class EventOut(BaseModel):
    event_id: UUID
    title: str
    image: Optional[str]
    description: Optional[str]
    location: str
    dates: List[datetime]
    tags: Optional[List[str]]
    rsvp_closed: bool
    going_count: int

    class Config:
        from_attributes = True

class OneEventOut(BaseModel):
    event_id: UUID
    title: str
    description: Optional[str]
    image: Optional[str]
    location: str
    datetimes: List[datetime]
    links: Optional[List[str]]
    tags: Optional[List[str]]
    going_count: int
    rsvp_closed: bool

    class Config:
        from_attributes = True

class DemographicsOut(BaseModel):
    batch: str
    rsvp_count: int

class UpcomingEventResponse(BaseModel):
    event_id: str
    title: str
    date: datetime
    location: str
    days_left: int

    class Config:
        from_attributes = True
