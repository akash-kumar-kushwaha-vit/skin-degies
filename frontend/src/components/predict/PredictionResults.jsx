import { RiShieldFlashLine, RiInformationLine } from 'react-icons/ri'

const DISEASE_DESCRIPTIONS = {
  Acne: "A common skin condition occurring when hair follicles become plugged with oil and dead skin cells.",
  Actinic_Keratosis: "A rough, scaly patch on the skin caused by years of sun exposure, considered pre-cancerous.",
  Benign_tumors: "Non-cancerous growths on the skin including seborrheic keratoses, dermatofibromas, and hemangiomas.",
  Bullous: "Skin disorders characterized by large fluid-filled blisters (bullae).",
  Candidiasis: "Fungal infection caused by yeasts of the genus Candida affecting skin and mucosal membranes.",
  DrugEruption: "Adverse cutaneous reaction to medications, ranging from mild rashes to severe eruptions.",
  Eczema: "A condition that causes inflamed, itchy, cracked, and rough skin patches.",
  Infestations_Bites: "Cutaneous reactions resulting from insect bites, scabies, or parasitic infestations.",
  Lichen: "Inflammatory skin condition producing flat, itchy, purple or reddish bumps.",
  Lupus: "An autoimmune disease causing systemic inflammation, often presenting with a characteristic butterfly rash.",
  Moles: "Common skin growths caused by clusters of pigmented cells (melanocytes).",
  Psoriasis: "A skin disease that causes red, itchy scaly patches, commonly on knees, elbows, trunk, and scalp.",
  Rosacea: "A chronic inflammatory skin condition causing redness and visible blood vessels on the face.",
  Seborrh_Keratoses: "A noncancerous skin growth that often appears as a waxy brown, black, or tan plaque.",
  SkinCancer: "Abnormal growth of skin cells, including melanoma, basal cell carcinoma, and squamous cell carcinoma.",
  Sun_Sunlight_Damage: "Skin alterations caused by ultraviolet radiation, leading to elastosis, mottling, and pigmentation.",
  Tinea: "A fungal infection of the keratinized skin layers commonly known as ringworm or athlete's foot.",
  Unknown_Normal: "Normal cutaneous variations or unclassified benign skin features.",
  Vascular_Tumors: "Benign or malignant neoplasms originating from blood vessels or endothelial cells.",
  Vasculitis: "Inflammation of blood vessels causing palpable purpura, cutaneous necrosis, or skin lesions.",
  Vitiligo: "A chronic disorder in which the skin loses melanocytes, causing smooth, discolored patches.",
  Warts: "Small, rough benign skin growths caused by localized infection with human papillomavirus (HPV)."
}

export default function PredictionResults({ prediction }) {
  if (!prediction || !prediction.top3) return null

  const primary = prediction.top3[0]
  const formattedDisease = primary.disease.replace(/_/g, ' ')
  const isHighConfidence = primary.confidence >= 80

  return (
    <div className="space-y-4">
      {/* ── Primary Diagnostic Card ── */}
      <div className="card-base p-5 sm:p-6 border border-slate-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`badge ${isHighConfidence ? 'badge-success' : 'badge-primary'} text-xs font-semibold`}>
                Primary AI Classification
              </span>
              <span className="text-xs text-slate-400 font-mono">
                EfficientNetV2-S
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white capitalize tracking-tight">
              {formattedDisease}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {DISEASE_DESCRIPTIONS[primary.disease] || "Cutaneous feature classified by deep convolutional neural network."}
            </p>
          </div>

          <div className="sm:text-right flex-shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] min-w-[140px]">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Confidence
            </span>
            <span className="font-display text-3xl font-extrabold text-blue-600 dark:text-blue-400 block mt-0.5">
              {primary.confidence.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Model Top-1 Output
            </span>
          </div>
        </div>
      </div>

      {/* ── Top 3 Differential Diagnoses ── */}
      <div className="card-base p-5 sm:p-6 border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <RiShieldFlashLine className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Differential Diagnoses (Top 3)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Multi-class Probability Distribution
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/[0.06] mt-1">
          {prediction.top3.map((item, idx) => (
            <div
              key={item.disease}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium text-sm text-slate-900 dark:text-white capitalize">
                  {item.disease.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-64 pl-8 sm:pl-0">
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : idx === 1
                        ? 'bg-indigo-500'
                        : 'bg-slate-400 dark:bg-slate-500'
                    }`}
                    style={{ width: `${Math.min(item.confidence, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 w-12 text-right">
                  {item.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
