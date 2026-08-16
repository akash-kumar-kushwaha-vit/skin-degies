import { Link } from 'react-router-dom'
import { RiDnaLine, RiGithubLine, RiMailLine, RiShieldCrossLine, RiCheckboxCircleLine } from 'react-icons/ri'

const platformLinks = [
  { label: 'Start AI Scan',     to: '/predict' },
  { label: 'Patient Dashboard', to: '/dashboard' },
  { label: 'Create Account',    to: '/register' },
  { label: 'Sign In',           to: '/login' },
]

const techStack = [
  'EfficientNetV2-S Model',
  'Gemini 2.5 Flash LLM',
  'FastAPI Backend',
  'React + Vite Frontend',
]

const trustItems = [
  'HIPAA-aligned data handling',
  'JWT authentication',
  'Rate-limited API endpoints',
  'Encrypted image storage',
]

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200/70 dark:border-white/[0.05]
                       bg-white/80 dark:bg-[#060b14]/90 backdrop-blur-sm">
      {/* Top accent gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="container-app pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* ── Brand Column ── */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-button">
                <RiDnaLine className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                SkinDegies <span className="gradient-brand">AI</span>
              </span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              Clinical-grade AI skin disease detection platform leveraging EfficientNetV2-S deep learning
              architecture for rapid dermatological assessment.
            </p>

            {/* Trust badges */}
            <div className="space-y-2">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <RiCheckboxCircleLine className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:support@skindegies.ai"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs
                           text-slate-500 dark:text-slate-400
                           hover:text-primary-600 dark:hover:text-primary-400
                           hover:bg-slate-100 dark:hover:bg-slate-800/50
                           border border-slate-200/60 dark:border-slate-700/40
                           transition-all duration-200"
              >
                <RiMailLine className="w-3.5 h-3.5" /> support@skindegies.ai
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs
                           text-slate-500 dark:text-slate-400
                           hover:text-primary-600 dark:hover:text-primary-400
                           hover:bg-slate-100 dark:hover:bg-slate-800/50
                           border border-slate-200/60 dark:border-slate-700/40
                           transition-all duration-200"
              >
                <RiGithubLine className="w-3.5 h-3.5" /> GitHub
              </a>
            </div>
          </div>

          {/* ── Platform Links ── */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <div className="flex flex-col gap-2.5">
              {platformLinks.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium hover:translate-x-0.5 inline-flex transition-transform duration-150"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Technology ── */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">
              Technology
            </h4>
            <div className="flex flex-col gap-2.5">
              {techStack.map((item) => (
                <span key={item} className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-600 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            {/* Accuracy callout */}
            <div className="mt-6 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-900/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Model Performance
              </p>
              <p className="font-display text-2xl font-extrabold gradient-brand">81.56%</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Validation accuracy · EfficientNetV2-S</p>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-slate-400 dark:text-slate-500 text-xs">
            © {new Date().getFullYear()} SkinDegies AI. All rights reserved. For informational & triage assistance only.
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40">
            <RiShieldCrossLine className="w-3 h-3 text-teal-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              AI predictions ≠ professional medical diagnosis
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
