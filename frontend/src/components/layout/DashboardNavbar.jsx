import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { RiSunLine, RiMoonLine, RiMicroscopeLine, RiShieldCheckLine } from 'react-icons/ri'
import { FiMenu } from 'react-icons/fi'

const PAGE_TITLES = {
  '/dashboard': { label: 'Dashboard', sub: 'Clinical activity & scan history' },
  '/predict': { label: 'AI Lesion Scan', sub: 'EfficientNetV2-S diagnostic model' },
  '/profile': { label: 'Account Settings', sub: 'Doctor credentials & preferences' },
  '/admin': { label: 'Command Center', sub: 'System overview & platform metrics' },
  '/admin/users': { label: 'User Directory', sub: 'Accounts & access management' },
  '/admin/predictions': { label: 'Inference Logs', sub: 'Real-time diagnostic records' },
}

export default function DashboardNavbar({ onMenu = () => { } }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const page = PAGE_TITLES[location.pathname] || { label: 'Clinical Workspace', sub: 'SkinDegies AI' }

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-30">
      {/* ── Left: Page context ── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenu}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Open sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-none truncate">
              {page.label}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate mt-0.5">
            {page.sub}
          </p>
        </div>
      </div>

      {/* ── Right: Quick Actions & Profile ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Scan shortcut on dashboard */}
        {location.pathname !== '/predict' && (
          <Link
            to="/predict"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-600/10 hover:bg-blue-100/80 dark:hover:bg-blue-600/20 border border-blue-200/60 dark:border-blue-500/20 transition-colors"
          >
            <RiMicroscopeLine className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Link>
        )}

        {/* Theme Toggle */}
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

        {/* Separator */}
        <div className="w-px h-5 bg-slate-200 dark:bg-white/[0.08]" />

        {/* User avatar & name */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
              {user?.name}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center justify-end gap-1">
              <RiShieldCheckLine className="w-3 h-3 text-blue-500" />
              {user?.role === 'admin' ? 'Administrator' : 'Clinician'}
            </p>
          </div>
          <Link
            to="/profile"
            className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center hover:opacity-90 transition-opacity"
            title="Account profile"
          >
            {initials}
          </Link>
        </div>
      </div>
    </header>
  )
}
