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
    confirmed_by = relationship("EventConfirmedBy", foreign_keys="[EventConfirmedBy.event_id]", back_populates="event")
    dates = relationship("EventDate", foreign_keys="[EventDate.event_id]", back_populates="event")

class EventConfirmedBy(Base):
    __tablename__ = "event_confirmed_by"

    event_id = Column(UUID(as_uuid=True), ForeignKey("event.event_id"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    event = relationship("Event", foreign_keys=[event_id], back_populates="confirmed_by")
    user = relationship("User", foreign_keys=[user_id], back_populates="confirmed_events")
    
class EventDate(Base):
    __tablename__ = "event_date"

    event_id = Column(UUID(as_uuid=True), ForeignKey("event.event_id"), primary_key=True)
    date = Column(DateTime(timezone=True), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    event = relationship("Event", foreign_keys=[event_id], back_populates="dates")
