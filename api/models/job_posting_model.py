from sqlalchemy import Column, String, Boolean, Numeric, Text, ForeignKey, DateTime, func, UUID
from sqlalchemy.orm import relationship
import uuid
from models.usermodel import User
from config.config import Base

class JobPosting(Base):
    __tablename__ = 'job_postings'

    post_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255))
    company = Column(String(255))
    link = Column(Text)
    image = Column(Text)
    employment_type = Column(String(255))
    is_deleted = Column(Boolean, default=False)
    is_closed = Column(Boolean, default=False)
    date_posted = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    is_all = Column(Boolean, default=False)
    salary = Column(Numeric(15, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id], back_populates="job_postings")
    tags = relationship("JobPostingTag", foreign_keys="[JobPostingTag.post_id]", back_populates="job_posting")
    interested_users = relationship("JobPostingInterestedIn", foreign_keys="[JobPostingInterestedIn.post_id]", back_populates="job_posting")
    applied_users = relationship("AppliesFor", foreign_keys="[AppliesFor.post_id]", back_populates="job_posting")

    reported_posts = relationship("Report", foreign_keys="[Report.reported_post_id]", back_populates="reported_post")

class JobPostingTag(Base):
    __tablename__ = 'job_posting_tag'

    post_id = Column(UUID(as_uuid=True), ForeignKey('job_postings.post_id'), primary_key=True)
    tag = Column(String(255), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    job_posting = relationship("JobPosting", foreign_keys=[post_id], back_populates="tags")

class JobPostingInterestedIn(Base):
    __tablename__ = 'job_posting_interested_in'

    post_id = Column(UUID(as_uuid=True), ForeignKey('job_postings.post_id'), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    job_posting = relationship("JobPosting", foreign_keys=[post_id], back_populates="interested_users")
    user = relationship("User", foreign_keys=[user_id], back_populates="interested_job_postings")

class AppliesFor(Base):
    __tablename__ = 'applies_for'

    post_id = Column(UUID(as_uuid=True), ForeignKey('job_postings.post_id'), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    job_posting = relationship("JobPosting", foreign_keys=[post_id], back_populates="applied_users")
    user = relationship("User", foreign_keys=[user_id], back_populates="applied_job_postings")
