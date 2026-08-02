**# Real-time-campus-placement-portal**

A full-stack placement portal where students log in, browse participating companies, check their eligibility, apply, track application status, and view portal-wide analytics.

Frontend: React + Vite + Tailwind CSS + React Router + Axios Backend: FastAPI + SQLAlchemy + SQLite + JWT Auth Email: FastAPI-Mail (SMTP)

**Project Structure**

campus-placement-portal/

├── frontend/

│   ├── src/

│   │   ├── components     # Navbar, CompanyCard, StatusBadge, ResumeUpload, StatCard, ProtectedRoute

│   │   ├── pages/             # Login, StudentDashboard, CompanyDashboard, ApplicationTracking, AnalyticsDashboard

│   │   ├── services/api.js    # Axios instance + all API calls

│   │   ├── App.jsx

│   │   └── main.jsx

│   ├── index.html

│   ├── package.json

│   ├── vite.config.js

│   └── tailwind.config.js

│
├── backend/

│   ├── app/

│   │   ├── routes/            # auth, companies, resume, eligibility, applications, email, analytics

│   │   ├── models/             # student, company, application (SQLAlchemy)

│   │   ├── database/            # DB engine/session + SQLite file (generated on first run)

│   │   ├── utils/              # auth.py (JWT/bcrypt), email.py, config.py

│   │   ├── uploads/             # uploaded resume PDFs land here

│   │   └── main.py

│   ├── requirements.txt

│   └── .env.example

│
└── README.md

**1. Backend Setup**

cd backend

python -m venv venv


# Activate the virtual environment

source venv/bin/activate        # macOS/Linux

venv\Scripts\activate           # Windows

pip install -r requirements.txt

# Copy the environment template and edit it

cp .env.example .env            # macOS/Linux

copy .env.example .env          # Windows

Open .env and set:

SECRET_KEY — any long random string (used to sign JWTs)

MAIL_USERNAME / MAIL_PASSWORD / MAIL_FROM / MAIL_SERVER / MAIL_PORT — your SMTP credentials (e.g. a Gmail App Password)

Note: If SMTP credentials are left as placeholders, the app still runs normally — email sending is skipped instead of failing the request, so you can develop and test everything without a mail account.

Run the server:

uvicorn app.main:app --reload
The API will be available at http://127.0.0.1:8000. Interactive API docs are at http://127.0.0.1:8000/docs.

On first startup, the SQLite database is created automatically at backend/app/database/placement_portal.db and seeded with 3 demo students and 4 demo companies.

Demo login: aarav.sharma@student.edu / password123

**2. Frontend Setup**

cd frontend

npm install

npm run dev

The app will be available at http://127.0.0.1:5173.

The frontend expects the backend to be running at http://127.0.0.1:8000 (configured in frontend/src/services/api.js).

**3. Feature Overview**

**Feature	Description**

Student Login	Email/password login, JWT-based session

Company Dashboard	Company name, description, job openings, eligibility criteria, deadline

Resume Upload	Upload/replace a PDF resume, stored server-side

Eligibility Checker	Checks CGPA, department, and graduation year against a company's criteria

Application Tracking	Apply to eligible companies, track status (Applied / Under Review / Shortlisted / Rejected)

Email Notifications	Sent on application submission and on status updates

Analytics Dashboard	Total companies, total applications, eligible applications, shortlisted applications

**4. API Reference**

Method	Endpoint	Description

POST	/login	Authenticate a student, returns a JWT

GET	/companies	List all companies

POST	/upload-resume	Upload a PDF resume (multipart/form-data)

POST	/check-eligibility	Check eligibility for a company

POST	/apply	Apply to an eligible company

GET	/applications	List the current student's applications

POST	/send-email	Update an application's status and send a notification email

GET	/analytics	Portal-wide summary statistics

All endpoints except /login require an Authorization: Bearer <token> header.

**5. Notes**

Passwords are hashed with bcrypt before being stored.

The SQLite database file and uploaded resumes are excluded from version control by .gitignore and will be created/populated as you use the app.

CORS is pre-configured on the backend to allow requests from the Vite dev server (http://localhost:5173).
