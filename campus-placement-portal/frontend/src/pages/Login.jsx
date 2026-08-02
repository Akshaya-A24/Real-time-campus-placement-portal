import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Loader2 } from 'lucide-react'
import { login } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('student', JSON.stringify(res.data.student))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-900">
            Campus Placement Portal
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Sign in with your student account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-ink-200 bg-white p-7 shadow-card"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@student.edu"
                className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-500">
          Demo account: aarav.sharma@student.edu / password123
        </p>
      </div>
    </div>
  )
}
