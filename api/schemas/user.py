from pydantic import BaseModel

class UserLogInput(BaseModel): # Temporary model for user logs; input from client is needed
    user_id: str
    isActive: bool
    batch: int

class UserLog(UserLogInput): # This is what actually gets stored, no input from client since time should be automatically logged
    time: str