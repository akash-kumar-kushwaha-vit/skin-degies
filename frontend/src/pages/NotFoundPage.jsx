import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowLeftLine } from 'react-icons/ri'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center animated-bg px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card glass text-center max-w-md p-8 border-white/10"
      >
        <h1 className="font-display text-6xl font-extrabold gradient-text mb-2">404</h1>
        <h2 className="font-display text-xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          The page or medical record you are looking for does not exist or has been relocated.
        </p>
        <Link to="/" className="btn-primary w-full justify-center">
          <RiArrowLeftLine className="w-4 h-4" /> Return to Home
        </Link>
      </motion.div>
    </div>
  )
}
