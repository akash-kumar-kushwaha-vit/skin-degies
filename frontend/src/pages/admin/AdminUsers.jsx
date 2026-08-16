import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiSearchLine, RiDeleteBin6Line, RiCheckLine, RiCloseLine } from 'react-icons/ri'
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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">View, search, activate/deactivate, and manage registered users</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            id="admin-search-users"
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input pl-10 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="card-base p-0 rounded-3xl overflow-hidden shadow-premium">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-base">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td>
                      <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                    </td>
                    <td>
                      <span className={u.role === 'admin' ? 'badge-warning' : 'badge-primary'}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={u.isActive ? 'badge-success' : 'badge-danger'}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(u._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-all"
                          title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {u.isActive ? <RiCloseLine className="w-4 h-4" /> : <RiCheckLine className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.email)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                          title="Delete User"
                        >
                          <RiDeleteBin6Line className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-secondary py-1.5 px-3.5 text-xs rounded-xl"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-secondary py-1.5 px-3.5 text-xs rounded-xl"
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
