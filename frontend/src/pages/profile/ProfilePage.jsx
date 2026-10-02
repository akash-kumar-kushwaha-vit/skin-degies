import { useState, useRef } from 'react'
import {
  RiUserLine, RiMailLine, RiLockPasswordLine, RiSaveLine,
  RiCameraLine, RiHospitalLine, RiMapPinLine, RiPhoneLine, RiMedalLine,
  RiShieldCheckLine, RiCheckLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
      </label>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security'

  // Basic & Doctor info
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [degree, setDegree] = useState(user?.degree || '')
  const [specialization, setSpecialization] = useState(user?.specialization || '')
  const [hospital, setHospital] = useState(user?.hospital || '')
  const [clinicAddress, setClinicAddress] = useState(user?.clinicAddress || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [medicalLicense, setMedicalLicense] = useState(user?.medicalLicense || '')
  const [yearsOfExperience, setYearsOfExperience] = useState(user?.yearsOfExperience || '')
  const [bio, setBio] = useState(user?.bio || '')

  const [profileLoading, setProfileLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview
    if (user?.avatar) return `${API_URL}${user.avatar}`
    return null
  }

  // ── Avatar Upload ────────────────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Profile photo must be smaller than 5 MB.')
    }

    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)

    setAvatarLoading(true)
    try {
      const form = new FormData()
      form.append('avatar', file)
      const { data } = await api.post('/users/avatar', form)
      updateUser(data.data.user)
      toast.success('Profile photo updated!')
    } catch (err) {
      setAvatarPreview(null)
      toast.error(err.response?.data?.message || 'Failed to upload photo.')
    } finally {
      setAvatarLoading(false)
    }
  }

  // ── Update Profile ────────────────────────────────────────────────────────
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const { data } = await api.put('/users/profile', {
        name,
        email,
        degree,
        specialization,
        hospital,
        clinicAddress,
        phone,
        medicalLicense,
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
        bio,
      })
      updateUser(data.data.user)
      toast.success('Profile details saved.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Change Password ────────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters.')
    }
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
      toast.error(err.response?.data?.message || 'Failed to update password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const avatarSrc = getAvatarSrc()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Account &amp; Clinical Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your credentials, clinic information, and security preferences
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-white/[0.06] pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Clinician Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'security'
              ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Security &amp; Password
        </button>
      </div>

      {/* ── Tab 1: Profile Form ── */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Avatar card */}
          <div className="card-base p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 text-white flex items-center justify-center font-display font-bold text-2xl border border-slate-200 dark:border-white/10">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                title="Change photo"
              >
                <RiCameraLine className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                  {user?.name || 'Physician'}
                </h3>
                <span className="badge-primary text-[10px]">
                  {user?.role === 'admin' ? 'Administrator' : 'Clinician'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                JPG, PNG or WebP under 5 MB. Appears on printed clinical reports.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="btn-secondary text-xs py-1.5 px-3 rounded-lg mt-2 inline-flex items-center gap-1.5"
              >
                <RiCameraLine className="w-3.5 h-3.5" />
                <span>{avatarLoading ? 'Uploading...' : 'Upload Photo'}</span>
              </button>
            </div>
          </div>

          {/* Form details */}
          <div className="card-base p-5 sm:p-7 space-y-5">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-white/[0.06]">
              Personal &amp; Practice Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" icon={RiUserLine}>
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Email Address" icon={RiMailLine}>
                <input
                  id="profile-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Degree / Credentials" icon={RiMedalLine}>
                <input
                  id="profile-degree"
                  type="text"
                  placeholder="e.g. MD, MBBS, FAAD"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Specialization" icon={RiMedalLine}>
                <input
                  id="profile-specialization"
                  type="text"
                  placeholder="e.g. Dermatology &amp; Cutaneous Surgery"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Hospital / Clinic Affiliation" icon={RiHospitalLine}>
                <input
                  id="profile-hospital"
                  type="text"
                  placeholder="e.g. City Dermatology Center"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Medical License Number" icon={RiShieldCheckLine}>
                <input
                  id="profile-license"
                  type="text"
                  placeholder="e.g. MED-894103"
                  value={medicalLicense}
                  onChange={(e) => setMedicalLicense(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Phone Contact" icon={RiPhoneLine}>
                <input
                  id="profile-phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Years of Experience">
                <input
                  id="profile-experience"
                  type="number"
                  placeholder="e.g. 12"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="input"
                  min={0}
                  max={60}
                />
              </Field>
            </div>

            <Field label="Clinic Physical Address" icon={RiMapPinLine}>
              <input
                id="profile-address"
                type="text"
                placeholder="e.g. 450 Health Sciences Blvd, Suite 300, Boston, MA"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                className="input"
              />
            </Field>

            <Field label="Clinician Bio / Notes">
              <textarea
                id="profile-bio"
                rows={3}
                placeholder="Brief professional summary..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input resize-none"
              />
            </Field>

            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="btn-primary text-xs py-2 px-5 rounded-lg"
              >
                <RiSaveLine className="w-3.5 h-3.5" />
                <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Tab 2: Security Form ── */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="card-base p-5 sm:p-7 space-y-5">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Change Account Password
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ensure your account uses a secure password of at least 6 characters.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <Field label="Current Password" icon={RiLockPasswordLine}>
              <input
                id="current-password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </Field>

            <Field label="New Password" icon={RiLockPasswordLine}>
              <input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                placeholder="Minimum 6 characters"
              />
            </Field>

            <Field label="Confirm New Password" icon={RiCheckLine}>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="input"
                placeholder="Re-enter new password"
              />
            </Field>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex justify-start">
            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary text-xs py-2 px-5 rounded-lg"
            >
              <RiSaveLine className="w-3.5 h-3.5" />
              <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
