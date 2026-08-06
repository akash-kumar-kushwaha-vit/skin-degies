import { motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
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

const COLORS = ['#38bdf8', '#818cf8', '#a78bfa']

export default function PredictionResults({ prediction }) {
  if (!prediction || !prediction.top3) return null

  const chartData = prediction.top3.map((item) => ({
    name: item.disease.replace(/_/g, ' '),
    confidence: item.confidence,
  }))

  const primary = prediction.top3[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Primary Banner */}
      <div className="card glass border-primary-500/30 bg-gradient-to-r from-primary-950/40 to-slate-900/60 p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 badge-primary mb-2">
              <RiSparklingLine className="w-4 h-4 text-primary-400" /> Primary AI Prediction
            </div>
            <h3 className="font-display text-3xl font-bold text-white">
              {primary.disease.replace(/_/g, ' ')}
            </h3>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              {DISEASE_DESCRIPTIONS[primary.disease] || "Cutaneous manifestation identified by EfficientNetV2-S model."}
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-slate-400 text-xs uppercase tracking-wider block">Confidence Score</span>
            <span className="font-display text-4xl font-extrabold gradient-text-blue">
              {primary.confidence.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 3 Cards */}
        <div className="card glass space-y-4">
          <h4 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <RiShieldFlashLine className="w-5 h-5 text-primary-400" />
            Top 3 Probabilities
          </h4>
          <div className="space-y-3">
            {prediction.top3.map((item, idx) => (
              <div
                key={item.disease}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${COLORS[idx]}20`, color: COLORS[idx] }}
                  >
                    #{item.rank}
                  </span>
                  <span className="font-medium text-slate-200">
                    {item.disease.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="font-bold text-slate-100">{item.confidence.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Chart */}
        <div className="card glass flex flex-col">
          <h4 className="font-display font-semibold text-lg text-white mb-4">
            Confidence Distribution
          </h4>
          <div className="h-48 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`${val}%`, 'Confidence']}
                />
                <Bar dataKey="confidence" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
