import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  RiUserLine, RiMailLine, RiLockPasswordLine, RiArrowRightLine, RiDnaLine,
  RiEyeLine, RiEyeOffLine, RiCheckLine, RiShieldCheckLine, RiMicroscopeLine,
  RiBarChartLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const brandFeatures = [
  { icon: RiMicroscopeLine, text: '22 detectable skin lesion conditions' },
  { icon: RiBarChartLine, text: '89.75% top-3 differential accuracy' },
  { icon: RiShieldCheckLine, text: 'HIPAA-aligned data protocols' },
]

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars', ok: password.length >= 8 },
    { label: 'Lowercase', ok: /[a-z]/.test(password) },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ]
  if (!password) return null
  const score = checks.filter((c) => c.ok).length
  const barColor =
    score <= 1
      ? 'bg-rose-500'
      : score === 2
      ? 'bg-amber-500'
      : score === 3
      ? 'bg-blue-500'
      : 'bg-emerald-500'

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-all duration-200 ${
              n <= score ? barColor : 'bg-slate-200 dark:bg-white/[0.08]'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {checks.map(({ label, ok }) => (
          <span
            key={label}
            className={`flex items-center gap-1 text-[11px] font-medium ${
              ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
            }`}
          >
            {ok && <RiCheckLine className="w-3 h-3 text-emerald-500" />}
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await register(name, email, password)
      if (result.verificationToken) {
        toast.success('Email delivery is not configured locally. Completing development verification.')
        navigate(`/verify-email?token=${encodeURIComponent(result.verificationToken)}`, {
          state: { email: result.email || email, developmentVerification: true },
        })
      } else {
        toast.success('Verification link sent to your email.')
        navigate('/verify-email', { state: { email: result.email || email } })
      }
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
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
              Start Free Clinical Analysis
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-8">
              Join healthcare practitioners and researchers utilizing deep convolutional neural networks for skin lesion triage.
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
            <span>Verified email required · No card required</span>
          </div>
        </div>

        {/* ── Right Form Side ── */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Create clinician account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Begin analyzing dermatological cases with AI assistance
            </p>
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/80 px-3.5 py-3 text-xs leading-relaxed text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
              <RiMailLine className="mt-0.5 h-4 w-4 shrink-0" />
              <span>We’ll email you a secure verification link. You’ll need to verify your address before signing in.</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="reg-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Full Name
              </label>
              <div className="relative">
                <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jordan Hayes"
                  className="input pl-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="reg-email"
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
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
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
              <PasswordStrength password={password} />
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
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
