import { useState } from 'react'
import api from '../../services/api'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  RiMailLine, RiLockPasswordLine, RiArrowRightLine, RiDnaLine,
  RiEyeLine, RiEyeOffLine, RiShieldCheckLine, RiMicroscopeLine, RiFileTextLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const brandFeatures = [
  { icon: RiMicroscopeLine, text: '81.56% top-1 model accuracy' },
  { icon: RiFileTextLine, text: 'Gemini structured medical reports' },
  { icon: RiShieldCheckLine, text: 'HIPAA-aligned data protocols' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resending, setResending] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setNeedsVerification(false)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true)
      }
      toast.error(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    setResending(true)
    try {
      await api.post('/auth/resend-verification', { email })
      toast.success('If this account needs verification, a new link is on its way.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend the verification email.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c111d] shadow-sm overflow-hidden flex flex-col lg:flex-row">
        {/* ── Left Brand Side ── */}
        <div className="hidden lg:flex relative isolate flex-col justify-between p-10 bg-slate-900 text-white w-[42%] flex-shrink-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1000&q=85"
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-blue-950/70" />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <RiDnaLine className="w-4.5 h-4.5" />
              </div>
              <span className="font-display font-bold text-base tracking-tight">SkinDegies AI</span>
            </div>

            <h2 className="font-display font-bold text-2xl leading-tight mb-3 text-white">
              Clinical Workspace for Dermatology
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-8">
              High-accuracy skin lesion classification with integrated clinical context and generative reporting.
            </p>

            <div className="space-y-3.5">
              {brandFeatures.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
            <RiShieldCheckLine className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>End-to-end encrypted clinical sessions</span>
          </div>
        </div>

        {/* ── Right Form Side ── */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Sign in to workspace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your registered clinical credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  className="input pl-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10 text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs sm:text-sm rounded-xl"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {needsVerification && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                Your email address hasn’t been verified yet. Open the link we emailed you, or request a fresh one.
              </p>
              <button
                type="button"
                onClick={resendVerification}
                disabled={resending || !email}
                className="mt-2 text-xs font-semibold text-amber-800 underline underline-offset-2 disabled:opacity-50 dark:text-amber-200"
              >
                {resending ? 'Sending link…' : 'Resend verification email'}
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
