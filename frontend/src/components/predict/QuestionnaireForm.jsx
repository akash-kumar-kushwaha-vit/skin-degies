import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { RiQuestionnaireLine, RiArrowRightLine, RiStethoscopeLine, RiHeartPulseLine, RiEyeLine, RiHistoryLine } from 'react-icons/ri'

export default function QuestionnaireForm({ onSubmit, loading }) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card-base p-6 sm:p-8 space-y-6 rounded-3xl"
    >
      <div className="flex items-center gap-3.5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center shadow-subtle flex-shrink-0">
          <RiQuestionnaireLine className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Clinical Questionnaire</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Patient context for Gemini medical report synthesis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Demographics */}
        <div className="form-section">
          <h4 className="form-section-label">
            <RiStethoscopeLine className="w-4 h-4" /> 1. Patient Demographics & Location
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Age (Years)</label>
              <input id="q-age" type="number" {...register('age')} placeholder="e.g. 34" className="input" min={1} max={120} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
              <select id="q-gender" {...register('gender')} className="input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Affected Body Part</label>
              <input id="q-body-part" type="text" {...register('affectedBodyPart')} placeholder="e.g. Forearm, Face, Scalp" className="input" />
            </div>
          </div>
        </div>

        {/* Section 2: Symptoms */}
        <div className="form-section">
          <h4 className="form-section-label">
            <RiHeartPulseLine className="w-4 h-4" /> 2. Symptom Sensations & Duration
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Duration</label>
              <input id="q-duration" type="text" {...register('duration')} placeholder="e.g. 5 days, 3 weeks" className="input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pain Level</label>
              <select id="q-pain" {...register('pain')} className="input">
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Itching Level</label>
              <select id="q-itching" {...register('itching')} className="input">
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Burning Sensation</label>
              <select id="q-burning" {...register('burning')} className="input">
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Physical Observations */}
        <div className="form-section">
          <h4 className="form-section-label">
            <RiEyeLine className="w-4 h-4" /> 3. Physical Observations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Bleeding?</label>
              <select id="q-bleeding" {...register('bleeding')} className="input">
                <option value="No">No</option>
                <option value="Yes - Minor">Yes - Minor</option>
                <option value="Yes - Frequent">Yes - Frequent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Swelling / Edema</label>
              <select id="q-swelling" {...register('swelling')} className="input">
                <option value="No">No</option>
                <option value="Mild">Mild</option>
                <option value="Prominent">Prominent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Fever / Systemic Symptoms</label>
              <select id="q-fever" {...register('fever')} className="input">
                <option value="No">No</option>
                <option value="Low Grade">Low Grade (&lt;100°F)</option>
                <option value="High Fever">High Fever (&gt;100°F)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: History */}
        <div className="form-section">
          <h4 className="form-section-label">
            <RiHistoryLine className="w-4 h-4" /> 4. Medical History & Conditions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Family History</label>
              <select id="q-family-history" {...register('familyHistory')} className="input">
                <option value="No">No</option>
                <option value="Yes - Eczema/Psoriasis">Yes (Eczema/Psoriasis)</option>
                <option value="Yes - Skin Cancer">Yes (Skin Cancer)</option>
                <option value="Yes - Other">Yes (Other)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Diabetes?</label>
              <select id="q-diabetes" {...register('diabetes')} className="input">
                <option value="No">No</option>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Immune Disorder?</label>
              <select id="q-immune" {...register('immuneDisorder')} className="input">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pregnancy Status</label>
              <select id="q-pregnancy" {...register('pregnancy')} className="input">
                <option value="No">No</option>
                <option value="Yes - 1st Trimester">Yes (1st Trimester)</option>
                <option value="Yes - 2nd Trimester">Yes (2nd Trimester)</option>
                <option value="Yes - 3rd Trimester">Yes (3rd Trimester)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Extra Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Previous Skin Diseases</label>
            <input id="q-prev-disease" type="text" {...register('previousSkinDisease')} placeholder="e.g. Asthma, Childhood Eczema" className="input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Current Medications</label>
            <input id="q-medications" type="text" {...register('currentMedications')} placeholder="e.g. Antihistamines, Steroid creams" className="input" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Other Symptoms / Notes</label>
          <textarea id="q-notes" {...register('otherSymptoms')} rows={2} placeholder="Triggers, progression notes, etc." className="input" />
        </div>

        <button
          id="q-submit-btn"
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-base shadow-button hover:shadow-button-hover mt-4 rounded-2xl"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Synthesizing Medical Report with Gemini...
            </span>
          ) : (
            <>
              <span>Generate Comprehensive Medical Report</span>
              <RiArrowRightLine className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
