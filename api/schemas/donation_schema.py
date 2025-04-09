from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class DonationDriveOut(BaseModel):
    drive_id: UUID
    title: str
    description: Optional[str] = None
    target_cost: Optional[float] = None
    image_url: Optional[str] = None
    total_amount_donated: Optional[float] = None
    donation_count: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
        
        
class OneDonationDriveOut(BaseModel):
    drive_id: UUID
    title: str
    description: Optional[str] = None
    target_cost: Optional[float] = None
    image_url: Optional[str] = None
    total_amount_donated: Optional[float] = None
    in_kind_count: Optional[int] = None
    donation_count: Optional[int] = None
    fund_percentage: Optional[float] = None
    links: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MonetaryDonationOut(BaseModel):
    donation_id: UUID
    date_donated: datetime
    amount: float
    drive_id: UUID
    user_id: UUID
    is_acknowledged: bool = False
    donation_drive_title: Optional[str] = None

    class Config:
        from_attributes = True

class InKindDonationOut(BaseModel):
    donation_id: UUID
    date_donated: datetime
    description: str
    drive_id: UUID
    user_id: UUID
    is_acknowledged: bool = False
    donation_drive_title: Optional[str] = None

    class Config:
        from_attributes = True

class DonationHistoryOut(BaseModel):
    donation_id: UUID
    date_donated: datetime
    details: float | str = None
    drive_id: UUID
    user_id: UUID
    is_acknowledged: bool = False
    donation_drive_title: Optional[str] = None
    type: str = None
      
class AdminDonationDriveOut(BaseModel):
    drive_id: UUID
    title: str
    created_at: datetime
    donation_count: int
    percent_funded: float
    amount_raised: float

    class Config:
        from_attributes = True

class AdminOneDonationDriveOut(BaseModel):
    percent_funded: float
    pending_list: list[dict]
    verified_list: list[dict]

    class Config:
        from_attributes = True