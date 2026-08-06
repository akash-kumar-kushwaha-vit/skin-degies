import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { RiQuestionnaireLine, RiArrowRightLine } from 'react-icons/ri'

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card glass p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30 flex items-center justify-center">
          <RiQuestionnaireLine className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-white">Clinical Questionnaire</h3>
          <p className="text-slate-400 text-xs">Answer these questions to help Gemini generate your medical report</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Demographics */}
        <div>
          <h4 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">
            1. Patient Demographics & Location
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Age</label>
              <input type="number" {...register('age')} placeholder="e.g. 28" className="input" min={1} max={120} />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Gender</label>
              <select {...register('gender')} className="input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Affected Body Part</label>
              <input type="text" {...register('affectedBodyPart')} placeholder="e.g. Left Arm, Scalp" className="input" />
            </div>
          </div>
        </div>

        {/* Section 2: Symptoms & Severity */}
        <div>
          <h4 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">
            2. Symptom Details & Sensations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Duration of Condition</label>
              <input type="text" {...register('duration')} placeholder="e.g. 3 days, 2 weeks" className="input" />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Pain Level</label>
              <select {...register('pain')} className="input">
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Itching Level</label>
              <select {...register('itching')} className="input">
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Burning Sensation</label>
              <select {...register('burning')} className="input">
                <option value="None">None</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Physical Observations */}
        <div>
          <h4 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">
            3. Physical Observations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Bleeding?</label>
              <select {...register('bleeding')} className="input">
                <option value="No">No</option>
                <option value="Yes - Minor">Yes - Minor</option>
                <option value="Yes - Frequent">Yes - Frequent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Swelling / Edema?</label>
              <select {...register('swelling')} className="input">
                <option value="No">No</option>
                <option value="Mild">Mild</option>
                <option value="Prominent">Prominent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Fever / Systemic Symptoms?</label>
              <select {...register('fever')} className="input">
                <option value="No">No</option>
                <option value="Low Grade">Low Grade (&lt;100°F)</option>
                <option value="High Fever">High Fever (&gt;100°F)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Medical History */}
        <div>
          <h4 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">
            4. Medical History & Systemic Factors
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Family History of Skin Disease</label>
              <select {...register('familyHistory')} className="input">
                <option value="No">No</option>
                <option value="Yes - Eczema/Psoriasis">Yes (Eczema/Psoriasis)</option>
                <option value="Yes - Skin Cancer">Yes (Skin Cancer)</option>
                <option value="Yes - Other">Yes (Other)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Diabetes?</label>
              <select {...register('diabetes')} className="input">
                <option value="No">No</option>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Immune Disorder?</label>
              <select {...register('immuneDisorder')} className="input">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Pregnancy?</label>
              <select {...register('pregnancy')} className="input">
                <option value="No">No</option>
                <option value="Yes - 1st Trimester">Yes (1st Trimester)</option>
                <option value="Yes - 2nd Trimester">Yes (2nd Trimester)</option>
                <option value="Yes - 3rd Trimester">Yes (3rd Trimester)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Text Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Previous Skin Conditions</label>
            <input type="text" {...register('previousSkinDisease')} placeholder="e.g. Childhood asthma/eczema" className="input" />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Current Medications</label>
            <input type="text" {...register('currentMedications')} placeholder="e.g. Antihistamines, Topical creams" className="input" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1">Other Observations / Notes</label>
          <textarea {...register('otherSymptoms')} rows={2} placeholder="Any other details about onset, triggers, etc." className="input" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-base shadow-glow mt-4"
        >
          {loading ? 'Generating Medical Report with Gemini...' : 'Generate Comprehensive Medical Report'}
          {!loading && <RiArrowRightLine className="w-5 h-5" />}
        </button>
      </form>
    </motion.div>
  )
}
