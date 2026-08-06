import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiUserLine, RiMailLine, RiLockPasswordLine, RiSaveLine } from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const { data } = await api.put('/users/profile', { name, email })
      updateUser(data.data.user)
      toast.success('Profile updated successfully.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      return toast.error('New passwords do not match.')
    }
    setPasswordLoading(true)
    try {
      await api.put('/users/change-password', { currentPassword, newPassword })
      toast.success('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400 text-sm">Manage your profile information and account security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card glass space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30 flex items-center justify-center font-bold">
              <RiUserLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">Personal Information</h3>
              <p className="text-xs text-slate-400">Update your name and email address</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12"
                />
              </div>
            </div>

            <button type="submit" disabled={profileLoading} className="btn-primary w-full py-3 text-sm">
              <RiSaveLine className="w-4 h-4" />
              {profileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </motion.div>

        {/* Change Password Form */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card glass space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-600/20 text-accent-400 border border-accent-500/30 flex items-center justify-center font-bold">
              <RiLockPasswordLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">Security & Password</h3>
              <p className="text-xs text-slate-400">Update your secret password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repeat new password"
                className="input"
              />
            </div>

            <button type="submit" disabled={passwordLoading} className="btn-secondary w-full py-3 text-sm">
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
