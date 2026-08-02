"""
Email route — sends application status update notifications.

This endpoint is used whenever an application's status changes
(Under Review, Shortlisted, Rejected) to notify the student by email.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.models.application import Application
from app.utils.auth import get_current_student
from app.utils.email import send_application_email, application_status_body

router = APIRouter(tags=["Email"])

ALLOWED_STATUSES = {"Applied", "Under Review", "Shortlisted", "Rejected"}


class SendEmailRequest(BaseModel):
    application_id: int
    status: str


class SendEmailResponse(BaseModel):
    message: str
    email_sent: bool


@router.post("/send-email", response_model=SendEmailResponse)
async def send_email(
    payload: SendEmailRequest,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of {sorted(ALLOWED_STATUSES)}",
        )

    application = (
        db.query(Application).filter(Application.id == payload.application_id).first()
    )
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    application.status = payload.status
    db.commit()
    db.refresh(application)

    student = application.student
    company = application.company

    sent = await send_application_email(
        to_email=student.email,
        subject="Application Status Update",
        body=application_status_body(student.name, company.company_name, payload.status),
    )

    return SendEmailResponse(
        message=f"Application status updated to {payload.status}",
        email_sent=sent,
    )
