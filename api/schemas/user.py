from pydantic import BaseModel

class UserOut(BaseModel):
    userid: int
    first_name: str
    last_name: str
    email: str
    mobile: str
    age: int
    gender: str
    city: str
    state: str
    country: str
    last_login: str | None
    marital_status: str
    user_type: str
    is_banned: bool

    class Config:
        from_attributes = True 
