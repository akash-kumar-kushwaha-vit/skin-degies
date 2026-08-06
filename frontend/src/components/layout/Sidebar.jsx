import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiDashboardLine, RiMicroscopeLine, RiFileTextLine,
  RiUserLine, RiAdminLine, RiLogoutBoxLine, RiDnaLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const userLinks = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/predict', icon: RiMicroscopeLine, label: 'Predict' },
  { to: '/profile', icon: RiUserLine, label: 'Profile' },
]

const adminLinks = [
  { to: '/admin', icon: RiAdminLine, label: 'Admin Panel' },
  { to: '/admin/users', icon: RiUserLine, label: 'Users' },
  { to: '/admin/predictions', icon: RiFileTextLine, label: 'Predictions' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'admin'
    ? [...userLinks, ...adminLinks]
    : userLinks

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-h-screen bg-slate-900/80 border-r border-white/5 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-glow">
            <RiDnaLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-display font-bold gradient-text-blue">SkinDegies</p>
            <p className="text-xs text-slate-500">AI Platform</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 mx-3 my-3 glass-light rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
        >
          <RiLogoutBoxLine className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  )
}
