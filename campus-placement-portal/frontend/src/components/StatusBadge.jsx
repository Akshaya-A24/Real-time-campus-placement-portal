const STATUS_STYLES = {
  Applied: 'bg-primary-50 text-primary-700',
  'Under Review': 'bg-amber-50 text-amber-700',
  Shortlisted: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-rose-50 text-rose-700',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-ink-100 text-ink-700'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  )
}
