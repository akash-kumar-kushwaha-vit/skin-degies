import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiUserLine, RiMailLine, RiLockPasswordLine, RiSaveLine, RiShieldKeyholeLine } from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ── Page Header & Profile Card ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        className="card-base p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 rounded-3xl shadow-premium"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-teal-600 text-white font-display font-extrabold text-2xl flex items-center justify-center shadow-button flex-shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
            <span className="badge-primary text-[10px] uppercase font-bold tracking-wider">
              {user?.role === 'admin' ? 'Administrator' : 'Clinical User'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs pt-1">
            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* ── Forms Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="card-base p-6 sm:p-8 space-y-6 flex flex-col justify-between rounded-3xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/60 flex items-center justify-center font-bold shadow-subtle">
                <RiUserLine className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Personal Information</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your name and contact details</p>
              </div>
            </div>

            <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="pt-4">
            <button
              form="profile-form"
              type="submit"
              disabled={profileLoading}
              className="btn-primary w-full py-3 text-sm rounded-xl"
            >
              <RiSaveLine className="w-4 h-4" />
              {profileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </motion.div>

        {/* Change Password Form */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="card-base p-6 sm:p-8 space-y-6 flex flex-col justify-between rounded-3xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center font-bold shadow-subtle">
                <RiShieldKeyholeLine className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Security & Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your access password</p>
              </div>
            </div>

            <form id="password-form" onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="profile-current-password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="profile-new-password"
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="profile-confirm-password"
                    type="password"
                    required
                    minLength={8}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="input pl-10"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="pt-4">
            <button
              form="password-form"
              type="submit"
              disabled={passwordLoading}
              className="btn-secondary w-full py-3 text-sm rounded-xl"
            >
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
