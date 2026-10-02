import {
  RiFileTextLine, RiShieldCrossLine, RiAlertLine,
  RiCheckDoubleLine, RiPrinterLine,
  RiStethoscopeLine, RiHeartPulseLine, RiSparklingLine,
  RiInformationLine, RiHospitalLine, RiMapPinLine,
  RiPhoneLine, RiMedalLine, RiCalendarLine,
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const RISK_BADGES = {
  Low: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    label: 'Low Risk',
  },
  Moderate: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    label: 'Moderate Risk',
  },
  High: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800/60',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
    label: 'High Risk',
  },
  Critical: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800/60',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
    label: 'Critical Risk',
  },
}

function Section({ icon: Icon, title, children, color = 'blue' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-white/[0.06]">
        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
          {title}
        </h4>
      </div>
      <div className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default function ReportViewer({ report }) {
  const { user } = useAuth()
  if (!report) return null

  const handlePrint = () => window.print()
  const riskInfo = RISK_BADGES[report.riskLevel] || RISK_BADGES.Moderate
  const isFallback = report.llmProvider === 'fallback' || report.llmModel === 'local-fallback'
  const primaryDisease = report.predictedDisease?.replace(/_/g, ' ') || 'Skin Condition'
  const reportDate = new Date(report.createdAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const reportTime = new Date(report.createdAt || Date.now()).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const avatarSrc = user?.avatar ? `${API_URL}${user.avatar}` : null
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'DR'
  const doctorName = user?.name ? `Dr. ${user.name}` : 'Attending Physician'
  const doctorCreds = [user?.degree, user?.specialization].filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between no-print gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <RiSparklingLine className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
              Clinical Assessment Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isFallback
                ? 'Synthesized via local clinical rule engine'
                : `Generated via ${report.llmProvider?.toUpperCase()} · ${report.llmModel}`}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="btn-secondary text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5"
        >
          <RiPrinterLine className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* ── Formal Clinical Printable Document ── */}
      <div
        id="printable-report"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden"
      >
        {/* Document Header / Clinic Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-display font-bold text-lg">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider block">
                  Attending Clinician
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                  {doctorName}
                </h2>
                {doctorCreds && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {doctorCreds}
                  </p>
                )}
                {user?.hospital && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <RiHospitalLine className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.hospital}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs text-slate-500 dark:text-slate-400">
              {user?.clinicAddress && (
                <p className="flex items-center sm:justify-end gap-1.5">
                  <RiMapPinLine className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.clinicAddress}</span>
                </p>
              )}
              {user?.phone && (
                <p className="flex items-center sm:justify-end gap-1.5">
                  <RiPhoneLine className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.phone}</span>
                </p>
              )}
              {user?.medicalLicense && (
                <p className="flex items-center sm:justify-end gap-1.5">
                  <RiMedalLine className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lic: {user.medicalLicense}</span>
                </p>
              )}
              <p className="flex items-center sm:justify-end gap-1.5 pt-0.5 text-[11px] text-slate-400">
                <RiCalendarLine className="w-3 h-3" />
                <span>{reportDate} · {reportTime}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Primary Diagnosis & Risk Strip */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className={`p-5 rounded-xl border ${riskInfo.border} ${riskInfo.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Primary Assessment
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                {primaryDisease}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                AI Inference via EfficientNetV2-S &amp; Clinical Questionnaire
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${riskInfo.border} ${riskInfo.bg} ${riskInfo.text}`}>
                <span className={`w-2 h-2 rounded-full ${riskInfo.dot}`} />
                {riskInfo.label}
              </span>
              {report.confidenceScore && (
                <div className="pl-3 border-l border-slate-200 dark:border-white/10 text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Confidence</span>
                  <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {Number(report.confidenceScore).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick clinical metadata cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Modality</span>
              <span className="text-xs font-medium text-slate-900 dark:text-white mt-0.5 block">AI-Assisted</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Follow-up</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">Recommended</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Report ID</span>
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mt-0.5 block truncate">
                {(report._id || report.id || 'N/A').toString().slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-white/[0.06]" />

          {/* Detailed clinical sections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Section icon={RiHeartPulseLine} title="Symptom Profile">
              {report.symptomsSummary}
            </Section>
            <Section icon={RiFileTextLine} title="Visual Findings">
              {report.imageFindings}
            </Section>
            <Section icon={RiAlertLine} title="Etiology & Likely Causes">
              {report.possibleCauses}
            </Section>
            <Section icon={RiCheckDoubleLine} title="Lifestyle & Preventative Measures">
              {report.lifestyleSuggestions}
            </Section>
          </div>

          {/* Clinical Recommendations Banner */}
          <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
            <div className="flex items-center gap-2">
              <RiStethoscopeLine className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Recommended Actions & Guidance
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
              {report.recommendedActions}
            </p>
          </div>

          {/* When to consult urgently */}
          <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2">
              <RiShieldCrossLine className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Urgent Consultation Red Flags
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
              {report.whenToConsultDermatologist}
            </p>
          </div>

          {/* Signature and Disclaimer */}
          <div className="pt-6 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Reviewed By</span>
              <p className="font-display font-bold text-sm text-slate-900 dark:text-white">{doctorName}</p>
              {doctorCreds && <p className="text-xs text-slate-500 dark:text-slate-400">{doctorCreds}</p>}
            </div>

            <div className="text-left sm:text-right space-y-1 min-w-[160px]">
              <div className="h-8 border-b border-slate-400 dark:border-white/20 w-40" />
              <p className="text-[10px] uppercase font-semibold text-slate-400">Physician Sign-off</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <RiInformationLine className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {report.disclaimer ||
                'This AI-assisted report is generated for clinical reference and patient education. It does not replace a formal in-person dermoscopic examination.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
