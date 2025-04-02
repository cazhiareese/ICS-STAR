from pydantic import BaseModel

class Log(BaseModel):
    log_id : int
    date_time : str
    is_active : bool
    user_id : str

    class Config:
        orm_mode = True