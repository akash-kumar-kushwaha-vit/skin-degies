import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowLeftLine } from 'react-icons/ri'
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="card glass text-center py-12">
        <p className="text-slate-400 mb-4">Prediction not found or deleted.</p>
        <Link to="/dashboard" className="btn-secondary text-sm">
          <RiArrowLeftLine className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="btn-ghost text-sm">
          <RiArrowLeftLine className="w-4 h-4" /> Back to History
        </Link>
        <span className="text-xs text-slate-400">
          Analyzed on {new Date(prediction.createdAt).toLocaleDateString()}
        </span>
      </div>

      <PredictionResults prediction={prediction} />

      {prediction.reportId ? (
        <ReportViewer report={prediction.reportId} />
      ) : (
        <div className="card glass text-center py-8">
          <p className="text-slate-400 text-sm mb-2">No clinical report was generated for this prediction.</p>
          <Link to="/predict" className="btn-primary text-sm">
            Start New Analysis with Questionnaire
          </Link>
        </div>
      )}
    </motion.div>
  )
}
