import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiLockPasswordLine, RiArrowRightLine, RiKeyLine, RiArrowLeftLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token }                           = useParams()
  const navigate                            = useNavigate()
  const [password, setPassword]             = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw]                 = useState(false)
  const [loading, setLoading]               = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) return toast.error('Passwords do not match.')
    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${token}`, { password })
      toast.success('Password reset successfully! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed or token expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-16 px-4 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-primary-500/[0.06] dark:bg-primary-500/[0.08] rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="auth-card">
          <div className="text-center mb-8">
            <div className="relative w-14 h-14 mx-auto mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-button" />
              <div className="relative w-full h-full rounded-2xl flex items-center justify-center">
                <RiKeyLine className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              Enter your new secure password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="reset-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="reset-confirm-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="input pl-10"
                />
              </div>
            </div>

            <button
              id="reset-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting Password...
                </span>
              ) : (
                <>
                  <span>Reset Password</span>
                  <RiArrowRightLine className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-5 border-t border-slate-200/60 dark:border-slate-800/60">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <RiArrowLeftLine className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
