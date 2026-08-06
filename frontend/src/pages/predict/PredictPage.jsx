import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUploader from '../../components/predict/ImageUploader'
import PredictionResults from '../../components/predict/PredictionResults'
import QuestionnaireForm from '../../components/predict/QuestionnaireForm'
import ReportViewer from '../../components/predict/ReportViewer'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { RiRefreshLine } from 'react-icons/ri'

export default function PredictPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [step, setStep] = useState(1) // 1: Upload, 2: Prediction Results & Questionnaire, 3: Full Report
  const [loading, setLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [predictionData, setPredictionData] = useState(null)
  const [reportData, setReportData] = useState(null)

  // Step 1: Upload Image & Get Predictions
  const handleAnalyzeImage = async () => {
    if (!selectedFile) return toast.error('Please select an image first.')

    setLoading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const { data } = await api.post('/predictions/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setPredictionData(data.data)
      setStep(2)
      toast.success('AI Prediction complete!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Submit Questionnaire & Generate LLM Report
  const handleQuestionnaireSubmit = async (formData) => {
    if (!predictionData?.predictionId) return

    setReportLoading(true)
    try {
      const { data } = await api.post(`/predictions/${predictionData.predictionId}/report`, formData)
      setReportData(data.data.report)
      setStep(3)
      toast.success('Medical report generated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate medical report.')
    } finally {
      setReportLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPredictionData(null)
    setReportData(null)
    setStep(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">AI Skin Analysis</h1>
          <p className="text-slate-400 text-sm">Upload a skin lesion image for instant EfficientNetV2-S prediction</p>
        </div>
        {step > 1 && (
          <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4 self-start sm:self-auto">
            <RiRefreshLine className="w-4 h-4" /> Start New Analysis
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/60 rounded-xl border border-white/5">
        <div className={`py-2 text-center text-xs font-semibold rounded-lg transition-colors ${step >= 1 ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'text-slate-500'}`}>
          1. Image Upload
        </div>
        <div className={`py-2 text-center text-xs font-semibold rounded-lg transition-colors ${step >= 2 ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'text-slate-500'}`}>
          2. Questionnaire
        </div>
        <div className={`py-2 text-center text-xs font-semibold rounded-lg transition-colors ${step >= 3 ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'text-slate-500'}`}>
          3. AI Medical Report
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="card glass p-6 md:p-8">
              <ImageUploader
                selectedFile={selectedFile}
                onSelectImage={(file) => setSelectedFile(file)}
                clearImage={() => setSelectedFile(null)}
              />
              <button
                onClick={handleAnalyzeImage}
                disabled={!selectedFile || loading}
                className="btn-primary w-full py-4 text-base shadow-glow mt-6"
              >
                {loading ? 'Analyzing with EfficientNetV2-S...' : 'Analyze Image'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Prediction Results & Questionnaire */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8"
          >
            <PredictionResults prediction={predictionData} />
            <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} loading={reportLoading} />
          </motion.div>
        )}

        {/* Step 3: Full Report */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <ReportViewer report={reportData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
