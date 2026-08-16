import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiMailLine, RiLockPasswordLine, RiArrowRightLine, RiDnaLine,
  RiEyeLine, RiEyeOffLine, RiShieldCheckLine, RiMicroscopeLine, RiFileTextLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const brandFeatures = [
  { icon: RiMicroscopeLine, text: '81.56% validation accuracy' },
  { icon: RiFileTextLine,   text: 'Gemini 2.5 Flash medical reports' },
  { icon: RiShieldCheckLine, text: 'HIPAA-aligned data security' },
]

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)

  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4">
      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/[0.06] dark:bg-primary-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/[0.05] dark:bg-teal-500/[0.07] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_-20px_rgba(15,23,42,0.22)] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row">

          {/* ── Left Brand Panel ── */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-900 via-[#0d1f4a] to-slate-950 relative overflow-hidden flex-shrink-0 w-[42%]">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/15 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/12 rounded-full blur-[60px] pointer-events-none" />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-button">
                  <RiDnaLine className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-white text-lg tracking-tight">SkinDegies AI</span>
              </div>

              <h2 className="font-display font-bold text-3xl text-white leading-tight mb-4">
                Clinical AI<br />Skin Analysis
              </h2>
              <p className="text-slate-300/80 text-sm leading-relaxed mb-8">
                Advanced dermatological AI for rapid skin disease detection and structured medical reporting.
              </p>

              <div className="space-y-3">
                {brandFeatures.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary-300" />
                    </div>
                    <span className="text-slate-300/90 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom trust line */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 pt-6 border-t border-white/10">
                <RiShieldCheckLine className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-slate-400 text-xs">HIPAA-aligned · Encrypted · Rate-limited</span>
              </div>
            </div>
          </div>

          {/* ── Right Form Panel ── */}
          <div className="flex-1 bg-white dark:bg-slate-900/95 p-8 sm:p-12 flex flex-col justify-center">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-button">
                <RiDnaLine className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-lg">SkinDegies AI</span>
            </div>

            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                Sign in to your clinical skin analysis workspace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
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
                    className="input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm mt-2"
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
            </form>

            <div className="mt-7 pt-6 border-t border-slate-200/70 dark:border-slate-800/70 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Create free account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
