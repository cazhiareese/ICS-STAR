from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class DonationDriveOut(BaseModel):
    title: str
    description: str
    target_cost: float
    image_url: Optional[str]
    total_amount_donated: float
    donation_count: int

    class Config:
        orm_mode = True
