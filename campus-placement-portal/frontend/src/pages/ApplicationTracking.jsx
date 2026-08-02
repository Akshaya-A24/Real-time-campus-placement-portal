import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import { getApplications } from '../services/api'

export default function ApplicationTracking() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getApplications()
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
            Application Tracking
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Track the status of every company you've applied to
          </p>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white shadow-card">
          {loading ? (
            <p className="p-6 text-sm text-ink-500">Loading applications…</p>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-50 text-ink-500">
                <ClipboardList size={20} />
              </div>
              <p className="text-sm font-medium text-ink-900">
                No applications yet
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Applications you submit will show up here
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-ink-500">
                    Company Name
                  </th>
                  <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-ink-500">
                    Application Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 text-sm font-medium text-ink-900">
                      {app.company_name}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
