import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUploader from '../../components/predict/ImageUploader'
import PredictionResults from '../../components/predict/PredictionResults'
import QuestionnaireForm from '../../components/predict/QuestionnaireForm'
import ReportViewer from '../../components/predict/ReportViewer'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { RiRefreshLine, RiCheckLine, RiMicroscopeLine, RiQuestionnaireLine, RiFileTextLine } from 'react-icons/ri'

const stepsInfo = [
  { num: 1, label: 'Image Upload', sub: 'Select skin lesion photo', icon: RiMicroscopeLine },
  { num: 2, label: 'Clinical Context', sub: 'Answer health questions', icon: RiQuestionnaireLine },
  { num: 3, label: 'Medical Report', sub: 'AI-generated analysis', icon: RiFileTextLine },
]

export default function PredictPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [predictionData, setPredictionData] = useState(null)
  const [reportData, setReportData] = useState(null)

  const handleAnalyzeImage = async () => {
    if (!selectedFile) return toast.error('Please select an image first.')

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']
    const maxSize = 10 * 1024 * 1024

    if (!allowedTypes.includes(selectedFile.type)) {
      return toast.error('Unsupported file type. Please upload a JPG, PNG, WEBP, or BMP image.')
    }

    if (selectedFile.size <= 0) {
      return toast.error('The selected file is empty. Please choose a valid image file.')
    }

    if (selectedFile.size > maxSize) {
      return toast.error('Image is too large. Please upload an image under 10 MB.')
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)
    try {
      const { data } = await api.post('/predictions/predict', formData)
      setPredictionData(data.data)
      setStep(2)
      toast.success('AI Prediction complete!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            AI Skin Lesion Scan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Upload a skin image for instant EfficientNetV2-S prediction & Gemini medical report
          </p>
        </div>
        {step > 1 && (
          <button onClick={handleReset} className="btn-secondary text-xs py-2 px-4 self-start rounded-xl flex-shrink-0">
            <RiRefreshLine className="w-4 h-4" /> Start New Analysis
          </button>
        )}
      </div>

      {/* ── Step Indicator ── */}
      <div className="card-base rounded-2xl p-5 bg-white/90 dark:bg-slate-900/60">
        <div className="relative flex items-start gap-0">
          {/* Progress line */}
          <div className="absolute top-[18px] left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-0.5 bg-slate-200 dark:bg-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full transition-all duration-700 ease-spring"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />
          </div>

          {stepsInfo.map(({ num, label, sub, icon: Icon }) => {
            const isActive = step === num
            const isDone = step > num

            return (
              <div key={num} className="flex-1 flex flex-col items-center gap-2 relative">
                {/* Circle */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-400 ${isDone
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'
                  : isActive
                    ? 'bg-primary-600 border-primary-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.2)]'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                  }`}>
                  {isDone
                    ? <RiCheckLine className="w-4 h-4" />
                    : isActive
                      ? <Icon className="w-4 h-4" />
                      : <span className="text-xs font-bold">{num}</span>
                  }
                </div>
                {/* Labels */}
                <div className="text-center">
                  <p className={`text-xs font-bold leading-none transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : isDone ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block">{sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Step Content ── */}
      <AnimatePresence mode="wait">
        {/* Step 1 */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="card-base p-6 sm:p-8 rounded-3xl space-y-6">
              <ImageUploader
                selectedFile={selectedFile}
                onSelectImage={(file) => setSelectedFile(file)}
                clearImage={() => setSelectedFile(null)}
              />
              <button
                id="analyze-image-btn"
                onClick={handleAnalyzeImage}
                disabled={!selectedFile || loading}
                className="btn-primary w-full py-4 text-sm rounded-2xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing with EfficientNetV2-S...
                  </span>
                ) : (
                  <>
                    <RiMicroscopeLine className="w-5 h-5" />
                    Analyze Image with AI
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <PredictionResults prediction={predictionData} />
            <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} loading={reportLoading} />
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReportViewer report={reportData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
