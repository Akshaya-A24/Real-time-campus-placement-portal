import { NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LogOut } from 'lucide-react'

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
    isActive
      ? 'bg-primary-50 text-primary-600'
      : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
  }`

export default function Navbar() {
  const navigate = useNavigate()
  const studentRaw = localStorage.getItem('student')
  const student = studentRaw ? JSON.parse(studentRaw) : null

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('student')
    navigate('/login')
  }

  if (!student) return null

  return (
    <header className="sticky top-0 z-10 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <GraduationCap className="h-4.5 w-4.5 text-white" size={18} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-ink-900">
            Placement Portal
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/dashboard" className={navLinkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/companies" className={navLinkClass}>
            Companies
          </NavLink>
          <NavLink to="/applications" className={navLinkClass}>
            Applications
          </NavLink>
          <NavLink to="/analytics" className={navLinkClass}>
            Analytics
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-500 sm:inline">
            {student.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition-colors duration-150 hover:border-ink-300 hover:bg-ink-50"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-ink-100 px-6 py-2 md:hidden">
        <NavLink to="/dashboard" className={navLinkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/companies" className={navLinkClass}>
          Companies
        </NavLink>
        <NavLink to="/applications" className={navLinkClass}>
          Applications
        </NavLink>
        <NavLink to="/analytics" className={navLinkClass}>
          Analytics
        </NavLink>
      </nav>
    </header>
  )
}
