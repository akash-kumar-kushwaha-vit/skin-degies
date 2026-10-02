import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiStethoscopeLine,
  RiHeartPulseLine,
  RiEyeLine,
  RiHistoryLine,
  RiFileTextLine,
  RiCheckLine,
  RiUser3Line,
} from 'react-icons/ri'

const STEPS = [
  { id: 1, title: 'Patient Demographics', subtitle: 'Basic age, gender & lesion site', icon: RiUser3Line },
  { id: 2, title: 'Symptom Sensations', subtitle: 'Duration, pain, itching & burning', icon: RiHeartPulseLine },
  { id: 3, title: 'Clinical Observations', subtitle: 'Bleeding, swelling & fever', icon: RiEyeLine },
  { id: 4, title: 'Medical History', subtitle: 'Family history & systemic conditions', icon: RiHistoryLine },
  { id: 5, title: 'Medications & Notes', subtitle: 'Current treatments & extra context', icon: RiFileTextLine },
]

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {label}
      </label>
      {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
      {children}
    </div>
  )
}

function Sel({ id, reg, options }) {
  return (
    <select id={id} {...reg} className="input text-xs sm:text-sm py-2 sm:py-2.5">
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export default function QuestionnaireForm({ onSubmit, loading }) {
  const [step, setStep] = useState(1)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      age: '',
      gender: 'Prefer not to say',
      affectedBodyPart: '',
      duration: '',
      pain: 'None',
      itching: 'None',
      burning: 'None',
      bleeding: 'No',
      swelling: 'No',
      fever: 'No',
      familyHistory: 'No',
      previousSkinDisease: '',
      currentMedications: '',
      diabetes: 'No',
      immuneDisorder: 'No',
      pregnancy: 'No',
      otherSymptoms: '',
    },
  })

  const totalSteps = STEPS.length
  const currentStep = STEPS[step - 1]
  const progress = ((step - 1) / (totalSteps - 1)) * 100
  const IconComp = currentStep.icon

  const goNext = () => {
    if (step < totalSteps) setStep((s) => s + 1)
  }
  const goPrev = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  return (
    <div className="card-base p-0 overflow-hidden border border-slate-200 dark:border-white/10">
      {/* ── Questionnaire Header ── */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Step {step} of {totalSteps}
                </span>
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Stepper pills */}
          <div className="hidden sm:flex items-center gap-1.5">
            {STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                  s.id < step
                    ? 'bg-emerald-500 text-white'
                    : s.id === step
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-white/[0.06] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {s.id < step ? <RiCheckLine className="w-3.5 h-3.5" /> : s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Form Body ── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-5 sm:p-7 min-h-[260px]">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Age (Years)" hint="Patient age in years">
                  <input
                    id="q-age"
                    type="number"
                    {...register('age')}
                    placeholder="e.g. 34"
                    className="input text-xs sm:text-sm"
                    min={1}
                    max={120}
                  />
                </Field>

                <Field label="Gender" hint="Self-identified or biological">
                  <Sel
                    id="q-gender"
                    reg={register('gender')}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' },
                      { value: 'Prefer not to say', label: 'Prefer not to say' },
                    ]}
                  />
                </Field>

                <Field label="Affected Body Part" hint="Lesion anatomical site">
                  <input
                    id="q-body-part"
                    type="text"
                    {...register('affectedBodyPart')}
                    placeholder="e.g. Forearm, Face, Scalp"
                    className="input text-xs sm:text-sm"
                  />
                </Field>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <RiUser3Line className="w-4 h-4 flex-shrink-0" />
                <span>
                  Demographic data and anatomical site help the AI correlate age-specific disease incidence.
                </span>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Duration of Symptoms" hint="How long condition has been present">
                <input
                  id="q-duration"
                  type="text"
                  {...register('duration')}
                  placeholder="e.g. 5 days, 3 weeks, 2 months"
                  className="input text-xs sm:text-sm"
                />
              </Field>

              <Field label="Pain Intensity" hint="Rate perceived pain">
                <Sel
                  id="q-pain"
                  reg={register('pain')}
                  options={[
                    { value: 'None', label: 'None — Pain-free' },
                    { value: 'Mild', label: 'Mild — Barely noticeable' },
                    { value: 'Moderate', label: 'Moderate — Discomforting' },
                    { value: 'Severe', label: 'Severe — High discomfort' },
                  ]}
                />
              </Field>

              <Field label="Itching Level" hint="Urge to scratch">
                <Sel
                  id="q-itching"
                  reg={register('itching')}
                  options={[
                    { value: 'None', label: 'None — No itching' },
                    { value: 'Mild', label: 'Mild — Occasional itch' },
                    { value: 'Moderate', label: 'Moderate — Frequent' },
                    { value: 'Severe', label: 'Severe — Constant and severe' },
                  ]}
                />
              </Field>

              <Field label="Burning Sensation" hint="Warmth or stinging feeling">
                <Sel
                  id="q-burning"
                  reg={register('burning')}
                  options={[
                    { value: 'None', label: 'None — No burning' },
                    { value: 'Mild', label: 'Mild — Slight warmth' },
                    { value: 'Moderate', label: 'Moderate — Uncomfortable heat' },
                    { value: 'Severe', label: 'Severe — Intense burning' },
                  ]}
                />
              </Field>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Bleeding?" hint="Any blood from lesion">
                  <Sel
                    id="q-bleeding"
                    reg={register('bleeding')}
                    options={[
                      { value: 'No', label: 'No bleeding' },
                      { value: 'Yes - Minor', label: 'Minor / slight oozing' },
                      { value: 'Yes - Frequent', label: 'Frequent / spontaneous' },
                    ]}
                  />
                </Field>

                <Field label="Swelling / Edema" hint="Puffiness around area">
                  <Sel
                    id="q-swelling"
                    reg={register('swelling')}
                    options={[
                      { value: 'No', label: 'No swelling' },
                      { value: 'Mild', label: 'Mild puffiness' },
                      { value: 'Prominent', label: 'Prominent / spreading' },
                    ]}
                  />
                </Field>

                <Field label="Systemic Symptoms / Fever" hint="Fever or body-wide chills">
                  <Sel
                    id="q-fever"
                    reg={register('fever')}
                    options={[
                      { value: 'No', label: 'No fever' },
                      { value: 'Low Grade', label: 'Low Grade (<100°F / 37.8°C)' },
                      { value: 'High Fever', label: 'High Fever (>100°F / 37.8°C)' },
                    ]}
                  />
                </Field>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <RiEyeLine className="w-4 h-4 flex-shrink-0 text-slate-400" />
                <span>
                  Physical indicators highlight urgent conditions (such as acute infections or vascular necrosis).
                </span>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Family History" hint="First-degree family skin conditions">
                <Sel
                  id="q-family-history"
                  reg={register('familyHistory')}
                  options={[
                    { value: 'No', label: 'No family history' },
                    { value: 'Yes - Eczema/Psoriasis', label: 'Yes — Eczema / Psoriasis' },
                    { value: 'Yes - Skin Cancer', label: 'Yes — Melanoma / Skin Cancer' },
                    { value: 'Yes - Other', label: 'Yes — Other dermatological issue' },
                  ]}
                />
              </Field>

              <Field label="Diabetes Diagnosis" hint="Metabolic condition">
                <Sel
                  id="q-diabetes"
                  reg={register('diabetes')}
                  options={[
                    { value: 'No', label: 'No — Non-diabetic' },
                    { value: 'Type 1', label: 'Type 1 Diabetes' },
                    { value: 'Type 2', label: 'Type 2 Diabetes' },
                  ]}
                />
              </Field>

              <Field label="Immune Condition" hint="Immunodeficiency or autoimmune">
                <Sel
                  id="q-immune"
                  reg={register('immuneDisorder')}
                  options={[
                    { value: 'No', label: 'No immune conditions' },
                    { value: 'Yes', label: 'Yes — Known condition' },
                  ]}
                />
              </Field>

              <Field label="Pregnancy Status" hint="Applicable for treatment safety">
                <Sel
                  id="q-pregnancy"
                  reg={register('pregnancy')}
                  options={[
                    { value: 'No', label: 'Not pregnant' },
                    { value: 'Yes - 1st Trimester', label: '1st Trimester (0-12w)' },
                    { value: 'Yes - 2nd Trimester', label: '2nd Trimester (13-26w)' },
                    { value: 'Yes - 3rd Trimester', label: '3rd Trimester (27-40w)' },
                  ]}
                />
              </Field>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Previous Diagnoses" hint="Past skin diseases">
                  <input
                    id="q-prev-disease"
                    type="text"
                    {...register('previousSkinDisease')}
                    placeholder="e.g. Childhood Atopic Dermatitis"
                    className="input text-xs sm:text-sm"
                  />
                </Field>

                <Field label="Current Medications" hint="Prescription, OTC, or topical">
                  <input
                    id="q-medications"
                    type="text"
                    {...register('currentMedications')}
                    placeholder="e.g. Hydrocortisone, Cetirizine"
                    className="input text-xs sm:text-sm"
                  />
                </Field>
              </div>

              <Field label="Clinical Notes / Triggers" hint="Sun exposure, allergies, new soap/detergent, etc.">
                <textarea
                  id="q-notes"
                  {...register('otherSymptoms')}
                  rows={3}
                  placeholder="e.g. Lesion developed after outdoor hike; exacerbated by hot water..."
                  className="input text-xs sm:text-sm resize-none"
                />
              </Field>
            </div>
          )}
        </div>

        {/* ── Navigation Actions ── */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 1}
            className="btn-secondary text-xs py-2 px-3.5 rounded-lg disabled:opacity-40"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            Step {step} of {totalSteps}
          </span>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={goNext}
              className="btn-primary text-xs py-2 px-4 rounded-lg"
            >
              <span>Next Step</span>
              <RiArrowRightLine className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="q-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Gemini Medical Report...
                </span>
              ) : (
                <>
                  <RiStethoscopeLine className="w-4 h-4" />
                  <span>Generate Medical Report</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
