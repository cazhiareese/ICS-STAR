from typing import Optional
from uuid import UUID
from util.emailing.reporting_email import reported_notice
from sqlalchemy.orm import Session
import brevo_python
from brevo_python.rest import ApiException
from config.config import STORAGE_STRING, supabase_client, SUPABASE_BUCKET, brevo_configuration, email_sender
from util.job_posting_util import create_report_with_attachment
from schemas.report_schema import ReportOut, ReportAttachmentOut
from models.report_model import Report, ReportAttachment
from models.usermodel import User
from config.database import get_db
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File
from util.userutil import get_current_active_user
from uuid import UUID

router = APIRouter()

# Get all reports
# Arguments: db - SQLAlchemy session
# Returns: a list of all reports
@router.get("/reports", response_model=list[ReportOut])
async def read_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    if reports is None:
        raise HTTPException(status_code=404, detail="No reports found")
    return [ReportOut.model_validate(report) for report in reports]

# Get a report by ID
# Arguments: db - SQLAlchemy session, report_id - the report ID
# Returns: the report with the specified ID
@router.get("/reports/{report_id}", response_model=ReportOut)
async def read_report(report_id: UUID, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.report_id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return ReportOut.model_validate(report)

# Get all reports that are for users
# Arguments: db - SQLAlchemy session
# Returns: a list of all reports that are for users
@router.get("/reports/users", response_model=list[ReportOut])
async def read_user_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.reported_user_id.isnot(None), Report.reported_post_id.is_(None)).all()
    if reports is None:
        raise HTTPException(status_code=404, detail="No user reports found")
    return [ReportOut.model_validate(report) for report in reports]

# Get all attachments for a report
# Arguments: db - SQLAlchemy session, report_id - the report ID
# Returns: a list of all attachments for the report
@router.get("/reports/{report_id}/attachments", response_model=list[ReportAttachmentOut])
async def read_attachments(report_id: UUID, db: Session = Depends(get_db)):
    attachments = db.query(ReportAttachment).filter(ReportAttachment.report_id == report_id).all()
    if attachments is None:
        raise HTTPException(status_code=404, detail="No attachments found")
    return [ReportAttachmentOut.model_validate(attachment) for attachment in attachments]

# Report a user
# Arguments: db - SQLAlchemy session, report - the report
# Returns: a message confirming the report
@router.post("/reports/report-user")
async def report_user(
    reported_user_id: UUID,
    reporter_id: UUID,
    db: Session = Depends(get_db),
    reason: str = Form(...)
    ):
    new_report = Report(
        reporter_id=reporter_id,
        reported_user_id=reported_user_id,
        reason=reason,
        status="pending"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    existing_reports_count = db.query(Report).filter(
        Report.reported_user_id == reported_user_id
    ).count()

    if existing_reports_count >= 3:
        email_util(reported_user_id, db=db) 

    return {"message": "User reported", "report_id": new_report.report_id}

# Report a post
# Arguments: db - SQLAlchemy session, report - the report
# Returns: a message confirming the report
@router.post("/reports/report-job-post", response_model=ReportOut, status_code=201)
async def report_job_post(
    post_id: UUID = Form(...),
    reason: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):

    return await create_report_with_attachment(
        db=db,
        reporter_id=current_user.user_id,
        reported_post_id=post_id,
        reason=reason,
        attachment=attachment
    )

# Add an attachment to a report
# Arguments: db - SQLAlchemy session, attachment - the attachment
# Returns: a message confirming the attachment
@router.post("/reports/{report_id}/attach-file")
async def add_attachment(
    report_id: UUID,
    file_url: str,
    db: Session = Depends(get_db)
    ):
    new_attachment = ReportAttachment(
        report_id=report_id,
        file_url=file_url
    )
    db.add(new_attachment)
    db.commit()
    db.refresh(new_attachment)
    return {"message": "Attachment added", "attachment_id": new_attachment.attachment_id}

def email_util(reported_user_id: UUID, db: Session):
    try:
        user = db.query(User.user_id, User.first_name, User.last_name, User.email, User.user_type).filter(User.user_id == reported_user_id).first()

    except Exception as e:
        raise HTTPException(status_code = 404, detail="Reported user not found")
    

    api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))
    subject = f"ICS-STAR Management: User Reported Several Times"
    sender = email_sender
    html_content = reported_notice(user_name= f"{user.first_name} {user.last_name}", email=user.email)
    to = [{"name": "ICS-STAR", "email": "clleva@up.edu.ph"}]
    send_smtp_email = brevo_python.SendSmtpEmail(to=to, html_content=html_content, sender=sender, subject=subject)

    try:
        print("before execute")
        api_response = api_instance.send_transac_email(send_smtp_email)
        return {"message": api_response}
    except ApiException as e:
        print(f"Error: {e}")
