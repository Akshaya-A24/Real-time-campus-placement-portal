"""
Applications route — apply to a company and track application status.

Applying also triggers the "application submitted" email notification
(via app.utils.email), fulfilling the Email Notifications requirement
for the apply flow.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.models.company import Company
from app.models.application import Application
from app.utils.auth import get_current_student
from app.utils.email import send_application_email, application_submitted_body

router = APIRouter(tags=["Applications"])


class ApplyRequest(BaseModel):
    student_id: int
    company_id: int


class ApplicationOut(BaseModel):
    id: int
    company_id: int
    company_name: str
    status: str

    class Config:
        from_attributes = True


@router.post("/apply", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
async def apply_to_company(
    payload: ApplyRequest,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    company = db.query(Company).filter(Company.id == payload.company_id).first()

    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    # Eligibility must be satisfied before an application can be created.
    if student.cgpa < company.minimum_cgpa:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Student is not eligible: CGPA too low")
    if student.department.strip().lower() != company.department.strip().lower():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Student is not eligible: department mismatch")
    if student.graduation_year != company.graduation_year:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Student is not eligible: graduation year mismatch")

    existing = (
        db.query(Application)
        .filter(
            Application.student_id == payload.student_id,
            Application.company_id == payload.company_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already applied to this company")

    application = Application(
        student_id=payload.student_id,
        company_id=payload.company_id,
        status="Applied",
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    await send_application_email(
        to_email=student.email,
        subject="Application Submitted",
        body=application_submitted_body(student.name, company.company_name),
    )

    return ApplicationOut(
        id=application.id,
        company_id=company.id,
        company_name=company.company_name,
        status=application.status,
    )


@router.get("/applications", response_model=list[ApplicationOut])
def get_applications(
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    applications = (
        db.query(Application)
        .filter(Application.student_id == current_student.id)
        .all()
    )

    result = []
    for app_row in applications:
        result.append(
            ApplicationOut(
                id=app_row.id,
                company_id=app_row.company_id,
                company_name=app_row.company.company_name,
                status=app_row.status,
            )
        )
    return result
