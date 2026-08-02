import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Attach the JWT token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token is invalid/expired, clear session and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('student')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const login = (email, password) =>
  api.post('/login', { email, password })

export const getCompanies = () => api.get('/companies')

export const uploadResume = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const checkEligibility = (studentId, companyId) =>
  api.post('/check-eligibility', { student_id: studentId, company_id: companyId })

export const applyToCompany = (studentId, companyId) =>
  api.post('/apply', { student_id: studentId, company_id: companyId })

export const getApplications = () => api.get('/applications')

export const sendStatusEmail = (applicationId, status) =>
  api.post('/send-email', { application_id: applicationId, status })

export const getAnalytics = () => api.get('/analytics')

export default api
