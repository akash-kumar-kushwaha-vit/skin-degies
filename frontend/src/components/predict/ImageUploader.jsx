import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { RiUploadCloud2Line, RiImageAddLine, RiCloseLine, RiCheckLine, RiShieldCheckLine } from 'react-icons/ri'

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
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div className="w-full">
      {!preview && !selectedFile ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-300 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04]'
          }`}
        >
          <input {...getInputProps()} id="skin-image-upload-input" />

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <RiUploadCloud2Line className="w-6 h-6" />
            </div>

            <div>
              <p className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                {isDragActive ? 'Drop skin lesion image here' : 'Choose a skin lesion photo'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Drag and drop your file or browse from device. Supports JPEG, PNG, WebP, BMP up to 10 MB.
              </p>
            </div>

            <div className="pt-1">
              <span className="btn-secondary text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5 pointer-events-none">
                <RiImageAddLine className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Browse File
              </span>
            </div>

            {/* Clinical capture hints */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-white/[0.06] flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <RiCheckLine className="w-3 h-3 text-emerald-500" /> Well-lit macro focus
              </span>
              <span className="flex items-center gap-1">
                <RiCheckLine className="w-3 h-3 text-emerald-500" /> Centered lesion
              </span>
              <span className="flex items-center gap-1">
                <RiShieldCheckLine className="w-3 h-3 text-blue-500" /> Encrypted analysis
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden card-base p-4 border border-slate-200 dark:border-white/10 space-y-4">
          <div className="relative group rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
            <img
              src={preview || (selectedFile ? URL.createObjectURL(selectedFile) : '')}
              alt="Skin lesion preview"
              className="max-h-72 w-auto object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleClear}
                className="btn-danger text-xs py-2 px-3.5 rounded-lg shadow-sm"
              >
                <RiCloseLine className="w-4 h-4" />
                <span>Remove Image</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate">{selectedFile?.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.05] px-2 py-0.5 rounded">
                {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
