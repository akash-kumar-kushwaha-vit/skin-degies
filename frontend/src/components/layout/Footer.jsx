import { Link } from 'react-router-dom'
import { RiDnaLine, RiGithubLine, RiMailLine } from 'react-icons/ri'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-900/50">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <RiDnaLine className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold gradient-text-blue">SkinDegies AI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered skin disease detection using deep learning. Early detection saves lives.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Platform</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Get Started', to: '/register' },
                { label: 'Sign In', to: '/login' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map(({ label, to }) => (
                <Link key={label} to={to} className="text-sm text-slate-500 hover:text-primary-400 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Contact</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:info@skindegies.com" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-400 transition-colors">
                <RiMailLine className="w-4 h-4" />
                info@skindegies.com
              </a>
              <a href="https://github.com" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-400 transition-colors">
                <RiGithubLine className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} SkinDegies AI. For informational purposes only. Not a substitute for medical advice.
          </p>
          <p className="text-slate-600 text-xs">
            Powered by EfficientNetV2-S · 81.56% Accuracy · 22 Classes
          </p>
        </div>
      </div>
    </footer>
  )
}
