import { useState } from 'react'
import ImageUploader from '../../components/predict/ImageUploader'
import PredictionResults from '../../components/predict/PredictionResults'
import QuestionnaireForm from '../../components/predict/QuestionnaireForm'
import ReportViewer from '../../components/predict/ReportViewer'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { RiRefreshLine, RiCheckLine, RiMicroscopeLine, RiQuestionnaireLine, RiFileTextLine } from 'react-icons/ri'

const stepsInfo = [
  { num: 1, label: 'Lesion Image', sub: 'Upload clinical photo', icon: RiMicroscopeLine },
  { num: 2, label: 'Diagnosis & Context', sub: 'Classification & symptoms', icon: RiQuestionnaireLine },
  { num: 3, label: 'Clinical Report', sub: 'Structured AI assessment', icon: RiFileTextLine },
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
      toast.success('Inference completed successfully!')
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
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            AI Skin Lesion Scan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep learning EfficientNetV2-S classification with Gemini clinical reporting
          </p>
        </div>

        {step > 1 && (
          <button
            onClick={handleReset}
            className="btn-secondary text-xs py-2 px-3.5 self-start sm:self-auto rounded-xl"
          >
            <RiRefreshLine className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        )}
      </div>

      {/* ── Minimal Linear-style Stepper ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {stepsInfo.map(({ num, label, sub, icon: Icon }) => {
          const isActive = step === num
          const isDone = step > num

          return (
            <div
              key={num}
              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/50 dark:border-blue-500/40'
                  : isDone
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/30 dark:border-emerald-500/20'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-white/[0.06] opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isDone ? <RiCheckLine className="w-3.5 h-3.5" /> : num}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                    {label}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block truncate">
                    {sub}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Step 1: Upload ── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="card-base p-5 sm:p-7 space-y-6">
            <ImageUploader
              selectedFile={selectedFile}
              onSelectImage={(file) => setSelectedFile(file)}
              clearImage={() => setSelectedFile(null)}
            />

            <button
              id="analyze-image-btn"
              onClick={handleAnalyzeImage}
              disabled={!selectedFile || loading}
              className="btn-primary w-full py-3 text-sm rounded-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running Neural Network Inference...
                </span>
              ) : (
                <>
                  <RiMicroscopeLine className="w-4 h-4" />
                  <span>Analyze Lesion with EfficientNetV2-S</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Prediction Results & Clinical Questionnaire ── */}
      {step === 2 && (
        <div className="space-y-6">
          <PredictionResults prediction={predictionData} />
          <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} loading={reportLoading} />
        </div>
      )}

      {/* ── Step 3: Medical Report ── */}
      {step === 3 && (
        <div className="space-y-6">
          <ReportViewer report={reportData} />
        </div>
      )}
    </div>
  )
}
