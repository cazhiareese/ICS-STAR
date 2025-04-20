from sqlalchemy import Column, String, Text, Boolean, ForeignKey, Date, Table, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from config.config import Base  # Assuming you have a base.py for declarative_base()

class Event(Base):
    __tablename__ = 'event'
    
    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    description = Column(Text)
    image = Column(Text)
    location = Column(Text)
    is_concluded = Column(Boolean, default=False)
    is_closed = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    is_all = Column(Boolean, default=False)
    created_at = Column('created_at', DateTime(timezone=True), server_default=func.now())
    updated_at = Column('updated_at', DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    confirmed_users = relationship("EventConfirmedBy", back_populates="event")
    dates = relationship("EventDate", back_populates="event")
    links = relationship("EventLink", back_populates="event")
    tags = relationship("EventTag", back_populates="event")
    visible_to_users = relationship("EventVisibleTo", back_populates="event")

class EventConfirmedBy(Base):
    __tablename__ = 'event_confirmed_by'
    
    event_id = Column(UUID(as_uuid=True), ForeignKey('event.event_id'), primary_key=True)
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    created_at = Column('created_at', DateTime(timezone=True), server_default=func.now())
    updated_at = Column('updated_at', DateTime(timezone=True), server_default=func.now(),onupdate=func.now())
    
    # Relationships
    event = relationship("Event", back_populates="confirmed_users")

class EventDate(Base):
    __tablename__ = 'event_date'
    
    event_id = Column(UUID(as_uuid=True), ForeignKey('event.event_id'), primary_key=True)
    date = Column(Date, primary_key=True)
    created_at = Column('created_at', DateTime(timezone=True), server_default=func.now())
    updated_at = Column('updated_at', DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    event = relationship("Event", back_populates="dates")

class EventLink(Base):
    __tablename__ = 'event_link'
    
    event_id = Column(UUID(as_uuid=True), ForeignKey('event.event_id'), primary_key=True)
    link = Column(Text, primary_key=True)
    created_at = Column('created_at', DateTime(timezone=True), server_default=func.now())
    updated_at = Column('updated_at', DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    event = relationship("Event", back_populates="links")

class EventTag(Base):
    __tablename__ = 'event_tag'
    
    event_id = Column(UUID(as_uuid=True), ForeignKey('event.event_id'), primary_key=True)
    tag = Column(Text, primary_key=True)
    created_at = Column('created_at', DateTime(timezone=True), server_default=func.now())
    updated_at = Column('updated_at', DateTime(timezone=True),  server_default=func.now(), onupdate=func.now())
    
    # Relationships
    event = relationship("Event", back_populates="tags")

class EventVisibleTo(Base):
    __tablename__ = 'event_visible_to'
    
    event_id = Column(UUID(as_uuid=True), ForeignKey('event.event_id'), primary_key=True)
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    created_at = Column('created_at', DateTime(timezone=True), server_default=func.now())
    updated_at = Column('updated_at', DateTime(timezone=True),server_default=func.now(), onupdate=func.now())
    
    # Relationships
    event = relationship("Event", back_populates="visible_to_users")