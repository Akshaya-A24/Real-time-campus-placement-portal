from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("student_id", "company_id", name="uq_student_company"),
    )

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    status = Column(String, nullable=False, default="Applied")
    # Allowed status values: Applied, Under Review, Shortlisted, Rejected

    student = relationship("Student", back_populates="applications")
    company = relationship("Company", back_populates="applications")
