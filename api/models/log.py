from sqlalchemy import Column, UUID, DateTime, Boolean, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from .usermodel import Base

class Log(Base):
    __tablename__ = 'log'
    log_id = Column(UUID(as_uuid = True), primary_key = True)
    date_time = Column(DateTime, default = func.now(), nullable = False)
    is_active = Column(Boolean, nullable = False)
    user_id = Column(UUID(as_uuid = True), ForeignKey('users.user_id', ondelete = 'CASCADE'), nullable = False)

    user = relationship("User", back_populates = "logs")