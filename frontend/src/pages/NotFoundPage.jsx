import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiCompass3Line } from 'react-icons/ri'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070d19] px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md card-base p-8 text-center shadow-premium space-y-6 rounded-3xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/60 flex items-center justify-center mx-auto shadow-subtle">
          <RiCompass3Line className="w-8 h-8" />
        </div>

        <div>
          <h1 className="font-display text-6xl font-extrabold gradient-brand mb-2">404</h1>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            The page or clinical record you are looking for does not exist or has been relocated.
          </p>
        </div>

        <Link to="/" className="btn-primary w-full justify-center py-3 text-sm rounded-xl">
          <RiArrowLeftLine className="w-4 h-4" /> Return to Home
        </Link>
      </motion.div>
    </div>
  )
}
