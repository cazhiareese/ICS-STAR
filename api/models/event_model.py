from sqlalchemy import Column, String, Boolean, Numeric, Text, ForeignKey, DateTime, func, UUID
from sqlalchemy.orm import relationship
import uuid
from config.config import Base

class Event(Base):
    __tablename__ = "event"

    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text)
    description = Column(Text)
    image = Column(Text)
    location = Column(Text)
    is_concluded = Column(Boolean, default=False)
    is_closed = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    is_all = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
