import { motion } from 'framer-motion'
import {
  RiFileTextLine, RiShieldCrossLine, RiAlertLine,
  RiCheckDoubleLine, RiDownloadLine, RiPrinterLine,
  RiStethoscopeLine, RiHeartPulseLine
} from 'react-icons/ri'

const RISK_BADGES = {
  Low: { class: 'risk-low', label: 'Low Risk' },
  Moderate: { class: 'risk-moderate', label: 'Moderate Risk' },
  High: { class: 'risk-high', label: 'High Risk' },
  Critical: { class: 'risk-critical', label: 'Critical Risk' },
}

export default function ReportViewer({ report }) {
  if (!report) return null

  const handlePrint = () => {
    window.print()
  }

  const riskInfo = RISK_BADGES[report.riskLevel] || RISK_BADGES.Moderate

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">AI Dermatological Analysis Report</h3>
            <p className="text-xs text-slate-400">Generated via {report.llmProvider?.toUpperCase()} ({report.llmModel})</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-secondary py-2 px-3 text-xs">
            <RiPrinterLine className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report Sheet */}
      <div id="printable-report" className="card glass p-6 md:p-8 space-y-6 border-white/10 bg-slate-900/90">
        {/* Top Summary Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Primary Finding</span>
            <h2 className="font-display text-3xl font-extrabold text-white">
              {report.predictedDisease?.replace(/_/g, ' ')}
            </h2>
            {report.confidenceScore && (
              <p className="text-sm text-primary-400 font-semibold mt-1">
                Top Model Confidence: {report.confidenceScore.toFixed(1)}%
              </p>
            )}
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Risk Evaluation</span>
            <span className={`px-4 py-1.5 rounded-full font-bold text-sm border inline-block ${riskInfo.class}`}>
              {riskInfo.label}
            </span>
          </div>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Symptoms Summary */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2 mb-2">
              <RiHeartPulseLine className="w-4 h-4 text-primary-400" /> Symptoms Summary
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{report.symptomsSummary}</p>
          </div>

          {/* Image Findings */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2 mb-2">
              <RiFileTextLine className="w-4 h-4 text-accent-400" /> Image Findings
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{report.imageFindings}</p>
          </div>

          {/* Possible Causes */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2 mb-2">
              <RiAlertLine className="w-4 h-4 text-amber-400" /> Possible Etiology & Causes
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{report.possibleCauses}</p>
          </div>

          {/* Lifestyle Suggestions */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2 mb-2">
              <RiCheckDoubleLine className="w-4 h-4 text-emerald-400" /> Lifestyle & Care Suggestions
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{report.lifestyleSuggestions}</p>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="p-5 rounded-xl bg-primary-950/30 border border-primary-800/30">
          <h4 className="font-semibold text-primary-300 text-sm flex items-center gap-2 mb-2">
            <RiStethoscopeLine className="w-4 h-4 text-primary-400" /> Recommended Actions
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed">{report.recommendedActions}</p>
        </div>

        {/* When to Consult Dermatologist */}
        <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-800/30">
          <h4 className="font-semibold text-amber-300 text-sm flex items-center gap-2 mb-2">
            <RiShieldCrossLine className="w-4 h-4 text-amber-400" /> When to See a Dermatologist
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed">{report.whenToConsultDermatologist}</p>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500 italic leading-relaxed">
            {report.disclaimer || "This AI report is generated for informational purposes only and does not constitute official medical advice."}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
