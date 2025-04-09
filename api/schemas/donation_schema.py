from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class DonationDriveOut(BaseModel):
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