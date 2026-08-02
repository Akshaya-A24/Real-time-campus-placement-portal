import { useRef, useState } from 'react'
import { FileText, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react'
import { uploadResume } from '../services/api'

export default function ResumeUpload({ currentFilename, onUploaded }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const res = await uploadResume(file)
      onUploaded(res.data.resume_filename)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-ink-900">Resume</h3>
          <p className="text-sm text-ink-500">
            {currentFilename ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 size={14} />
                {currentFilename}
              </span>
            ) : (
              'No resume uploaded yet'
            )}
          </p>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-700 disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <UploadCloud size={15} />
        )}
        {currentFilename ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
