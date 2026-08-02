"""Companies route — returns the list of available companies."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.company import Company
from app.utils.auth import get_current_student
from app.models.student import Student

router = APIRouter(tags=["Companies"])


class CompanyOut(BaseModel):
    id: int
    company_name: str
    description: str
    department: str
    minimum_cgpa: float
    graduation_year: int
    deadline: str

    class Config:
        from_attributes = True


@router.get("/companies", response_model=list[CompanyOut])
def get_companies(
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    companies = db.query(Company).order_by(Company.id).all()
    return companies
