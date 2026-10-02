import { useState, useEffect } from 'react'
import { RiSearchLine, RiDeleteBin6Line, RiCheckLine, RiCloseLine, RiUserLine } from 'react-icons/ri'
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
    if (!window.confirm(`Permanently delete user ${email} and all their records?`)) return
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
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            User Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage clinician accounts, roles, access permissions, and account statuses
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            id="admin-search-users"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search name or email..."
            className="input pl-9 text-xs sm:text-sm py-2"
          />
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="card-base p-0 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No users matched your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
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
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                          {u.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={u.role === 'admin' ? 'badge-warning text-[11px]' : 'badge-primary text-[11px]'}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={u.isActive ? 'badge-success text-[11px]' : 'badge-danger text-[11px]'}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(u._id)}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            u.isActive
                              ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                              : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                          }`}
                          title={u.isActive ? 'Deactivate account' : 'Activate account'}
                        >
                          {u.isActive ? <RiCloseLine className="w-4 h-4" /> : <RiCheckLine className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.email)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                          title="Delete user"
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

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-secondary py-1 px-3 text-xs rounded-lg disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-secondary py-1 px-3 text-xs rounded-lg disabled:opacity-40"
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
