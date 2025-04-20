from pydantic import BaseModel, Field, HttpUrl
from uuid import UUID
from datetime import datetime
from enum import Enum
from typing import Optional, List


# Enum for report status 
class ReportStatusEnum(str, Enum):
    pending = "pending"
    reviewed = "reviewed"
    resolved = "resolved"
    rejected = "rejected"

class ReportOut(BaseModel):
    report_id: UUID
    reporter_id: UUID
    reported_user_id: Optional[UUID] = None
    reported_post_id: Optional[UUID] = None
    reason: str
    status: ReportStatusEnum
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReportAttachmentOut(BaseModel):
    attachment_id: UUID
    report_id: UUID
    file_url: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReportedJobPostingOut(BaseModel):
    post_id: UUID
    title: str
    date_posted: datetime
    user_name: str
    interested_count: int
    report_count: int
    
    class Config:
        from_attributes = True
class PostReportDetailOut(BaseModel):
    title: str
    company: str
    user_id: UUID
    date_reported: datetime
    reporter_name: str
    reason: str
    attachment: str = None

    class Config:
        from_attributes = True