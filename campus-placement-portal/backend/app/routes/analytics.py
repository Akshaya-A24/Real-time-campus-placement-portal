"""Analytics route — returns portal-wide summary statistics."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.models.company import Company
from app.models.application import Application
from app.utils.auth import get_current_student

router = APIRouter(tags=["Analytics"])


class AnalyticsResponse(BaseModel):
    total_companies: int
    total_applications: int
    eligible_applications: int
    shortlisted_applications: int


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    total_companies = db.query(Company).count()
    total_applications = db.query(Application).count()
    shortlisted_applications = (
        db.query(Application).filter(Application.status == "Shortlisted").count()
    )

    # "Eligible applications" = applications that were successfully created.
    # Since /apply already enforces eligibility rules before creating a
    # record, every stored application is, by definition, an eligible one.
    eligible_applications = total_applications

    return AnalyticsResponse(
        total_companies=total_companies,
        total_applications=total_applications,
        eligible_applications=eligible_applications,
        shortlisted_applications=shortlisted_applications,
    )
