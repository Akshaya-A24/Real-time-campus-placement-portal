"""
Email notification utility built on fastapi-mail.

Sends application-related notifications:
- Successful application submission
- Application status updates

If SMTP credentials are not configured (MAIL_USERNAME empty), emails are
skipped gracefully instead of crashing the request — useful for local
development without a mail account.
"""

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

from app.utils.config import (
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM,
    MAIL_PORT,
    MAIL_SERVER,
    MAIL_FROM_NAME,
)

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_FROM_NAME=MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


async def send_application_email(
    to_email: str, subject: str, body: str
) -> bool:
    """
    Send an email notification. Returns True if sent, False if skipped or
    failed. Never raises — a broken/unconfigured SMTP setup must not break
    the application flow (applying, status updates, etc.) that triggered it.
    """
    if not MAIL_USERNAME or not MAIL_PASSWORD or "your-email" in MAIL_USERNAME:
        # SMTP not configured — skip silently so the app still works locally.
        return False

    try:
        message = MessageSchema(
            subject=subject,
            recipients=[to_email],
            body=body,
            subtype=MessageType.plain,
        )
        fm = FastMail(conf)
        await fm.send_message(message)
        return True
    except Exception:
        # Log in a real deployment; for this project we simply avoid
        # failing the parent request because of a mail delivery issue.
        return False


def application_submitted_body(student_name: str, company_name: str) -> str:
    return (
        f"Hi {student_name},\n\n"
        f"Your application to {company_name} has been submitted successfully.\n"
        f"You can track its status from your Application Tracking dashboard.\n\n"
        f"Regards,\nCampus Placement Portal"
    )


def application_status_body(student_name: str, company_name: str, status: str) -> str:
    return (
        f"Hi {student_name},\n\n"
        f"Your application status for {company_name} has been updated to: {status}.\n\n"
        f"Regards,\nCampus Placement Portal"
    )
