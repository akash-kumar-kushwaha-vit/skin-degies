import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { RiCheckLine, RiMailSendLine, RiShieldCheckLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const token = searchParams.get('token')
  const [email, setEmail] = useState(location.state?.email || searchParams.get('email') || '')
  const [status, setStatus] = useState(token ? 'verifying' : 'waiting')
  const [resending, setResending] = useState(false)
  const developmentVerification = location.state?.developmentVerification

  useEffect(() => {
    if (!token) return

    let active = true
    api.post('/auth/verify-email', { token })
      .then(() => {
        if (active) setStatus('verified')
      })
      .catch((err) => {
        if (active) {
          setStatus('invalid')
          toast.error(err.response?.data?.message || 'This verification link could not be confirmed.')
        }
      })

    return () => {
      active = false
    }
  }, [token])

  const resendVerification = async (event) => {
    event.preventDefault()
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

  const verified = status === 'verified'

  return (
    <div className="min-h-[76vh] flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#0c111d] dark:shadow-black/20">
        <div className="relative isolate overflow-hidden bg-slate-950 px-7 py-8 text-white sm:px-10">
          <img
            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=85"
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-blue-950/70" />
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-blue-300 backdrop-blur">
            {verified ? <RiCheckLine className="h-6 w-6" /> : <RiMailSendLine className="h-6 w-6" />}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">SkinDegies AI</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {verified ? 'You’re all set' : status === 'verifying' ? 'Confirming your email' : 'Check your inbox'}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
            {verified
              ? developmentVerification
                ? 'SMTP is not configured in this local development environment. Your development verification is complete; sign in to continue.'
                : 'Your email is verified. Sign in to continue to your clinical workspace.'
              : status === 'verifying'
                ? 'We’re securely checking your verification link.'
                : status === 'invalid'
                  ? 'That link is invalid or has expired. Request a fresh link below.'
                  : 'We sent a secure verification link to your email. Verify your address before signing in.'}
          </p>
        </div>

        <div className="p-7 sm:p-10">
          {verified ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                <RiShieldCheckLine className="mt-0.5 h-5 w-5 shrink-0" />
                <p>Email verification is complete. Your account is ready to use.</p>
              </div>
              <Link to="/login" className="btn-primary w-full py-3">
                Continue to sign in
              </Link>
            </div>
          ) : (
            <>
              {email && (
                <p className="mb-5 break-all text-center text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {email}
                </p>
              )}
              <form onSubmit={resendVerification} className="space-y-3">
                {!email && (
                  <div className="space-y-1.5">
                    <label htmlFor="verification-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Email address
                    </label>
                    <input
                      id="verification-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="input"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={resending || !email || status === 'verifying'}
                  className="btn-primary w-full py-3"
                >
                  {resending ? 'Sending a new link…' : 'Resend verification email'}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                Already verified?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
