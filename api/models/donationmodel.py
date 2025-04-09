from sqlalchemy import Column, String, Boolean, Numeric, Text, ForeignKey, DateTime, func, UUID
from sqlalchemy.orm import relationship
import uuid
from models.usermodel import User
from config.config import Base

class DonationDrive(Base):
    __tablename__ = 'donation_drive'
    
    drive_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255))
    description = Column(Text)
    is_deleted = Column(Boolean, default=False)
    is_closed = Column(Boolean, default=False)
    target_cost = Column(Numeric(15, 2))
    image = Column(Text)
    is_general = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    donation_drive_link = relationship("DonationDriveLink", foreign_keys="[DonationDriveLink.drive_id]", back_populates="drive")

class MonetaryDonation(Base):
    __tablename__ = 'monetary_donation'

    donation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date_donated = Column(DateTime(timezone=True))
    amount = Column(Numeric(15, 2))
    drive_id = Column(UUID(as_uuid=True), ForeignKey('donation_drive.drive_id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    is_acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user = relationship("User", foreign_keys=[user_id],back_populates="monetary_donations")

class InKindDonation(Base):
    __tablename__ = 'in_kind_donation'

    donation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date_donated = Column(DateTime(timezone=True))
    amount = Column(Numeric(15, 2))
    description = Column(Text)
    drive_id = Column(UUID(as_uuid=True), ForeignKey('donation_drive.drive_id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    is_acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user = relationship("User", foreign_keys=[user_id], back_populates="in_kind_donations")
    
class DonationDriveLink(Base):
    __tablename__= 'donation_drive_link'
    
    drive_id = Column(UUID(as_uuid=True), ForeignKey('donation_drive.drive_id'), primary_key=True)
    link = Column(Text, primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    drive = relationship("DonationDrive", foreign_keys=[drive_id], back_populates="donation_drive_link")