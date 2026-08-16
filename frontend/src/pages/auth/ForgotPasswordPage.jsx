import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiMailLine, RiArrowRightLine, RiArrowLeftLine, RiKeyLine, RiCheckLine } from 'react-icons/ri'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
      toast.success('Reset link sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request reset link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-16 px-4 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-teal-500/[0.06] dark:bg-teal-500/[0.08] rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative w-14 h-14 mx-auto mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-glow-teal" />
              <div className="relative w-full h-full rounded-2xl flex items-center justify-center">
                <RiKeyLine className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              Enter your email and we'll send you a secure reset link
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center mx-auto">
                <RiCheckLine className="w-7 h-7" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-semibold text-sm">Check your inbox!</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                  If an account with <span className="text-slate-900 dark:text-white font-semibold">{email}</span> exists, we've sent reset instructions.
                </p>
              </div>
              <Link to="/login" className="btn-secondary w-full justify-center text-sm">
                <RiArrowLeftLine className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="input pl-10"
                  />
                </div>
              </div>

              <button
                id="forgot-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Link...
                  </span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <RiArrowLeftLine className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
