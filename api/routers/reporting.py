from sqlalchemy import Session
from schemas.report_schema import ReportOut, ReportAttachmentOut
from models.report_model import Report, ReportAttachment
from config.database import get_db
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

# Get all reports
# Arguments: db - SQLAlchemy session
# Returns: a list of all reports
@router.get("/reports", response_model=list[ReportOut])
async def read_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    return [ReportOut.model_validate(report) for report in reports]

# Get a report by ID
# Arguments: db - SQLAlchemy session, report_id - the report ID
# Returns: the report with the specified ID
@router.get("/reports/{report_id}", response_model=ReportOut)
async def read_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.report_id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return ReportOut.model_validate(report)

# Get all reports that are for users
# Arguments: db - SQLAlchemy session
# Returns: a list of all reports that are for users
@router.get("/reports/users", response_model=list[ReportOut])
async def read_user_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.reported_user_id is not None and Report.reported_post_id is None).all()
    return [ReportOut.model_validate(report) for report in reports]

# Get all reports that are for posts
# Arguments: db - SQLAlchemy session
# Returns: a list of all reports that are for posts
@router.get("/reports/posts", response_model=list[ReportOut])
async def read_post_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.reported_post_id is not None).all()
    return [ReportOut.model_validate(report) for report in reports]

# Get all attachments for a report
# Arguments: db - SQLAlchemy session, report_id - the report ID
# Returns: a list of all attachments for the report
@router.get("/reports/{report_id}/attachments", response_model=list[ReportAttachmentOut])
async def read_attachments(report_id: int, db: Session = Depends(get_db)):
    attachments = db.query(ReportAttachment).filter(ReportAttachment.report_id == report_id).all()
    return [ReportAttachmentOut.model_validate(attachment) for attachment in attachments]

# Report a user
# Arguments: db - SQLAlchemy session, report - the report
# Returns: a message confirming the report
@router.post("/reports/users")
async def report_user(report: Report, db: Session = Depends(get_db)):
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"message": "User reported"}

# Report a post
# Arguments: db - SQLAlchemy session, report - the report
# Returns: a message confirming the report
@router.post("/reports/posts")
async def report_post(report: Report, db: Session = Depends(get_db)):
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"message": "Post reported"}

# Add an attachment to a report
# Arguments: db - SQLAlchemy session, attachment - the attachment
# Returns: a message confirming the attachment
@router.post("/reports/attachments")
async def add_attachment(attachment: ReportAttachment, db: Session = Depends(get_db)):
    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return {"message": "Attachment added"}
