from sqlalchemy import Column, UUID, DateTime, Boolean, ForeignKey, func

from config import config

class Log(config.Base):
    __tablename__ = 'log'
    log_id = Column(UUID(as_uuid = True), primary_key = True)
    date_time = Column(DateTime, default = func.now(), nullable = False)
    is_active = Column(Boolean, nullable = False)
    user_id = Column(UUID(as_uuid = True), ForeignKey('users.user_id', ondelete = 'CASCADE'), nullable = False)