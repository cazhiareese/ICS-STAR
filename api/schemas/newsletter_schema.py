from typing import Optional
from pydantic import BaseModel
from uuid import UUID

class NewsLetterOut(BaseModel):
    newsletter_id: UUID
    title: str
    image: Optional[str] = None
    date_posted: str
    content: str
    tags: list[str]

    class Config:
        from_attributes = True

class SingleNewsLetterOut(BaseModel):
    newsletter_id: UUID
    title: str
    image: Optional[str] = None
    date_posted: str
    content: str
    tags: list[str]
    links: list[str]

    class Config:
        from_attributes = True

class ListNewsletterOut(BaseModel):
    newsletter_id: UUID
    title: str
    image: Optional[str] = None
    date_posted: str
    is_deleted: bool
    tags: Optional[list[str]] = None
    links: Optional[list[str]] = None

    class Config:
        from_attributes = True