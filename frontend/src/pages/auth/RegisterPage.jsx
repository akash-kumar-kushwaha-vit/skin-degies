import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiUserLine, RiMailLine, RiLockPasswordLine, RiArrowRightLine, RiDnaLine,
  RiEyeLine, RiEyeOffLine, RiCheckLine, RiShieldCheckLine, RiMicroscopeLine,
  RiBarChartLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const brandFeatures = [
  { icon: RiMicroscopeLine, text: '22 detectable skin conditions' },
  { icon: RiBarChartLine,  text: '89.75% top-3 accuracy score' },
  { icon: RiShieldCheckLine, text: 'Enterprise-grade data security' },
]

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars',  ok: password.length >= 8 },
    { label: 'Lowercase', ok: /[a-z]/.test(password) },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number',    ok: /[0-9]/.test(password) },
  ]
  if (!password) return null
  const score = checks.filter(c => c.ok).length
  const barColor = score <= 1 ? 'bg-rose-500' : score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-yellow-500' : 'bg-emerald-500'

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-300 ${n <= score ? barColor : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {checks.map(({ label, ok }) => (
          <span key={label} className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
            <span className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${ok ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
              {ok && <RiCheckLine className="w-2 h-2 text-white" />}
            </span>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate     = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4">
      {/* Ambient glows */}
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.06] dark:bg-teal-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[350px] h-[350px] bg-primary-500/[0.05] dark:bg-primary-500/[0.07] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-3xl shadow-[0_20px_60px_-20px_rgba(15,23,42,0.22)] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row">

          {/* ── Left Brand Panel ── */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0d2440] via-[#0d2035] to-slate-950 relative overflow-hidden flex-shrink-0 w-[42%]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/15 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/12 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-primary-600 flex items-center justify-center shadow-button">
                  <RiDnaLine className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-white text-lg tracking-tight">SkinDegies AI</span>
              </div>

              <h2 className="font-display font-bold text-3xl text-white leading-tight mb-4">
                Start Your Free<br />Clinical Account
              </h2>
              <p className="text-slate-300/80 text-sm leading-relaxed mb-8">
                Get instant access to AI-powered skin disease detection and professional medical reports.
              </p>

              <div className="space-y-3">
                {brandFeatures.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-teal-300" />
                    </div>
                    <span className="text-slate-300/90 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 pt-6 border-t border-white/10">
                <RiShieldCheckLine className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-slate-400 text-xs">Free to start · No credit card required</span>
              </div>
            </div>
          </div>

          {/* ── Right Form Panel ── */}
          <div className="flex-1 bg-white dark:bg-slate-900/95 p-8 sm:p-12 flex flex-col justify-center">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-primary-600 flex items-center justify-center shadow-button">
                <RiDnaLine className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-lg">SkinDegies AI</span>
            </div>

            <div className="mb-7">
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                Join SkinDegies AI for clinical skin lesion analysis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="register-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. John Doe"
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="register-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    id="register-email"
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
                <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    id="register-password"
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
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
                <PasswordStrength password={password} />
              </div>

              {/* Submit */}
              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-slate-200/70 dark:border-slate-800/70 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
