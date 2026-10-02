import { Link } from 'react-router-dom'
import { RiDnaLine, RiGithubLine, RiMailLine, RiShieldCrossLine, RiCheckboxCircleLine } from 'react-icons/ri'

const platformLinks = [
  { label: 'Start AI Scan', to: '/predict' },
  { label: 'Clinical Dashboard', to: '/dashboard' },
  { label: 'Register Clinician', to: '/register' },
  { label: 'Sign In', to: '/login' },
]

const techStack = [
  'EfficientNetV2-S Model',
  'Gemini 2.5 Flash LLM',
  'Express & Node.js API',
  'PyTorch Deep Learning',
]

const trustItems = [
  'HIPAA-aligned data protocols',
  'JWT token-based sessions',
  'Rate-limited endpoints',
  'Encrypted medical logging',
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/[0.06] bg-white dark:bg-[#080c16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* ── Brand Column ── */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <RiDnaLine className="w-4.5 h-4.5" />
              </div>
              <span className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
                SkinDegies <span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Clinical-grade AI skin disease detection platform leveraging EfficientNetV2-S deep learning
              architecture and Gemini clinical synthesis.
            </p>

            {/* Trust checklist */}
            <div className="space-y-1.5 pt-1">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <RiCheckboxCircleLine className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Contact links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="mailto:support@skindegies.ai"
                className="btn-secondary text-xs py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5"
              >
                <RiMailLine className="w-3.5 h-3.5" /> support@skindegies.ai
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5"
              >
                <RiGithubLine className="w-3.5 h-3.5" /> GitHub
              </a>
            </div>
          </div>

          {/* ── Platform Links ── */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Workspace
            </h4>
            <div className="flex flex-col space-y-2">
              {platformLinks.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Technology & Performance ── */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Architecture &amp; Accuracy
            </h4>
            <div className="flex flex-col space-y-2">
              {techStack.map((item) => (
                <span key={item} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Model Accuracy
              </span>
              <p className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                81.56%
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Top-1 validation on 22 cutaneous conditions
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} SkinDegies AI. All rights reserved. For clinical triage &amp; educational assistance.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <RiShieldCrossLine className="w-3.5 h-3.5 text-blue-500" />
            <span>Encrypted Health Record Protocols</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
