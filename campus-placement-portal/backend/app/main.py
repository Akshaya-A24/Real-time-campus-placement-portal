"""
Campus Placement Portal — FastAPI backend entry point.

Run with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine, SessionLocal
from app.models.student import Student
from app.models.company import Company
from app.utils.auth import hash_password

from app.routes import auth, companies, resume, eligibility, applications, email, analytics

app = FastAPI(
    title="Campus Placement Portal API",
    description="Backend API for the Real-Time Campus Placement Portal",
    version="1.0.0",
)

# Allow the Vite dev server (and typical local frontend ports) to call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded resumes statically (not required by the spec's routes, but
# lets a student's uploaded PDF be viewed/downloaded directly if needed).
app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(resume.router)
app.include_router(eligibility.router)
app.include_router(applications.router)
app.include_router(email.router)
app.include_router(analytics.router)


def seed_database():
    """Create tables and insert demo data if the database is empty."""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(Student).count() == 0:
            demo_students = [
                Student(
                    name="Aarav Sharma",
                    email="aarav.sharma@student.edu",
                    password=hash_password("password123"),
                    department="Computer Science",
                    cgpa=8.7,
                    graduation_year=2026,
                    resume_path=None,
                ),
                Student(
                    name="Priya Nair",
                    email="priya.nair@student.edu",
                    password=hash_password("password123"),
                    department="Electronics",
                    cgpa=7.9,
                    graduation_year=2026,
                    resume_path=None,
                ),
                Student(
                    name="Rohan Mehta",
                    email="rohan.mehta@student.edu",
                    password=hash_password("password123"),
                    department="Computer Science",
                    cgpa=6.8,
                    graduation_year=2027,
                    resume_path=None,
                ),
            ]
            db.add_all(demo_students)

        if db.query(Company).count() == 0:
            demo_companies = [
                Company(
                    company_name="Nova Systems",
                    description="A cloud infrastructure company building tools for developers.",
                    department="Computer Science",
                    minimum_cgpa=7.5,
                    graduation_year=2026,
                    deadline="2026-09-15",
                ),
                Company(
                    company_name="Arcline Robotics",
                    description="Designs and manufactures automation robotics for warehouses.",
                    department="Electronics",
                    minimum_cgpa=7.0,
                    graduation_year=2026,
                    deadline="2026-09-30",
                ),
                Company(
                    company_name="Fintra Labs",
                    description="A fintech startup building payment infrastructure for banks.",
                    department="Computer Science",
                    minimum_cgpa=8.0,
                    graduation_year=2026,
                    deadline="2026-10-10",
                ),
                Company(
                    company_name="Bridgepoint Analytics",
                    description="Data analytics consultancy serving enterprise clients.",
                    department="Computer Science",
                    minimum_cgpa=6.5,
                    graduation_year=2027,
                    deadline="2026-11-01",
                ),
            ]
            db.add_all(demo_companies)

        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    seed_database()


@app.get("/")
def root():
    return {"status": "ok", "message": "Campus Placement Portal API is running"}
