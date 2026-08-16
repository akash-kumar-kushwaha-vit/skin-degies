import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { RiDnaLine, RiSunLine, RiMoonLine } from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const navLinks = [
  { label: 'Features',  href: '/#features' },
  { label: 'Accuracy',  href: '/#accuracy' },
  { label: 'Team',      href: '/#team' },
  { label: 'Contact',   href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user }                  = useAuth()
  const { theme, toggleTheme }    = useTheme()
  const location                  = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3' : 'py-4'
    }`}>
      <div className="container-app">
        <div className={`flex items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]'
            : 'bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-[0_4px_20px_-12px_rgba(15,23,42,0.12)]'
        }`}>

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-button transition-all duration-300 group-hover:shadow-button-hover group-hover:scale-105" />
              <div className="relative w-full h-full rounded-xl flex items-center justify-center">
                <RiDnaLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-[17px] text-slate-900 dark:text-white tracking-tight">
                SkinDegies <span className="gradient-brand">AI</span>
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest mt-0.5">
                Clinical AI
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-0.5">
            {location.pathname === '/' && navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl transition-all duration-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center
                         text-slate-500 dark:text-slate-400
                         hover:text-slate-900 dark:hover:text-white
                         hover:bg-slate-100 dark:hover:bg-slate-800/60
                         transition-all duration-150"
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark'
                ? <RiSunLine className="w-4 h-4 text-amber-400" />
                : <RiMoonLine className="w-4 h-4" />
              }
            </button>

            {user ? (
              <Link to="/dashboard" className="btn-primary text-xs py-2 px-5 rounded-xl">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-xs py-2.5 px-5 rounded-xl">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <RiSunLine className="w-4 h-4 text-amber-400" />
                : <RiMoonLine className="w-4 h-4" />
              }
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden mt-2 mx-4 overflow-hidden rounded-2xl
                       bg-white/97 dark:bg-slate-950/97 backdrop-blur-2xl
                       border border-slate-200/80 dark:border-slate-800/80
                       shadow-[0_16px_40px_-12px_rgba(15,23,42,0.22)]
                       dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]"
          >
            <div className="p-4 flex flex-col gap-1">
              {location.pathname === '/' && navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                {user ? (
                  <Link to="/dashboard" className="btn-primary justify-center text-sm py-2.5" onClick={() => setMobileOpen(false)}>
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary justify-center text-sm py-2.5" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/register" className="btn-primary justify-center text-sm py-2.5" onClick={() => setMobileOpen(false)}>
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
