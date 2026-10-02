import { Link } from 'react-router-dom'
import {
  RiMicroscopeLine, RiShieldCheckLine, RiFileTextLine,
  RiSpeedLine, RiArrowRightLine, RiCheckboxCircleLine,
  RiSparklingLine, RiPulseLine, RiUploadCloud2Line,
  RiBarChartLine, RiLockLine, RiHeartPulseLine
} from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'

const CLASSES = [
  'Acne', 'Actinic Keratosis', 'Benign Tumors', 'Bullous', 'Candidiasis',
  'Drug Eruption', 'Eczema', 'Infestations/Bites', 'Lichen', 'Lupus', 'Moles',
  'Psoriasis', 'Rosacea', 'Seborrh. Keratoses', 'Skin Cancer', 'Sun Damage',
  'Tinea', 'Unknown/Normal', 'Vascular Tumors', 'Vasculitis', 'Vitiligo', 'Warts',
]

const features = [
  {
    icon: RiMicroscopeLine,
    title: 'Multi-Class Convolutional Network',
    desc: 'Fine-tuned EfficientNetV2-S neural network trained on thousands of dermatological lesions with 81.56% validation accuracy.',
    badge: 'PyTorch Inference',
  },
  {
    icon: RiFileTextLine,
    title: 'Generative Clinical Reports',
    desc: 'Gemini 2.5 Flash clinical engine compiles visual findings, symptom history, risk stratification, and patient guidance into exportable reports.',
    badge: 'Gemini 2.5 Flash',
  },
  {
    icon: RiShieldCheckLine,
    title: 'HIPAA & Session Security',
    desc: 'Protected health information safeguards, cryptographically signed JWT sessions, rate limiting, and encrypted storage.',
    badge: 'HIPAA Aligned',
  },
  {
    icon: RiSpeedLine,
    title: 'Real-time Triage Inferences',
    desc: 'Generate top-3 differential diagnoses with comparative confidence distributions and response latencies under 200 milliseconds.',
    badge: '<200ms Latency',
  },
]

const stats = [
  { value: '81.56%', label: 'Top-1 Accuracy', desc: 'Validation benchmark' },
  { value: '89.75%', label: 'Top-3 Differential', desc: 'Multi-class probability' },
  { value: '22', label: 'Lesion Categories', desc: 'Dermatological classes' },
  { value: '<200ms', label: 'Inference Speed', desc: 'Per image analysis' },
]

const howItWorks = [
  {
    num: '01',
    icon: RiUploadCloud2Line,
    title: 'Capture or Upload Photo',
    desc: 'Select a clean macro or dermoscopic skin lesion image in JPEG, PNG, or WebP format up to 10 MB.',
  },
  {
    num: '02',
    icon: RiHeartPulseLine,
    title: 'Provide Clinical Context',
    desc: 'Optionally note patient duration, pain, itching sensations, and medical history to inform the generative report.',
  },
  {
    num: '03',
    icon: RiFileTextLine,
    title: 'Review Structured Assessment',
    desc: 'Access ranked differential classifications, confidence bars, and a printable physician summary.',
  },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* ── Hero Section ── */}
      <section className="pt-28 sm:pt-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <RiSparklingLine className="w-3.5 h-3.5" />
              <span>EfficientNetV2-S · Clinical AI Dermatology</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Clinical AI for <br className="hidden sm:inline" />
              <span className="text-blue-600 dark:text-blue-400">Skin Lesion Triage</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Upload clinical dermatological images to receive instant 22-class neural network predictions,
              top-3 differential scores, and structured Gemini clinical assessment reports.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to={user ? '/predict' : '/register'}
                className="btn-primary text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-sm"
              >
                <span>{user ? 'Start AI Lesion Scan' : 'Get Started Free'}</span>
                <RiArrowRightLine className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="btn-secondary text-xs sm:text-sm py-2.5 px-5 rounded-xl"
              >
                Explore Capabilities
              </a>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/60 dark:border-white/[0.06]">
              {stats.map(({ value, label, desc }) => (
                <div key={label} className="text-center lg:text-left">
                  <p className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {value}
                  </p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">{label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Product UI Mockup */}
          <div className="lg:col-span-5 mx-auto w-full max-w-md">
            <div className="card-base p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              {/* Mockup Top */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-display font-semibold text-xs text-slate-900 dark:text-white">
                    Clinical Lesion Analysis
                  </span>
                </div>
                <span className="badge-primary text-[10px] font-mono">
                  EffNetV2-S
                </span>
              </div>

              {/* Mockup Preview Area */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Primary Classification</span>
                  <span className="badge-success text-[11px] font-mono">94.2% Match</span>
                </div>
                <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Actinic Keratosis
                </p>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                </div>
              </div>

              {/* Differential List */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Differential Probability
                </span>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 dark:bg-white/[0.02]">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">1. Actinic Keratosis</span>
                  <span className="font-mono text-slate-900 dark:text-white font-semibold">94.2%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 dark:bg-white/[0.02]">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">2. Seborrheic Keratosis</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">3.8%</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 dark:bg-white/[0.02]">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">3. Basal Cell / Cancer</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">1.2%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                <span>Gemini Medical Report</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Ready for review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">
            Clinical Platform Features
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Built for Accurate Dermatological Decision Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Designed for clinical efficiency, patient data privacy, and explainable multi-class inference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, desc, badge }) => (
            <div key={title} className="card-interactive p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="badge-neutral text-[10px] font-mono">{badge}</span>
              </div>
              <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-base p-6 sm:p-10 border border-slate-200 dark:border-white/10 space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Workflow
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Three-Step Diagnostic Protocol
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              From photo capture to complete diagnostic documentation in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="space-y-3 p-4 rounded-xl bg-slate-50/60 dark:bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
                    {num}
                  </div>
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported 22 Conditions ── */}
      <section id="conditions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Pathological Coverage
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            22 Detectable Cutaneous Classes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calibrated across inflammatory, infectious, autoimmune, and neoplastic skin conditions.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {CLASSES.map((cls) => (
            <span
              key={cls}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] text-slate-700 dark:text-slate-300"
            >
              <RiCheckboxCircleLine className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span>{cls.replace(/_/g, ' ')}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Call to Action Strip ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 sm:p-12 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to enhance your clinical workflow?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Create your account to start screening skin lesions with EfficientNetV2-S and generating structured Gemini reports.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to={user ? '/predict' : '/register'}
              className="btn-primary text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-sm"
            >
              <span>{user ? 'Open Workspace' : 'Create Free Account'}</span>
              <RiArrowRightLine className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
