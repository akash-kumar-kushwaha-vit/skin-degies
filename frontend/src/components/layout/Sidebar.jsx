import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiDashboardLine, RiMicroscopeLine, RiFileTextLine,
  RiUserLine, RiAdminLine, RiLogoutBoxLine, RiDnaLine, RiShieldLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const userLinks = [
  { to: '/dashboard', icon: RiDashboardLine,   label: 'Dashboard' },
  { to: '/predict',   icon: RiMicroscopeLine,  label: 'AI Lesion Scan' },
  { to: '/profile',   icon: RiUserLine,         label: 'Account Profile' },
]

const adminLinks = [
  { to: '/admin',              icon: RiAdminLine,    label: 'Admin Overview' },
  { to: '/admin/users',        icon: RiShieldLine,   label: 'Manage Users' },
  { to: '/admin/predictions',  icon: RiFileTextLine, label: 'Prediction Logs' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isAdmin  = user?.role === 'admin'
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-64 min-h-screen flex flex-col flex-shrink-0 relative
                 bg-white dark:bg-[#0a1122]/95
                 border-r border-slate-200/70 dark:border-white/[0.05]
                 shadow-[12px_0_30px_-24px_rgba(15,23,42,0.12)]
                 dark:shadow-[12px_0_30px_-24px_rgba(2,6,23,0.9)]"
    >
      {/* ── Brand ── */}
      <div className="px-5 py-5 border-b border-slate-200/70 dark:border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-button" />
            <div className="relative w-full h-full flex items-center justify-center">
              <RiDnaLine className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
              SkinDegies <span className="gradient-brand">AI</span>
            </span>
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest mt-1">
              Clinical Workspace
            </p>
          </div>
        </div>
      </div>

      {/* ── User Badge ── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl
                       bg-slate-50 dark:bg-slate-800/40
                       border border-slate-200/60 dark:border-white/[0.05]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-button">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
          </div>
          {isAdmin && (
            <span className="flex-shrink-0 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-3 space-y-0.5 overflow-y-auto scrollbar-hidden">
        <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Navigation
        </p>

        {userLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => clsx(
              'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
              isActive
                ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary-600 dark:bg-primary-400" />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="px-3 pb-2 pt-4 text-[10px] font-black uppercase tracking-widest text-amber-600/80 dark:text-amber-500/70">
              Admin
            </p>
            {adminLinks.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) => clsx(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-amber-500" />
                    )}
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* ── Logout ── */}
      <div className="px-4 pb-5 border-t border-slate-200/70 dark:border-white/[0.05] pt-4 relative">
        {/* Soft fade at bottom of nav */}
        <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#0a1122]/95 to-transparent pointer-events-none" />
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-xs font-semibold
                     text-slate-500 dark:text-slate-400
                     hover:text-rose-600 dark:hover:text-rose-400
                     hover:bg-rose-50 dark:hover:bg-rose-950/30
                     border border-transparent hover:border-rose-200/60 dark:hover:border-rose-900/40
                     transition-all duration-200"
        >
          <RiLogoutBoxLine className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  )
}
