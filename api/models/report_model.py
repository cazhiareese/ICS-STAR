from sqlalchemy import Column, UUID, String, ForeignKey, Enum, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid
from enum import Enum as PyEnum

Base = declarative_base()

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

    # TODO: Add ForeignKey to Post model when created
    reported_post_id = Column(UUID(as_uuid=True), nullable=True)


    reason = Column(String, nullable=False)
    status = Column(Enum(ReportStatusEnum), default=ReportStatusEnum.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    reporter = relationship("User", foreign_keys=[reporter_id])
    reported_user = relationship("User", foreign_keys=[reported_user_id])
    # reported_post = relationship("Post", foreign_keys=[reported_post_id]) #TODO: Add relationship to Post model when created

    attachments = relationship("ReportAttachment", back_populates="report")

# Report Attachment Model
class ReportAttachment(Base):
    __tablename__ = "report_attachment"

    attachment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("report.report_id"), nullable=False)
    file_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    report = relationship("Report", back_populates="attachments")

# Add relationship to Report model
Report.attachments = relationship("ReportAttachment", back_populates="report")
