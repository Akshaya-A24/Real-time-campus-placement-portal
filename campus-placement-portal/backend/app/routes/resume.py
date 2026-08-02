"""Resume upload route — uploads a PDF resume and stores its path."""

import os
import shutil

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.utils.auth import get_current_student

router = APIRouter(tags=["Resume"])

UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads"
)
os.makedirs(UPLOAD_DIR, exist_ok=True)


class ResumeUploadResponse(BaseModel):
    message: str
    resume_filename: str


@router.post("/upload-resume", response_model=ResumeUploadResponse)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )

    filename = f"student_{current_student.id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_student.resume_path = filename
    db.commit()
    db.refresh(current_student)

    return ResumeUploadResponse(
        message="Resume uploaded successfully", resume_filename=filename
    )
