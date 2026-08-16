import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import DashboardNavbar from '../components/layout/DashboardNavbar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.06),_transparent_18%),#f4f7fb] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.08),_transparent_18%),#071120] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="page-enter max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
