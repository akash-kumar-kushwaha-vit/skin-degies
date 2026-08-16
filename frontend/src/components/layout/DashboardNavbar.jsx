import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { RiSunLine, RiMoonLine, RiShieldCheckLine, RiNotification3Line } from 'react-icons/ri'

const PAGE_TITLES = {
  '/dashboard':         { label: 'Dashboard',        sub: 'Overview & recent activity' },
  '/predict':           { label: 'AI Skin Analysis',  sub: 'EfficientNetV2-S prediction' },
  '/profile':           { label: 'Account Settings',  sub: 'Manage your profile' },
  '/admin':             { label: 'Admin Overview',    sub: 'Platform management' },
  '/admin/users':       { label: 'User Management',   sub: 'View and manage accounts' },
  '/admin/predictions': { label: 'Prediction Logs',   sub: 'All platform predictions' },
}

export default function DashboardNavbar() {
  const { user }             = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location             = useLocation()
  const initials             = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const page                 = PAGE_TITLES[location.pathname] || { label: 'Workspace', sub: 'SkinDegies AI' }

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-white/[0.05]
                       bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl
                       flex items-center justify-between px-6 flex-shrink-0
                       shadow-[0_1px_0_0_rgba(15,23,42,0.05)]
                       dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">

      {/* ── Left: Page context ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-slate-900 dark:text-white text-sm leading-none truncate">
              {page.label}
            </h2>
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Live</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block truncate">{page.sub}</p>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-slate-500 dark:text-slate-400
                     hover:text-slate-900 dark:hover:text-white
                     hover:bg-slate-100 dark:hover:bg-slate-800/60
                     transition-all duration-150"
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <RiSunLine className="w-4 h-4 text-amber-400" />
            : <RiMoonLine className="w-4 h-4" />
          }
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700/60 mx-1" />

        {/* User info + avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center justify-end gap-1">
              <RiShieldCheckLine className="w-3 h-3 text-teal-500" />
              {user?.role === 'admin' ? 'Administrator' : 'Clinical User'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xs flex items-center justify-center shadow-button flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
