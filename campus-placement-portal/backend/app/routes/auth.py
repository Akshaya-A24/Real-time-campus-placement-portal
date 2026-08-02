"""Login route — authenticates a student and returns a JWT access token."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.utils.auth import verify_password, create_access_token

router = APIRouter(tags=["Authentication"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class StudentOut(BaseModel):
    id: int
    name: str
    email: str
    department: str
    cgpa: float
    graduation_year: int
    resume_path: str | None = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    student: StudentOut


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == payload.email).first()

    if not student or not verify_password(payload.password, student.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(data={"sub": str(student.id)})

    return LoginResponse(
        access_token=access_token,
        student=StudentOut.model_validate(student),
    )
