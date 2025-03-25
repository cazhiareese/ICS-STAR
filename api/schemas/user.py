from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime

class UserOut(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    email: str
    mobile: Optional[str] = None
    age: int
    gender: str
    city: str
    state: str
    country: str
    marital_status: Optional[str] = None
    user_type: str
    is_banned: Optional[bool] = None

    class Config:
        from_attributes = True