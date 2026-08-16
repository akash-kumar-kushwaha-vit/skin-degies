import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowLeftLine, RiCalendarLine, RiMicroscopeLine } from 'react-icons/ri'
import PredictionResults from '../../components/predict/PredictionResults'
import ReportViewer from '../../components/predict/ReportViewer'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function PredictionDetailPage() {
  const { id } = useParams()
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrediction()
  }, [id])

  const fetchPrediction = async () => {
    try {
      const { data } = await api.get(`/predictions/${id}`)
      setPrediction(data.data.prediction)
    } catch (err) {
      toast.error('Failed to load prediction details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading prediction log...</p>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="card-base text-center py-16 rounded-3xl max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <RiMicroscopeLine className="w-7 h-7" />
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-semibold">Prediction not found or deleted.</p>
        <Link to="/dashboard" className="btn-secondary text-sm inline-flex items-center gap-2">
          <RiArrowLeftLine className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/dashboard" className="btn-secondary text-xs py-2 px-4 rounded-xl self-start sm:self-auto flex items-center gap-2">
          <RiArrowLeftLine className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
          <RiCalendarLine className="w-4 h-4" />
          Analyzed on {new Date(prediction.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <PredictionResults prediction={prediction} />

      {prediction.reportId ? (
        <ReportViewer report={prediction.reportId} />
      ) : (
        <div className="card-base text-center py-10 rounded-3xl space-y-3">
          <p className="text-slate-600 dark:text-slate-400 text-sm">No clinical report was generated for this prediction.</p>
          <Link to="/predict" className="btn-primary text-sm inline-flex items-center gap-2">
            Start New Analysis with Questionnaire
          </Link>
        </div>
      )}
    </motion.div>
  )
}
