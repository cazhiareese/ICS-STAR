from typing import List
import brevo_python
from brevo_python.rest import ApiException
from fastapi import HTTPException
from .emailing.invitation import invitation
from .admin_events_util import get_event_by_id_util
from config.config import brevo_configuration, email_sender
from sqlalchemy.orm import Session
from sqlalchemy import UUID


def send_email_util (eventId: UUID, recipients: List[dict], db: Session):
    print(recipients)
    try:
        event = get_event_by_id_util(eventId=eventId, db=db)
        eventContents = {
            "title": event["title"],
            "image": event["image"],
            "description": event["description"],
            "location": event["location"],
            "datetime": event["datetime"]
        }
        print(recipients)
        finalImage = eventContents['image'] if eventContents.get('image') else 'https://rtyworjvisvjmixvxwmc.supabase.co/storage/v1/object/public/128storage/emailing_assets/default.jpg'
        api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))
        subject = f"ICS-STAR invites you to: {eventContents['title']}"
        sender = email_sender
        html_content = invitation(title=eventContents['title'], location=eventContents['location'], image=finalImage, description= eventContents['description'], )
        to = [email_sender]
        bcc=recipients
        send_smtp_email = brevo_python.SendSmtpEmail(to=to, bcc=bcc, html_content=html_content, sender=sender, subject=subject)

        try:
            print("before execute")
            api_response = api_instance.send_transac_email(send_smtp_email)
            return {"message": api_response}
        except ApiException as e:
            print(f"Error: {e}")


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")