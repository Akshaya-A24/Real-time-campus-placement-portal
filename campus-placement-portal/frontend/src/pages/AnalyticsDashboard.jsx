import { useEffect, useState } from 'react'
import { Building2, FileStack, CheckCircle2, Trophy } from 'lucide-react'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import { getAnalytics } from '../services/api'

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
      .then((res) => setAnalytics(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
            Analytics
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            A quick snapshot of placement activity across the portal
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-ink-500">Loading analytics…</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Companies"
              value={analytics.total_companies}
              icon={Building2}
            />
            <StatCard
              label="Total Applications"
              value={analytics.total_applications}
              icon={FileStack}
            />
            <StatCard
              label="Eligible Applications"
              value={analytics.eligible_applications}
              icon={CheckCircle2}
            />
            <StatCard
              label="Shortlisted Applications"
              value={analytics.shortlisted_applications}
              icon={Trophy}
            />
          </div>
        )}
      </main>
    </div>
  )
}
