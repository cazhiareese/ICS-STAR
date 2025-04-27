from pydantic import BaseModel
from typing import List, Optional, Union
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
    proof: Optional[str] = None
    is_anonymous: bool = False
    type: str = "Monetary"

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
    type: str = "In-Kind"

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
    created_at: str
    donation_count: int
    percent_funded: float
    amount_raised: float
    remaining_percent: float

    class Config:
        from_attributes = True

class AdminOneDonationDriveOut(BaseModel):
    drive_id: UUID
    title: str
    percent_funded: float
    pending_list: list[dict]
    verified_list: list[dict]
    current_amount: float
    target_cost: float
    is_closed: bool
    remaining_percent: float
    links: List[str]
    created_at: str
    description: str

    class Config:
        from_attributes = True

class PercentOut(BaseModel):
    percent_funded: float
    remaining_percent: float

    class Config:
        from_attributes = True

class GenericDriveOut(BaseModel):
    total_amount: float
    total_in_kind: int
    number_of_unverified: int

    class Config:
        from_attributes = True

class ShortenedMonetaryDonationsOut(BaseModel):
    donation_id: UUID
    donation_date: str
    donation_time: str
    name: str
    donation_details: float
    proof: str
    type: str

    class Config:
        from_attributes = True

class ShortenedInKindDonationsOut(BaseModel):
    donation_id: UUID
    donation_date: str
    donation_time: str
    name: str
    donation_details: str

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True

class AdminOverviewDonationDrive(BaseModel):
    drive_id: UUID
    title: str
    image: str
    created_at: str
    description: str
    links: List[str]

    class Config:
        from_attributes = True

class AdminGenericDriveView(BaseModel):
    drive_id: UUID
    title: str
    grand_total: float
    pending_list: list[dict]
    verified_list: list[dict]
    verified_total: float

    class Config:
        from_attributes = True

class AdminClosedDonationDriveOut(BaseModel):
    drive_id: UUID
    title: str
    date_closed: str
    date_created: str
    percent_funded: float
    amount_raised: float
    target_cost: float

    class Config:
        from_attributes = True

class RecentDonationResponse(BaseModel):
    drive_title: str
    donor_name: str
    donation_details: str

    class Config:
        from_attributes = True

class TopFundedDriveResponse(BaseModel):
    drive_id: UUID
    title: str
    total_donations: float
    target_cost: float
    acknowledged_donations: int
    percentage_funded: float

    class Config:
        from_attributes = True
