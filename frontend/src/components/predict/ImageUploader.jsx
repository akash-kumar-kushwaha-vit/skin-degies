import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { RiUploadCloud2Line, RiImageAddLine, RiCloseLine, RiCheckLine, RiFileShieldLine } from 'react-icons/ri'

export default function ImageUploader({ onSelectImage, selectedFile, clearImage }) {
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setPreview(URL.createObjectURL(file))
      onSelectImage(file)
    }
  }, [onSelectImage])

  const handleClear = (e) => {
    e.stopPropagation()
    setPreview(null)
    clearImage()
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.bmp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div className="w-full">
      {!preview && !selectedFile ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 group overflow-hidden ${
            isDragActive
              ? 'border-primary-500 bg-primary-500/10 scale-[1.005]'
              : 'border-slate-300 dark:border-slate-700/80 hover:border-primary-500 dark:hover:border-primary-400 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-900/70'
          }`}
        >
          <input {...getInputProps()} id="skin-image-upload-input" />
          
          {/* Subtle background glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800/60 flex items-center justify-center mx-auto shadow-subtle group-hover:scale-105 transition-transform duration-300">
              <RiUploadCloud2Line className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
                {isDragActive ? 'Drop skin lesion image here' : 'Click or drag & drop skin lesion image'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                Supported formats: JPEG, PNG, WebP, BMP (Up to 10 MB). Clinical macro or dermoscopic photos recommended.
              </p>
            </div>

            <div className="pt-2">
              <span className="btn-secondary text-xs py-2.5 px-5 shadow-subtle inline-flex items-center gap-2 rounded-xl group-hover:border-primary-400/40">
                <RiImageAddLine className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                Select Image File
              </span>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden card-base p-4 border border-slate-200/80 dark:border-slate-800"
        >
          <div className="relative group rounded-2xl overflow-hidden bg-slate-950 max-h-96">
            <img
              src={preview || (selectedFile ? URL.createObjectURL(selectedFile) : '')}
              alt="Skin lesion preview"
              className="w-full h-80 object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <button
                type="button"
                onClick={handleClear}
                className="p-3 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-500 transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-semibold px-4"
                title="Remove image"
              >
                <RiCloseLine className="w-4 h-4" /> Remove Photo
              </button>
            </div>
          </div>

          <div className="mt-4 px-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">{selectedFile?.name}</span>
            </div>
            <span className="text-slate-400 font-semibold flex-shrink-0 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
