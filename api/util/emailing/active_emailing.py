import asyncio
from datetime import datetime, timedelta
from typing import Dict
import os
from supabase import create_client, Client
import brevo_python
from brevo_python.rest import ApiException
from api.util.emailing.inactive import inactivity  
from dotenv import load_dotenv

load_dotenv()
brevo_configuration = brevo_python.Configuration()
brevo_configuration.api_key['api-key'] = os.getenv("BREVO_API")
email_sender = {"name": "ICS-STAR", "email": "icsstar128@gmail.com"}
SUPABASE_URL = os.getenv("STORAGE_URL")
SUPABASE_KEY = os.getenv("STORAGE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def check_inactive_then_email() -> bool:
    try:
        one_year_ago = datetime.now() - timedelta(days=365)
        one_year_ago_iso = one_year_ago.isoformat()

        # Fetch inactive alumni from Supabase
        response = (
            supabase.table("users")
            .select("first_name, last_name, email, updated_at, user_type, is_verified")
            .lt("updated_at", one_year_ago_iso)
            .eq("user_type", "alumni")
            .eq("is_verified", True)
            .execute()
        )

        inactive_users = response.data

        if not inactive_users:
            print("No inactive users found.")
            return True

        for user in inactive_users:
            inactive = {
                "name": f"{user['first_name']} {user['last_name']}",
                "email": user["email"],
            }
            await send_inactive_email(inactive)

        return True

    except Exception as e:
        print(f"Supabase error: {e}")
        return False

async def send_inactive_email(inactive: Dict) -> bool:
    api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(brevo_configuration))
    subject = "Inactivity Notice"
    sender = email_sender
    html_content = inactivity(name=inactive["name"])
    to = [{"email": inactive["email"], "name": inactive["name"]}]
    send_smtp_email = brevo_python.SendSmtpEmail(
        to=to,
        html_content=html_content,
        sender=sender,
        subject=subject
    )

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        print(f"Email sent to {inactive['email']}: {api_response}")
        return True
    except ApiException as e:
        print(f"Failed to send email to {inactive['email']}: {e}")
        return False

async def main():
    try:
        success = await check_inactive_then_email()
        print(f"Inactive user check completed: {'Success' if success else 'Failed'}")
    except Exception as e:
        print(f"Error in main: {e}")

if __name__ == "__main__":
    asyncio.run(main())
