import { motion } from 'framer-motion'
import { RiShieldFlashLine, RiSparklingLine } from 'react-icons/ri'

const DISEASE_DESCRIPTIONS = {
  Acne: "A common skin condition occurring when hair follicles become plugged with oil and dead skin cells.",
  Actinic_Keratosis: "A rough, scaly patch on the skin caused by years of sun exposure.",
  Benign_tumors: "Non-cancerous growths on the skin including seborrheic keratoses, dermatofibromas, and hemangiomas.",
  Bullous: "Skin disorders characterized by large fluid-filled blisters (bullae).",
  Candidiasis: "Fungal infection caused by yeasts of the genus Candida affecting skin and mucosal membranes.",
  DrugEruption: "Adverse cutaneous reaction to medications, ranging from mild rashes to severe eruptions.",
  Eczema: "A condition that causes inflamed, itchy, cracked, and rough skin patches.",
  Infestations_Bites: "Cutaneous reactions resulting from insect bites, scabies, or parasitic infestations.",
  Lichen: "Inflammatory skin condition producing flat, itchy, purple or reddish bumps.",
  Lupus: "An autoimmune disease causing systemic inflammation, often presenting with a butterfly rash.",
  Moles: "Common skin growths caused by clusters of pigmented cells (melanocytes).",
  Psoriasis: "A skin disease that causes red, itchy scaly patches, most commonly on the knees, elbows, trunk and scalp.",
  Rosacea: "A common skin condition causing redness and visible blood vessels in your face.",
  Seborrh_Keratoses: "A noncancerous skin growth that often appears as a waxy brown, black, or tan growth.",
  SkinCancer: "Abnormal growth of skin cells, including melanoma, basal cell carcinoma, and squamous cell carcinoma.",
  Sun_Sunlight_Damage: "Skin changes caused by ultraviolet radiation, leading to premature aging and pigmentation.",
  Tinea: "A fungal infection of the skin commonly known as ringworm or athlete's foot.",
  Unknown_Normal: "Normal skin variations or unclassified benign cutaneous features.",
  Vascular_Tumors: "Benign or malignant neoplasms originating from blood vessels.",
  Vasculitis: "Inflammation of blood vessels causing changes in vessel walls, rash, or skin lesions.",
  Vitiligo: "A condition in which the skin loses its pigment cells (melanocytes), causing discolored patches.",
  Warts: "Small, rough skin growths caused by infections with human papillomavirus (HPV)."
}

const COLORS = ['#2563eb', '#0d9488', '#6366f1']

export default function PredictionResults({ prediction }) {
  if (!prediction || !prediction.top3) return null

  const primary = prediction.top3[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Primary Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary-500/30 bg-gradient-to-r from-primary-500/10 via-slate-900/90 to-teal-500/10 p-6 sm:p-8 shadow-card-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 badge-primary px-3 py-1">
              <RiSparklingLine className="w-3.5 h-3.5 text-primary-400" />
              <span>Primary AI Diagnosis</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {primary.disease.replace(/_/g, ' ')}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {DISEASE_DESCRIPTIONS[primary.disease] || "Cutaneous feature classified by EfficientNetV2-S deep neural network."}
            </p>
          </div>

          <div className="text-left md:text-right flex-shrink-0 bg-slate-950/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Confidence Score
            </span>
            <span className="font-display text-3xl sm:text-4xl font-extrabold gradient-brand">
              {primary.confidence.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Breakdown List */}
      <div className="card-base space-y-5 p-6 rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <RiShieldFlashLine className="w-5 h-5 text-primary-500" />
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Top 3 Differential Diagnoses
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">Model: EfficientNetV2-S</span>
        </div>

        <div className="space-y-3">
          {prediction.top3.map((item, idx) => (
            <div
              key={item.disease}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-subtle flex-shrink-0"
                  style={{ backgroundColor: `${COLORS[idx]}20`, color: COLORS[idx] }}
                >
                  #{item.rank}
                </span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {item.disease.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex-1 sm:w-48 bg-slate-200 dark:bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.confidence}%`, backgroundColor: COLORS[idx] }}
                  />
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white w-14 text-right flex-shrink-0">
                  {item.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
