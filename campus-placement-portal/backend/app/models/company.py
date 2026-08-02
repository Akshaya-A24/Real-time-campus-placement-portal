from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department = Column(String, nullable=False)  # required eligible department
    minimum_cgpa = Column(Float, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    deadline = Column(String, nullable=False)  # stored as ISO date string (YYYY-MM-DD)

    applications = relationship("Application", back_populates="company")
