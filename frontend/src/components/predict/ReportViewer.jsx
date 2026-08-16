import { motion } from 'framer-motion'
import {
  RiFileTextLine, RiShieldCrossLine, RiAlertLine,
  RiCheckDoubleLine, RiPrinterLine,
  RiStethoscopeLine, RiHeartPulseLine, RiSparklingLine
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
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-button">
            <RiSparklingLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">AI Medical Analysis Report</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Generated via {report.llmProvider?.toUpperCase()} ({report.llmModel})</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-secondary py-2.5 px-4 text-xs rounded-xl flex items-center gap-2 shadow-subtle">
            <RiPrinterLine className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report Sheet */}
      <div id="printable-report" className="card-base p-6 md:p-10 space-y-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-premium">
        {/* Top Summary Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-200 dark:border-slate-800 gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Primary Diagnostic Finding
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {report.predictedDisease?.replace(/_/g, ' ')}
            </h2>
            {report.confidenceScore && (
              <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                Top Model Confidence: {report.confidenceScore.toFixed(1)}%
              </p>
            )}
          </div>
          <div className="flex flex-col items-start md:items-end">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
              Clinical Risk Evaluation
            </span>
            <span className={`px-4 py-2 rounded-full font-bold text-sm border inline-block shadow-subtle ${riskInfo.class}`}>
              {riskInfo.label}
            </span>
          </div>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Symptoms Summary */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h4 className="font-display font-semibold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
              <RiHeartPulseLine className="w-4 h-4 text-primary-500" /> Symptoms Summary
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{report.symptomsSummary}</p>
          </div>

          {/* Image Findings */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h4 className="font-display font-semibold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
              <RiFileTextLine className="w-4 h-4 text-teal-500" /> Image Findings
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{report.imageFindings}</p>
          </div>

          {/* Possible Causes */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h4 className="font-display font-semibold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
              <RiAlertLine className="w-4 h-4 text-amber-500" /> Possible Etiology & Causes
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{report.possibleCauses}</p>
          </div>

          {/* Lifestyle Suggestions */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h4 className="font-display font-semibold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
              <RiCheckDoubleLine className="w-4 h-4 text-emerald-500" /> Lifestyle & Care Suggestions
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{report.lifestyleSuggestions}</p>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="p-6 rounded-2xl bg-primary-50/80 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/50 space-y-2">
          <h4 className="font-display font-bold text-primary-800 dark:text-primary-300 text-sm flex items-center gap-2">
            <RiStethoscopeLine className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Recommended Actions
          </h4>
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{report.recommendedActions}</p>
        </div>

        {/* When to Consult Dermatologist */}
        <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 space-y-2">
          <h4 className="font-display font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
            <RiShieldCrossLine className="w-4 h-4 text-amber-600 dark:text-amber-400" /> When to See a Dermatologist
          </h4>
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{report.whenToConsultDermatologist}</p>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 italic leading-relaxed max-w-2xl mx-auto">
            {report.disclaimer || "This AI report is generated for informational purposes only and does not constitute official medical advice."}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
