from sqlalchemy import (
    Column, String, Boolean, Text, ForeignKey, DateTime, create_engine, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base
import uuid
from datetime import datetime

Base = declarative_base()

class Newsletter(Base):
    __tablename__ = 'newsletter'

    newsletter_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    image = Column(Text)
    date_posted = Column(DateTime(timezone=True), server_default=func.now())
    is_deleted = Column(Boolean, default=False)
    content = Column(Text)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    links = relationship('NewsletterLink', back_populates='newsletter', cascade="all, delete-orphan")
    tags = relationship('NewsletterTag', back_populates='newsletter', cascade="all, delete-orphan")


class NewsletterLink(Base):
    __tablename__ = 'newsletter_link'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    newsletter_id = Column(UUID(as_uuid=True), ForeignKey('newsletter.newsletter_id'), nullable=False)
    link = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    newsletter = relationship('Newsletter', back_populates='links')


class NewsletterTag(Base):
    __tablename__ = 'newsletter_tag'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    newsletter_id = Column(UUID(as_uuid=True), ForeignKey('newsletter.newsletter_id'), nullable=False)
    tag = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    newsletter = relationship('Newsletter', back_populates='tags')