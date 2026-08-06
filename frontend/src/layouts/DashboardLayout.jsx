import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import DashboardNavbar from '../components/layout/DashboardNavbar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="page-enter max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
