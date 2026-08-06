import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiSearchLine, RiDeleteBin6Line, RiToggleLine, RiCheckLine, RiCloseLine } from 'react-icons/ri'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get(`/admin/users?page=${page}&search=${search}`)
      setUsers(data.data.users)
      setTotalPages(data.data.pagination.totalPages)
    } catch (err) {
      toast.error('Failed to load user list.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/toggle-active`)
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: data.data.isActive } : u))
      )
      toast.success(data.message)
    } catch (err) {
      toast.error('Failed to toggle status.')
    }
  }

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Permanently delete user ${email} and all their data?`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
      toast.success('User deleted successfully.')
    } catch (err) {
      toast.error('Failed to delete user.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm">View, search, activate/deactivate, and manage registered users</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input pl-10 py-2 text-sm"
          />
        </div>
      </div>

      <div className="card glass">
        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-12 skeleton" />
            <div className="h-12 skeleton" />
            <div className="h-12 skeleton" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.role === 'admin' ? 'badge-warning' : 'badge-primary'}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.isActive ? 'badge-success' : 'badge-danger'}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleActive(u._id)}
                        className="btn-ghost p-1.5 inline-flex text-slate-300 hover:text-amber-400"
                        title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                      >
                        {u.isActive ? <RiCloseLine className="w-4 h-4" /> : <RiCheckLine className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.email)}
                        className="btn-ghost p-1.5 inline-flex text-slate-400 hover:text-red-400"
                        title="Delete User"
                      >
                        <RiDeleteBin6Line className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-ghost py-1 px-3"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-ghost py-1 px-3"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
