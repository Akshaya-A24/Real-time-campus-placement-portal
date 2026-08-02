import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import ResumeUpload from '../components/ResumeUpload'
import { getCompanies } from '../services/api'

export default function StudentDashboard() {
  const studentRaw = localStorage.getItem('student')
  const [student, setStudent] = useState(
    studentRaw ? JSON.parse(studentRaw) : null
  )
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompanies()
      .then((res) => setCompanies(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleResumeUploaded = (filename) => {
    const updated = { ...student, resume_path: filename }
    setStudent(updated)
    localStorage.setItem('student', JSON.stringify(updated))
  }

  if (!student) return null

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
            Welcome back, {student.name.split(' ')[0]}
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {student.department} · Class of {student.graduation_year} · CGPA {student.cgpa}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ResumeUpload
              currentFilename={student.resume_path}
              onUploaded={handleResumeUploaded}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-card">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-ink-900">
                  Available Companies
                </h2>
                <Link
                  to="/companies"
                  className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loading ? (
                <p className="text-sm text-ink-500">Loading companies…</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {companies.slice(0, 5).map((company) => (
                    <li
                      key={company.id}
                      className="flex items-center justify-between py-3.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink-900">
                          {company.company_name}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {company.department} · Min CGPA {company.minimum_cgpa}
                        </p>
                      </div>
                      <span className="text-xs text-ink-500">
                        Deadline {company.deadline}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
