"""Eligibility route — checks a student's eligibility for a company."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.models.company import Company
from app.utils.auth import get_current_student

router = APIRouter(tags=["Eligibility"])


class EligibilityRequest(BaseModel):
    student_id: int
    company_id: int


class EligibilityResponse(BaseModel):
    eligible: bool
    status: str
    reasons: list[str] = []


@router.post("/check-eligibility", response_model=EligibilityResponse)
def check_eligibility(
    payload: EligibilityRequest,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    company = db.query(Company).filter(Company.id == payload.company_id).first()

    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    reasons = []

    if student.cgpa < company.minimum_cgpa:
        reasons.append(
            f"CGPA {student.cgpa} is below the required minimum of {company.minimum_cgpa}"
        )

    if student.department.strip().lower() != company.department.strip().lower():
        reasons.append(
            f"Department {student.department} does not match required department {company.department}"
        )

    if student.graduation_year != company.graduation_year:
        reasons.append(
            f"Graduation year {student.graduation_year} does not match required year {company.graduation_year}"
        )

    is_eligible = len(reasons) == 0

    return EligibilityResponse(
        eligible=is_eligible,
        status="Eligible" if is_eligible else "Not Eligible",
        reasons=reasons,
    )
