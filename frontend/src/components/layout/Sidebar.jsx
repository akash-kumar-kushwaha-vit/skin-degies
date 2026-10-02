import { NavLink } from 'react-router-dom'
import {
  RiDashboardLine, RiMicroscopeLine, RiFileTextLine,
  RiUserLine, RiAdminLine, RiLogoutBoxLine, RiDnaLine, RiShieldLine
} from 'react-icons/ri'
import { FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const userLinks = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/predict', icon: RiMicroscopeLine, label: 'AI Lesion Scan' },
  { to: '/profile', icon: RiUserLine, label: 'Account Profile' },
]

const adminLinks = [
  { to: '/admin', icon: RiAdminLine, label: 'Admin Overview' },
  { to: '/admin/users', icon: RiShieldLine, label: 'Manage Users' },
  { to: '/admin/predictions', icon: RiFileTextLine, label: 'Prediction Logs' },
]

export default function Sidebar({ mobileOpen = false, onClose = () => { } }) {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <aside
      className={clsx(
        'w-64 min-h-screen flex flex-col flex-shrink-0 z-50 transition-transform duration-200 ease-in-out',
        'fixed inset-y-0 left-0 lg:static lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'bg-white dark:bg-[#0c111d] border-r border-slate-200 dark:border-white/[0.07]'
      )}
    >
      {/* ── Brand Header ── */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <RiDnaLine className="w-4.5 h-4.5" />
          </div>
          <div className="leading-tight">
            <span className="font-display font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
              SkinDegies <span className="text-blue-600 dark:text-blue-400">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Clinical Workspace
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Close menu"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* ── User Overview Strip ── */}
      <div className="p-3 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
              {user?.name || 'Physician'}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {user?.email}
            </p>
          </div>
          {isAdmin && (
            <span className="badge-warning text-[10px] px-1.5 py-0.5 font-semibold">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </p>
          <div className="space-y-0.5">
            {userLinks.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) => clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600/80 dark:text-amber-500/80">
              Administration
            </p>
            <div className="space-y-0.5">
              {adminLinks.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Footer / Logout ── */}
      <div className="p-3 border-t border-slate-100 dark:border-white/[0.06]">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        >
          <RiLogoutBoxLine className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
