import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiMailLine, RiArrowRightLine, RiArrowLeftLine, RiKeyLine, RiCheckLine } from 'react-icons/ri'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
      toast.success('Reset link dispatched if account exists.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request reset link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card-base p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
            <RiKeyLine className="w-5 h-5" />
          </div>
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Forgot Password?
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <RiCheckLine className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Check your email</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Instructions have been sent to <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>.
              </p>
            </div>
            <Link to="/login" className="btn-secondary w-full text-xs py-2.5 rounded-lg inline-flex items-center justify-center gap-1.5">
              <RiArrowLeftLine className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  className="input pl-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs sm:text-sm rounded-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Link...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Send Reset Link
                  <RiArrowRightLine className="w-4 h-4" />
                </span>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1">
                <RiArrowLeftLine className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
