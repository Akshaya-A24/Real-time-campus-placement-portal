import { useState } from 'react'
import { Building2, Calendar, GraduationCap, Percent, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { checkEligibility, applyToCompany, sendStatusEmail } from '../services/api'

export default function CompanyCard({ company, student, application, onApplied }) {
  const [eligibility, setEligibility] = useState(null)
  const [checking, setChecking] = useState(false)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState('')

  const handleCheckEligibility = async () => {
    setChecking(true)
    setError('')
    try {
      const res = await checkEligibility(student.id, company.id)
      setEligibility(res.data)
    } catch (err) {
      setError('Could not check eligibility. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const handleApply = async () => {
    setApplying(true)
    setError('')
    try {
      const res = await applyToCompany(student.id, company.id)
      // Trigger the "Applied" status email notification.
      await sendStatusEmail(res.data.id, 'Applied')
      onApplied()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not submit application.')
    } finally {
      setApplying(false)
    }
  }

  const alreadyApplied = Boolean(application)

  return (
    <div className="group rounded-xl border border-ink-200 bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-ink-900">
              {company.company_name}
            </h3>
            <p className="mt-0.5 text-sm text-ink-500 line-clamp-2">
              {company.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-ink-100 pt-4 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm text-ink-700">
          <Percent size={14} className="text-ink-300" />
          <span>Min CGPA: {company.minimum_cgpa}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-700">
          <GraduationCap size={14} className="text-ink-300" />
          <span>{company.department}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-700">
          <Calendar size={14} className="text-ink-300" />
          <span>Deadline: {company.deadline}</span>
        </div>
      </div>

      {eligibility && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${
            eligibility.eligible
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {eligibility.eligible ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <div>
            <p className="font-medium">{eligibility.status}</p>
            {eligibility.reasons?.length > 0 && (
              <ul className="mt-1 list-disc pl-4 text-xs opacity-90">
                {eligibility.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-rose-600">{error}</p>
      )}

      <div className="mt-5 flex items-center gap-3">
        {alreadyApplied ? (
          <span className="inline-flex items-center rounded-lg bg-ink-100 px-3.5 py-2 text-sm font-medium text-ink-500">
            Already Applied — {application.status}
          </span>
        ) : (
          <>
            <button
              onClick={handleCheckEligibility}
              disabled={checking}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors duration-150 hover:border-ink-300 hover:bg-ink-50 disabled:opacity-60"
            >
              {checking && <Loader2 size={14} className="animate-spin" />}
              Check Eligibility
            </button>
            <button
              onClick={handleApply}
              disabled={applying || (eligibility && !eligibility.eligible)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying && <Loader2 size={14} className="animate-spin" />}
              Apply Now
            </button>
          </>
        )}
      </div>
    </div>
  )
}
