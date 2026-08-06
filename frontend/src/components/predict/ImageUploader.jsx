import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { RiUploadCloud2Line, RiImageAddLine, RiCloseLine } from 'react-icons/ri'

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
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
              : 'border-slate-700 hover:border-primary-500/50 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
            <RiUploadCloud2Line className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="font-display font-semibold text-lg text-white mb-1">
            {isDragActive ? 'Drop your skin lesion image here' : 'Drag & Drop your image here'}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Supports JPEG, PNG, WebP, BMP up to 10MB
          </p>
          <span className="btn-secondary text-sm py-2 px-4">
            <RiImageAddLine className="w-4 h-4" /> Select File
          </span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 glass p-3"
        >
          <img
            src={preview || (selectedFile ? URL.createObjectURL(selectedFile) : '')}
            alt="Skin lesion upload"
            className="w-full h-72 object-cover rounded-xl"
          />
          <button
            onClick={handleClear}
            className="absolute top-5 right-5 p-2 bg-slate-900/80 text-slate-300 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-colors"
            title="Remove image"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
          <div className="mt-3 px-2 flex items-center justify-between text-xs text-slate-400">
            <span>{selectedFile?.name}</span>
            <span>{(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
