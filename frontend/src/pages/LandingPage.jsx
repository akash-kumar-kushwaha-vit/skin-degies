import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiMicroscopeLine, RiShieldCheckLine, RiFileTextLine,
  RiSpeedLine, RiTeamLine, RiArrowRightLine, RiCheckboxCircleLine,
  RiSparklingLine, RiPulseLine, RiStethoscopeLine, RiUploadCloud2Line,
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
    title: 'AI-Powered Detection',
    desc: 'EfficientNetV2-S deep learning model trained on thousands of skin disease images with 81.56% validation accuracy.',
    color: 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border-primary-200/70 dark:border-primary-800/40',
    accent: 'from-primary-500/20 to-transparent',
  },
  {
    icon: RiFileTextLine,
    title: 'Professional Reports',
    desc: 'Gemini 2.5 Flash generates comprehensive medical reports with risk assessment, causes, and tailored recommendations.',
    color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200/70 dark:border-teal-800/40',
    accent: 'from-teal-500/20 to-transparent',
  },
  {
    icon: RiShieldCheckLine,
    title: 'Private & Secure',
    desc: 'Your images and data are encrypted. JWT authentication, rate limiting, and HIPAA-aligned data handling.',
    color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/40',
    accent: 'from-emerald-500/20 to-transparent',
  },
  {
    icon: RiSpeedLine,
    title: 'Instant Results',
    desc: 'Get top-3 disease predictions with confidence scores in seconds, with a full medical report in under a minute.',
    color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200/70 dark:border-violet-800/40',
    accent: 'from-violet-500/20 to-transparent',
  },
]

const stats = [
  { value: '81.56%', label: 'Validation Accuracy', desc: 'Top-1' },
  { value: '89.75%', label: 'Top-3 Accuracy', desc: 'Multi-class' },
  { value: '22', label: 'Disease Classes', desc: 'Conditions' },
  { value: '<2s', label: 'Analysis Time', desc: 'Per image' },
]

const trustStats = [
  { value: '22', label: 'Skin Conditions', icon: RiMicroscopeLine },
  { value: '81.56%', label: 'Model Accuracy', icon: RiBarChartLine },
  { value: 'HIPAA', label: 'Aligned Security', icon: RiLockLine },
  { value: 'Gemini', label: '2.5 Flash Reports', icon: RiFileTextLine },
]

const howItWorks = [
  {
    num: '01',
    icon: RiUploadCloud2Line,
    title: 'Upload Skin Image',
    desc: 'Drag & drop or select a clinical macro or dermoscopic photo. Supports JPEG, PNG, WebP up to 10 MB.',
    color: 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border-primary-200/70 dark:border-primary-800/40',
  },
  {
    num: '02',
    icon: RiHeartPulseLine,
    title: 'Answer Clinical Questions',
    desc: 'Provide brief symptom context — age, duration, sensations, medical history — to enrich the AI report.',
    color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200/70 dark:border-teal-800/40',
  },
  {
    num: '03',
    icon: RiFileTextLine,
    title: 'Receive Medical Report',
    desc: 'Get a structured AI report with top-3 predictions, risk level, causes, lifestyle guidance, and when to see a doctor.',
    color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200/70 dark:border-violet-800/40',
  },
]

const team = [
  { name: 'AI Research Team', role: 'Deep Learning & Model Training', icon: RiMicroscopeLine },
  { name: 'Clinical Advisors', role: 'Medical Validation & Guidelines', icon: RiStethoscopeLine },
  { name: 'Engineering Team', role: 'Platform Development & Infrastructure', icon: RiSpeedLine },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="overflow-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-20">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_rgba(37,99,235,0.11),_transparent_50%),radial-gradient(ellipse_at_80%_0%,_rgba(13,148,136,0.08),_transparent_40%),linear-gradient(180deg,#f8fbff_0%,#f3f7fb_40%,#edf4fb_100%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,_rgba(59,130,246,0.18),_transparent_50%),radial-gradient(ellipse_at_80%_0%,_rgba(16,185,129,0.09),_transparent_40%),linear-gradient(180deg,#071120_0%,#0a1729_35%,#081421_100%)]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.3] dark:opacity-[0.18]"
          style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="container-app relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] max-w-6xl mx-auto">

            {/* Left: Copy */}
            <div className="space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center lg:justify-start"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/85 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700 shadow-subtle backdrop-blur-xl dark:border-teal-800/70 dark:bg-slate-900/80 dark:text-teal-300">
                  <RiSparklingLine className="w-3.5 h-3.5" />
                  EfficientNetV2-S · Advanced Clinical AI
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="font-display font-black tracking-[-0.05em] text-balance"
                style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}
              >
                <span className="block text-slate-900 dark:text-white">AI-Powered</span>
                <span className="block gradient-brand">Skin Disease</span>
                <span className="block text-slate-900 dark:text-white">Detection</span>
              </motion.h1>

              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 lg:text-left mx-auto lg:mx-0 leading-relaxed"
              >
                Upload a skin lesion image, answer a few clinical questions, and receive a comprehensive AI-generated medical report — powered by deep learning and Gemini 2.5 Flash.
              </motion.p>

              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              >
                <Link
                  to={user ? '/predict' : '/register'}
                  className="btn-primary text-sm py-3.5 px-8 rounded-xl"
                >
                  <span>{user ? 'Start AI Scan' : 'Get Started Free'}</span>
                  <RiArrowRightLine className="w-4 h-4" />
                </Link>
                <a href="#features" className="btn-secondary text-sm py-3.5 px-8 rounded-xl">
                  Explore Features
                </a>
              </motion.div>

              {/* Mini Stats */}
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="grid grid-cols-2 gap-3 pt-2 max-w-sm mx-auto lg:mx-0"
              >
                {stats.map(({ value, label, desc }) => (
                  <div
                    key={label}
                    className="card-base rounded-2xl px-4 py-4 text-left hover:-translate-y-1 hover:border-primary-300/60 dark:hover:border-primary-700/40 transition-all duration-300"
                  >
                    <p className="font-display text-2xl font-black gradient-brand">{value}</p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Product UI Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-md"
            >
              {/* Ambient glow */}
              <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-primary-500/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

              {/* Card shell */}
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_32px_80px_-30px_rgba(15,23,42,0.4)] backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/85">
                <div className="rounded-[1.6rem] border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/80 dark:bg-slate-950/60">

                  {/* Card header */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200/70 dark:border-slate-800/70">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Live Analysis</p>
                      <h3 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white font-display">Skin Scan</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>

                  {/* Image scan area */}
                  <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 p-3 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                    <div className="relative h-56 overflow-hidden rounded-[1.1rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_40%),linear-gradient(135deg,#dbeafe,#e0f2fe_45%,#ccfbf1)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_38%),linear-gradient(135deg,#0f172a,#1e293b_40%,#0f172a)]">
                      {/* Scan frame */}
                      <div className="absolute inset-4 rounded-[1.1rem] border border-white/50 dark:border-slate-700/70" />
                      {/* Center circle */}
                      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-[8px] border-white/60 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.15)] dark:border-slate-300/50" />
                      {/* Corner markers */}
                      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
                        <div key={pos} className={`absolute ${pos} w-4 h-4 border-2 border-primary-400/70 dark:border-primary-500/60`}
                          style={{ borderRadius: pos.includes('top-4 left-4') ? '4px 0 0 0' : pos.includes('top-4 right-4') ? '0 4px 0 0' : pos.includes('bottom-4 left-4') ? '0 0 0 4px' : '0 0 4px 0' }} />
                      ))}
                      {/* Result overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl border border-white/50 bg-white/65 px-3 py-2.5 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/65">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Prediction</p>
                          <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">Actinic Keratosis</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Confidence</p>
                          <p className="mt-0.5 text-base font-black text-primary-600 dark:text-primary-400">92%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metric pills */}
                  <div className="mt-3.5 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Model', val: 'EffNetV2' },
                      { label: 'Confidence', val: '89%' },
                      { label: 'Report', val: 'Ready' },
                    ].map(({ label, val }) => (
                      <div key={label} className="rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-center shadow-subtle dark:border-slate-700/80 dark:bg-slate-900/80">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                        <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200/60 dark:border-white/[0.05] bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm py-6">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustStats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/70 dark:border-primary-800/40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-display font-bold text-slate-900 dark:text-white text-lg leading-none">{value}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white dark:bg-[#080e1a]">
        <div className="container-app">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="section-label">
              <RiSparklingLine className="w-3.5 h-3.5" /> Clinical Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why <span className="gradient-brand">SkinDegies AI</span>?
            </h2>
            <div className="section-divider" />
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
              Medical-grade AI analysis in seconds — designed for rapid clinical triage assistance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc, color, accent }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="card-hover flex gap-5 items-start p-6 group overflow-hidden relative"
              >
                {/* Subtle accent gradient */}
                <div className={`absolute top-0 left-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-4 -translate-y-4 blur-2xl pointer-events-none`} />
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 relative z-10">
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50/90 dark:bg-[#060b14] border-y border-slate-200/50 dark:border-white/[0.04]">
        <div className="container-app">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="section-label">
              <RiPulseLine className="w-3.5 h-3.5" /> Three Steps
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It <span className="gradient-brand">Works</span>
            </h2>
            <div className="section-divider" />
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
              From image upload to structured medical report — in under a minute.
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-px bg-gradient-to-r from-primary-300/50 via-teal-300/50 to-violet-300/50 dark:from-primary-700/40 dark:via-teal-700/40 dark:to-violet-700/40" />

            {howItWorks.map(({ num, icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={num}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="flex flex-col items-center text-center group relative"
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black flex items-center justify-center font-display leading-none">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
            className="text-center mt-12"
          >
            <Link to={user ? '/predict' : '/register'} className="btn-primary text-sm py-3 px-7 rounded-xl">
              <span>Try It Now</span>
              <RiArrowRightLine className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Detectable Conditions ─────────────────────────────────────── */}
      <section id="accuracy" className="py-24 bg-white dark:bg-[#080e1a]">
        <div className="container-app">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="section-label">
              <RiCheckboxCircleLine className="w-3.5 h-3.5 text-teal-500" /> 22 Multi-Class Model
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              22 <span className="gradient-brand">Detectable</span> Conditions
            </h2>
            <div className="section-divider" />
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Trained on diverse clinical datasets with EfficientNetV2-S architecture
            </p>
          </motion.div>

          {/* Condition pills with fade edges */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-[#080e1a] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#080e1a] to-transparent pointer-events-none z-10" />
            <div className="flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto py-2">
              {CLASSES.map((cls, i) => (
                <motion.span
                  key={cls}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-subtle cursor-default ${
                    i % 3 === 0 ? 'badge-primary'
                    : i % 3 === 1 ? 'badge-teal'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/40'
                  }`}
                >
                  <RiCheckboxCircleLine className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  {cls.replace(/_/g, ' ')}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section id="team" className="py-24 bg-slate-50/90 dark:bg-[#060b14] border-y border-slate-200/50 dark:border-white/[0.04]">
        <div className="container-app">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="section-label">
              <RiTeamLine className="w-3.5 h-3.5" /> Expert Collaboration
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our <span className="gradient-brand">Team</span>
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map(({ name, role, icon: Icon }, i) => (
              <motion.div
                key={name}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="card-hover text-center py-10 px-6 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-primary-50 dark:from-teal-950/60 dark:to-primary-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 flex items-center justify-center mx-auto mb-5 shadow-subtle transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base mb-2">{name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section id="contact" className="py-28 relative overflow-hidden bg-[#0b1229] dark:bg-[#060913]">
        {/* Decorative layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-[#0b1229] to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-violet-600/8 rounded-full blur-[80px] pointer-events-none" />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="container-app relative z-10">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-500/15 text-primary-400 border border-primary-400/20 flex items-center justify-center mx-auto">
              <RiPulseLine className="w-8 h-8" />
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white text-balance">
              Ready to Analyze Skin<br className="hidden sm:block" /> Lesions with AI?
            </h2>

            <p className="text-slate-300/80 text-base max-w-xl mx-auto leading-relaxed">
              Create a free account and get instant multi-class AI predictions and structured medical report insights.
            </p>

            {/* Feature checklist */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300/70">
              {['No credit card required', 'HIPAA-aligned security', 'Instant predictions'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <RiCheckboxCircleLine className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={user ? '/predict' : '/register'}
                className="btn-primary text-sm py-3.5 px-8 rounded-xl"
              >
                <span>{user ? 'Start Analysis Now' : 'Create Free Account'}</span>
                <RiArrowRightLine className="w-4 h-4" />
              </Link>
              {!user && (
                <Link to="/login" className="text-sm text-slate-300/80 hover:text-white font-medium transition-colors">
                  Already have an account? Sign in →
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
