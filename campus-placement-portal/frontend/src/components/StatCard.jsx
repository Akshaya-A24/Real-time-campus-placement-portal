export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-500">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-ink-900">
        {value}
      </p>
    </div>
  )
}
