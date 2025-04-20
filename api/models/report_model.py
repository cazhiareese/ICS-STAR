from sqlalchemy import Column, UUID, String, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import relationship
import uuid
from enum import Enum as PyEnum
from config.config import Base


# Enum for report status
class ReportStatusEnum(PyEnum):
    pending = "pending"
    reviewed = "reviewed"
    resolved = "resolved"
    rejected = "rejected"

# Report model
class Report(Base):
    __tablename__ = "report"

    report_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    reported_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    reported_post_id = Column(UUID(as_uuid=True), ForeignKey("job_posting.post_id"), nullable=True)

    reason = Column(String, nullable=False)
    status = Column(Enum(ReportStatusEnum), default=ReportStatusEnum.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    reporter = relationship("User", foreign_keys=[reporter_id], back_populates="reports")
    reported_user = relationship("User", foreign_keys=[reported_user_id], back_populates="account_reports")
    reported_post = relationship("JobPosting", foreign_keys=[reported_post_id], back_populates="reported_posts")

    attachments = relationship("ReportAttachment", back_populates="report")


# Report Attachment Model
class ReportAttachment(Base):
    __tablename__ = "report_attachments"

    attachment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("report.report_id"), nullable=False)
    file_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    report = relationship("Report", back_populates="attachments")

# Add relationship to Report model
Report.attachments = relationship("ReportAttachment", back_populates="report")
