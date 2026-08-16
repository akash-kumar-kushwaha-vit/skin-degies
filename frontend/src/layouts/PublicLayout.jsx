import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-1 bg-transparent">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
