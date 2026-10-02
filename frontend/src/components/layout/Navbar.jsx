import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { RiDnaLine, RiSunLine, RiMoonLine, RiArrowRightLine } from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Model Accuracy', href: '/#accuracy' },
  { label: 'Conditions', href: '/#conditions' },
  { label: 'Clinical Team', href: '/#team' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-200 ${
            scrolled
              ? 'bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-md border border-slate-200/80 dark:border-white/[0.08] shadow-sm'
              : 'bg-white/60 dark:bg-[#090d16]/60 backdrop-blur-sm border border-slate-200/50 dark:border-white/[0.05]'
          }`}
        >
          {/* ── Brand Logo ── */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <RiDnaLine className="w-4.5 h-4.5" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                SkinDegies <span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
              <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                Clinical Dermatology
              </p>
            </div>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {location.pathname === '/' &&
              navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors hover:bg-slate-100/60 dark:hover:bg-white/[0.04]"
                >
                  {link.label}
                </a>
              ))}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <RiSunLine className="w-4 h-4 text-amber-400" />
              ) : (
                <RiMoonLine className="w-4 h-4" />
              )}
            </button>

            {user ? (
              <Link to="/dashboard" className="btn-primary text-xs py-2 px-3.5 rounded-lg">
                <span>Dashboard</span>
                <RiArrowRightLine className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-xs py-2 px-3.5 rounded-lg">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <RiSunLine className="w-4 h-4 text-amber-400" />
              ) : (
                <RiMoonLine className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileOpen && (
        <div className="md:hidden mx-4 rounded-2xl bg-white/95 dark:bg-[#0c111d]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg p-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {location.pathname === '/' &&
              navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                >
                  {link.label}
                </a>
              ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full py-2.5 text-xs rounded-xl"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary w-full py-2.5 text-xs rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full py-2.5 text-xs rounded-xl"
                >
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
