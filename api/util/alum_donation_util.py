import brevo_python
from brevo_python.rest import ApiException
from fastapi import HTTPException, UploadFile, File
from util.emailing.invoice import invoice_message
from config.config import STORAGE_STRING, supabase_client, SUPABASE_BUCKET, brevo_configuration, email_sender
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, distinct
from models.donationmodel import DonationDrive, MonetaryDonation, InKindDonation, DonationDriveLink
from models.usermodel import User
from schemas.user import CurrentUser
from schemas.donation_schema import DonationDriveOut, OneDonationDriveOut
from datetime import datetime, timezone
from typing import Optional, List
import uuid
from uuid import UUID
import math
from config.config import MAYA_PUBLIC_KEY, MAYA_CANCEL, MAYA_FAIL, MAYA_SUCCESS, MAYA_URL
import random
import string
import httpx

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png", "pdf", "heic", "docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024

async def maya_donation(drive_id: uuid, value: float):
    url = MAYA_URL
    ref_num = ''.join(random.choices(string.ascii_letters + string.digits, k=12)).upper()
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": MAYA_PUBLIC_KEY
    }

    payload = {
        "totalAmount": {
            "value": value,
            "currency": "PHP"
        },
        "redirectUrl": {
            "success": f"{MAYA_SUCCESS}{drive_id}?success=true",
            "failure": f"{MAYA_FAIL}{drive_id}",
            "cancel": f"{MAYA_CANCEL}{drive_id}",
        },
        "requestReferenceNumber": f'ICS-{ref_num}'
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

def fetch_drive_suggestions(db: Session, query_text: str, limit: int = 5) -> List[DonationDriveOut]:
    drives = (
        db.query(DonationDrive)
        .filter(
            DonationDrive.is_deleted.is_(False),
            DonationDrive.is_closed.is_(False),
            or_(
                DonationDrive.title.ilike(f"%{query_text}%"),
                DonationDrive.description.ilike(f"%{query_text}%")
            )
        )
        .filter(DonationDrive.title.isnot(None))
        .order_by(DonationDrive.title)
        .limit(limit)
        .all()
    )

    return [get_donation_drive_data(db, drive) for drive in drives]

def safe_float(value):
    try:
        value = float(value)
        if math.isnan(value) or math.isinf(value):
            return 0.0
        return value
    except (TypeError, ValueError):
        return 0.0

def get_donation_drive_data(db: Session, drive: DonationDrive) -> DonationDriveOut:
    monetary_data = db.query(
        func.coalesce(func.sum(MonetaryDonation.amount), 0).label('total_amount_donated'),
        func.count(MonetaryDonation.donation_id).label('monetary_count')
    ).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged.is_(True)
    ).one()

    total_amount_donated = monetary_data.total_amount_donated
    monetary_count = monetary_data.monetary_count
    
    in_kind_count = (
        db.query(func.count(InKindDonation.donation_id))
        .filter(
            InKindDonation.drive_id == drive.drive_id,
            InKindDonation.is_acknowledged.is_(True)
        )
        .scalar()
    )

    donation_count = monetary_count + in_kind_count
    

    return DonationDriveOut(
        drive_id=drive.drive_id,
        title=drive.title,
        description=drive.description,
        target_cost=safe_float(drive.target_cost) if drive.target_cost else None,
        image_url=drive.image,
        total_amount_donated=float(total_amount_donated or 0),
        donation_count=donation_count,
        created_at=drive.created_at
    )
    
def get_one_donation_drive(db: Session, drive: DonationDrive) -> OneDonationDriveOut:
    monetary_data = db.query(
        func.coalesce(func.sum(MonetaryDonation.amount), 0).label('total_amount_donated'),
        func.count(MonetaryDonation.donation_id).label('monetary_count')
    ).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged.is_(True)
    ).one()

    total_amount_donated = monetary_data.total_amount_donated
    fund_percentage = (monetary_data.total_amount_donated / drive.target_cost * 100) if drive.target_cost else None
    
    monetary_count = monetary_data.monetary_count
    in_kind_count = (
        db.query(func.count(InKindDonation.donation_id))
        .filter(
            InKindDonation.drive_id == drive.drive_id,
            InKindDonation.is_acknowledged.is_(True)
        )
        .scalar()
    )

    donation_count = monetary_count + in_kind_count
    
    links = db.query(DonationDriveLink.link).filter(DonationDriveLink.drive_id == drive.drive_id).all()
    link_list = [link[0] for link in links] if links else None

    return OneDonationDriveOut(
        drive_id=drive.drive_id,
        title=drive.title,
        description=drive.description,
        target_cost=float(drive.target_cost or 0) if drive.target_cost else None,
        image_url=drive.image,
        total_amount_donated=float(total_amount_donated or 0),
        in_kind_count=in_kind_count,
        donation_count=donation_count,
        fund_percentage = round(fund_percentage, 2) if fund_percentage else None,
        link=link_list,
        created_at=drive.created_at
    )
    
def general_donation_drive(db: Session, drive: DonationDrive) -> OneDonationDriveOut:
    monetary_data = db.query(
        func.coalesce(func.sum(MonetaryDonation.amount), 0).label('total_amount_donated'),
        func.count(MonetaryDonation.donation_id).label('monetary_count')
    ).filter(
        MonetaryDonation.drive_id == drive.drive_id,
        MonetaryDonation.is_acknowledged.is_(True)
    ).one()

    total_amount_donated = monetary_data.total_amount_donated    
    monetary_count = monetary_data.monetary_count
    in_kind_count = (
        db.query(func.count(InKindDonation.donation_id))
        .filter(
            InKindDonation.drive_id == drive.drive_id,
            InKindDonation.is_acknowledged.is_(True)
        )
        .scalar()
    )

    donation_count = monetary_count + in_kind_count
    
    links = db.query(DonationDriveLink.link).filter(DonationDriveLink.drive_id == drive.drive_id).all()
    link_list = [link[0] for link in links] if links else None

    return OneDonationDriveOut(
        drive_id=drive.drive_id,
        title=drive.title,
        description=drive.description,
        target_cost=float(drive.target_cost or 0) if drive.target_cost else None,
        image_url=drive.image,
        total_amount_donated=float(total_amount_donated or 0),
        in_kind_count=in_kind_count,
        donation_count=donation_count,
        link=link_list,
        created_at=drive.created_at
    )


async def upload_proof(
    db: Session,
    proof: Optional[UploadFile] = File(None),
):
    if proof:
        file_content = await proof.read()
        if len(file_content) > MAX_FILE_SIZE or proof.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid proof of payment")

        proof_ext = proof.filename.split(".")[-1]
        proof_name = f"proof_of_payment/{uuid.uuid4()}.{proof_ext}"
        try:
            supabase_client.storage.from_(SUPABASE_BUCKET).upload(proof_name, file_content)
        except Exception as e:
            print("Upload Error:", e)
        proof_url = f"{STORAGE_STRING}{proof_name}"
    else:
        raise HTTPException(status_code=400, detail="Proof of payment required")

    return proof_url

async def make_donation(
    db: Session,
    user: CurrentUser,
    drive: DonationDrive,
    monetary_donation: bool = False,
    in_kind_donation: bool = False,
    direct_maya: Optional[bool] = None,
    amount: Optional[float] = None,
    description: Optional[str] = None,
    proof: Optional[UploadFile] = File(None),
    is_anonymous = Optional[bool],
    is_general = Optional[bool],
):
    
    name = db.query(User.first_name, User.last_name, User.email).filter(User.user_id == user.user_id).first()
    
    if not monetary_donation and not in_kind_donation:
        raise HTTPException(
            status_code=400,
            detail="Please specify either monetary or in-kind donation"
        )
    
    if monetary_donation and in_kind_donation:
        raise HTTPException(
            status_code=400,
            detail="Cannot process both donation types simultaneously"
        )
    
    if monetary_donation:
        if amount is None or amount <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid amount"
                )
        if not direct_maya:
            proof_of_payment = await upload_proof(db, proof)
            
            monetary = MonetaryDonation(
                date_donated = datetime.now(timezone.utc),
                amount = amount,
                drive_id = drive.drive_id,
                user_id = user.user_id,
                is_anonymous = is_anonymous if is_anonymous else False,
                proof = proof_of_payment,
            )
            try:
                db.add(monetary)
                db.commit()
                db.refresh(monetary)
            except Exception as e:
                raise HTTPException(status_code=500, details=e)
            
            invoice = {
                "donation_drive": drive.title,
                "date": monetary.date_donated,
                "user": f"{name.first_name} {name.last_name}" if not is_anonymous else "Anonymous",
                "status": "Pending Acknowledgement" if monetary.is_acknowledged is None else "Acknowledged" if monetary.is_acknowledged is True else "Donation Denied",
                "amount": monetary.amount,
                "email": name.email
            }
            send_email(invoice=invoice, message="Your donation will be reflected once it has been reviewed and verified by our admin team." )
            return invoice
        else:
            return await maya_donation(drive.drive_id, amount)
    
    if in_kind_donation:
        if not description:
            raise HTTPException(status_code=400, detail="Description is required for in-kind donations")
        
        in_kind = InKindDonation(
            date_donated = datetime.now(timezone.utc),
            description = description,
            drive_id = drive.drive_id,
            user_id = user.user_id
        )
        try:
            db.add(in_kind)
            db.commit()
            db.refresh(in_kind)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, details=e)

        invoice = {
            "donation_drive": drive.title,
            "date": in_kind.date_donated,
            "user": f"{name.first_name} {name.last_name}",
            "status": "Pending Acknowledgement" if in_kind.is_acknowledged is None else "Acknowledged" if in_kind.is_acknowledged is True else "Donation Denied",
            "details": in_kind.description,
            "email" : name.email
        }

        send_email(invoice=invoice, message="Your donation will be reflected once it has been reviewed and verified by our admin team." )
        return invoice


async def anonymous_donation(
    db: Session,
    drive: DonationDrive,
    monetary_donation: bool = False,
    direct_maya: Optional[bool] = None,
    amount: Optional[float] = None,
    proof: Optional[UploadFile] = File(None),
    is_anonymous = Optional[bool],
):
    
    if monetary_donation:
        if amount is None or amount <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid amount"
                )
        if not direct_maya:
            proof_of_payment = await upload_proof(db, proof)
            
            monetary = MonetaryDonation(
                date_donated = datetime.now(timezone.utc),
                amount = amount,
                drive_id = drive.drive_id,
                is_anonymous = is_anonymous if is_anonymous else False,
                proof = proof_of_payment,
            )
            try:
                db.add(monetary)
                db.commit()
                db.refresh(monetary)
            except Exception as e:
                raise HTTPException(status_code=500, details=e)
            
            invoice = {
                "donation_drive": drive.title,
                "date": monetary.date_donated,
                "user": "Anonymous",
                "status": "Pending Acknowledgement" if monetary.is_acknowledged is None else "Acknowledged" if monetary.is_acknowledged is True else "Donation Denied",
                "amount": monetary.amount
            }
            return invoice
        else:
            return await maya_donation(drive.drive_id, amount)


def maya_success(drive: DonationDrive, amount: float, is_anonymous: bool, db: Session, user: Optional[CurrentUser]):
    
    if user is not None:
        name = db.query(User.first_name, User.last_name, User.email).filter(User.user_id == user.user_id).first()
    else:
        name = None
    monetary = MonetaryDonation(
                date_donated = datetime.now(timezone.utc),
                amount = amount,
                drive_id = drive.drive_id,
                user_id = user.user_id if not is_anonymous else None,
                is_acknowledged = True,
                is_anonymous = is_anonymous
            )
    try:
        db.add(monetary)
        db.commit()
        db.refresh(monetary)
    except Exception as e:
        raise HTTPException(status_code=500, details=e)
    
    invoice = {
        "donation_drive": drive.title,
        "date": monetary.date_donated,
        "user": f"{name.first_name} {name.last_name}" if user else "Anonymous",
        "status": "Pending Acknowledgement" if monetary.is_acknowledged is None else "Acknowledged" if monetary.is_acknowledged is True else "Donation Denied",
        "amount": monetary.amount,
        "email": name.email if user else "Anonymous"

    }
    if user:
        send_email(invoice=invoice, message="Your donation will be reflected shortly. Donations made through Maya are processed automatically and does not require admin verification.")
    return invoice

def send_email(invoice, message):
    try:
        api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))
        subject = f"ICS-STAR Invoice"
        sender = email_sender

        html_content = invoice_message(
            message=message,
            status=invoice['status'],
            donation_drive=invoice['donation_drive'],
            date=invoice['date'],
            details=invoice.get('details'),  
            amount=invoice.get('amount')
        )
        to = [{"email": invoice['email'], 'name': invoice['user']}]
        send_smtp_email = brevo_python.SendSmtpEmail(to=to, html_content=html_content, sender=sender, subject=subject)

        try:
            print("before execute")
            api_response = api_instance.send_transac_email(send_smtp_email)
            return {"message": api_response}
        except ApiException as e:
            print(f"Error: {e}")


    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error: {e}")