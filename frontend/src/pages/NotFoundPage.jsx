import { Link } from 'react-router-dom'
import { RiArrowLeftLine, RiCompass3Line } from 'react-icons/ri'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md card-base p-8 text-center space-y-5 rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <RiCompass3Line className="w-6 h-6" />
        </div>

        <div>
          <span className="font-mono text-3xl font-bold text-blue-600 dark:text-blue-400 block mb-1">404</span>
          <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            The requested page or record does not exist or has been relocated.
          </p>
        </div>

        <Link to="/" className="btn-primary w-full justify-center py-2.5 text-xs rounded-xl inline-flex items-center gap-1.5">
          <RiArrowLeftLine className="w-3.5 h-3.5" /> Return to Home
        </Link>
      </div>
    </div>
  )
}
