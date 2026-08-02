import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CompanyCard from '../components/CompanyCard'
import { getCompanies, getApplications } from '../services/api'

export default function CompanyDashboard() {
  const studentRaw = localStorage.getItem('student')
  const student = studentRaw ? JSON.parse(studentRaw) : null

  const [companies, setCompanies] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const [companiesRes, applicationsRes] = await Promise.all([
      getCompanies(),
      getApplications(),
    ])
    setCompanies(companiesRes.data)
    setApplications(applicationsRes.data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const applicationByCompany = (companyId) =>
    applications.find((a) => a.company_id === companyId)

  if (!student) return null

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
            Companies
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Browse open roles and check your eligibility before applying
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-ink-500">Loading companies…</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                student={student}
                application={applicationByCompany(company.id)}
                onApplied={loadData}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
