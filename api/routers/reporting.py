from uuid import UUID
from sqlalchemy.orm import Session
from schemas.report_schema import ReportOut, ReportAttachmentOut
from models.report_model import Report, ReportAttachment
from config.database import get_db
from fastapi import APIRouter, Depends, HTTPException
from util.userutil import get_current_active_user

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
    reports = db.query(Report).filter(Report.reported_user_id.isnot(None), Report.reported_post_id.is_(None)).all()
    if reports is None:
        raise HTTPException(status_code=404, detail="No user reports found")
    return [ReportOut.model_validate(report) for report in reports]


# TODO: Implement this route when the Post model is created

# Get all reports that are for posts
# Arguments: db - SQLAlchemy session
# Returns: a list of all reports that are for posts
# @router.get("/reports/posts", response_model=list[ReportOut])
# async def read_post_reports(db: Session = Depends(get_db)):
#     reports = db.query(Report).filter(Report.reported_post_id.isnot(None)).all()
#     if reports is None:
#         raise HTTPException(status_code=404, detail="No post reports found")
#     return [ReportOut.model_validate(report) for report in reports]

# Get all attachments for a report
# Arguments: db - SQLAlchemy session, report_id - the report ID
# Returns: a list of all attachments for the report
@router.get("/reports/{report_id}/attachments", response_model=list[ReportAttachmentOut])
async def read_attachments(report_id: int, db: Session = Depends(get_db)):
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
    reason: str,
    reporter_id: UUID,
    status: str = "pending",
    db: Session = Depends(get_db)
    ):
    new_report = Report(
        reporter_id=reporter_id,
        reported_user_id=reported_user_id,
        reason=reason,
        status=status
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"message": "User reported", "report_id": new_report.report_id}

# TODO: Implement this route when the Post model is created
# Report a post
# Arguments: db - SQLAlchemy session, report - the report
# Returns: a message confirming the report
# @router.post("/reports/report-post")
# async def report_post(
#     reported_post_id: UUID,
#     reason: str,
#     reporter_id: get_current_active_user = Depends(get_current_active_user),
#     status: str = "pending",
#     db: Session = Depends(get_db)
#     ):
#     new_report = Report(
#         reporter_id=reporter_id,
#         reported_post_id=reported_post_id,
#         reason=reason,
#         status=status
#     )
#     db.add(new_report)
#     db.commit()
#     db.refresh(new_report)
#     return {"message": "Post reported", "report_id": new_report.report_id}

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
