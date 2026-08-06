import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiMicroscopeLine, RiShieldCheckLine, RiFileTextLine,
  RiSpeedLine, RiTeamLine, RiArrowRightLine, RiCheckboxCircleLine,
} from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'

const CLASSES = [
  'Acne','Actinic Keratosis','Benign Tumors','Bullous','Candidiasis',
  'Drug Eruption','Eczema','Infestations/Bites','Lichen','Lupus','Moles',
  'Psoriasis','Rosacea','Seborrh. Keratoses','Skin Cancer','Sun Damage',
  'Tinea','Unknown/Normal','Vascular Tumors','Vasculitis','Vitiligo','Warts'
]

const features = [
  { icon: RiMicroscopeLine, title: 'AI-Powered Detection', desc: 'EfficientNetV2-S deep learning model trained on thousands of skin disease images with 81.56% validation accuracy.' },
  { icon: RiFileTextLine, title: 'Professional Reports', desc: 'Gemini 2.5 Flash generates comprehensive medical reports with risk assessment, causes, and recommendations.' },
  { icon: RiShieldCheckLine, title: 'Private & Secure', desc: 'Your images and data are encrypted. JWT authentication, rate limiting, and HIPAA-aligned data handling.' },
  { icon: RiSpeedLine, title: 'Instant Results', desc: 'Get top-3 disease predictions with confidence scores in seconds, with a full medical report in under a minute.' },
]

const stats = [
  { value: '81.56%', label: 'Validation Accuracy' },
  { value: '89.75%', label: 'Top-3 Accuracy' },
  { value: '22', label: 'Disease Classes' },
  { value: '<2s', label: 'Analysis Time' },
]

const team = [
  { name: 'AI Research Team', role: 'Deep Learning & Model Training' },
  { name: 'Clinical Advisors', role: 'Medical Validation & Guidelines' },
  { name: 'Engineering Team', role: 'Platform Development' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  }),
}

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center animated-bg pt-16">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container-app relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 badge-primary mb-6 py-1.5 px-4 text-sm"
            >
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              EfficientNetV2-S · 22 Disease Classes · 81.56% Accuracy
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              AI-Powered{' '}
              <span className="gradient-text">Skin Disease</span>
              <br />Detection
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              Upload a skin lesion image, answer a few questions, and receive a
              comprehensive AI-generated medical report — powered by deep learning
              and Gemini 2.5 Flash.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to={user ? '/predict' : '/register'}
                className="btn-primary text-base py-3.5 px-8 shadow-glow"
              >
                {user ? 'Start Analysis' : 'Get Started Free'}
                <RiArrowRightLine className="w-5 h-5" />
              </Link>
              <a href="#features" className="btn-secondary text-base py-3.5 px-8">
                Learn More
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="glass rounded-2xl p-4">
                  <p className="font-display text-3xl font-bold gradient-text">{value}</p>
                  <p className="text-slate-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-950">
        <div className="container-app">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Why <span className="gradient-text">SkinDegies AI</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Medical-grade AI analysis in seconds — no appointment needed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="card group hover:border-primary-500/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disease Classes ───────────────────────────────────────────── */}
      <section id="accuracy" className="py-24 bg-slate-900/40">
        <div className="container-app">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              22 <span className="gradient-text">Detectable</span> Conditions
            </h2>
            <p className="text-slate-400">Trained on diverse clinical datasets with EfficientNetV2-S</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2">
            {CLASSES.map((cls, i) => (
              <motion.span
                key={cls}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="badge-primary py-1.5 px-3 text-sm"
              >
                <RiCheckboxCircleLine className="w-3.5 h-3.5" />
                {cls}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section id="team" className="py-24 bg-slate-950">
        <div className="container-app">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Our <span className="gradient-text">Team</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map(({ name, role }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="card text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center mx-auto mb-4 shadow-glow-purple">
                  <RiTeamLine className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white">{name}</h3>
                <p className="text-slate-400 text-sm mt-1">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ────────────────────────────────────────────── */}
      <section id="contact" className="py-24 animated-bg">
        <div className="container-app">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Get Analyzed</span>?
            </h2>
            <p className="text-slate-400 mb-8">
              Create a free account and get your first AI skin analysis in under 2 minutes.
            </p>
            <Link
              to={user ? '/predict' : '/register'}
              className="btn-primary text-base py-4 px-10 shadow-glow"
            >
              {user ? 'Start Analysis Now' : 'Create Free Account'}
              <RiArrowRightLine className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
