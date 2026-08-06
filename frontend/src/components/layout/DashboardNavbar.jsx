import { useAuth } from '../../context/AuthContext'
import { RiBellLine, RiSunLine, RiMoonLine } from 'react-icons/ri'
import { useTheme } from '../../context/ThemeContext'

export default function DashboardNavbar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <p className="text-xs text-slate-500">Welcome back,</p>
        <p className="font-semibold text-white">{user?.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2 rounded-lg"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <RiSunLine className="w-5 h-5" /> : <RiMoonLine className="w-5 h-5" />}
        </button>
        <button className="btn-ghost p-2 rounded-lg relative">
          <RiBellLine className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
      </div>
    </header>
  )
}
