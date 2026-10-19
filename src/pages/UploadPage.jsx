import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, ImagePlus, Info, Loader2, X } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { createDocumentFromImage } from '../data/samples.js'
import { upsertDocument } from '../utils/storage.js'
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
  compressImage,
  formatFileSize,
  loadImage,
  validateImageFile,
} from '../utils/validation.js'

const STEPS = [
  { at: 18, label: 'Validating image…' },
  { at: 46, label: 'Preparing document canvas…' },
  { at: 74, label: 'Placing sample text layout…' },
  { at: 100, label: 'Ready to edit' },
]

export default function UploadPage() {
  const { t, pushToast } = useApp()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [dims, setDims] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepLabel, setStepLabel] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const acceptFile = async (f) => {
    const result = validateImageFile(f)
    if (!result.ok) {
      setError(result.error)
      setFile(null)
      setPreviewUrl(null)
      setDims(null)
      pushToast('error', result.error)
      return
    }
    setError(null)
    const url = URL.createObjectURL(f)
    setFile(f)
    setPreviewUrl(url)
    try {
      const img = await loadImage(url)
      setDims({ width: img.naturalWidth, height: img.naturalHeight })
    } catch {
      setDims(null)
    }
  }

  const onInputChange = (e) => {
    const f = e.target.files?.[0]
    if (f) acceptFile(f)
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) acceptFile(f)
  }

  const clearFile = () => {
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setDims(null)
    setError(null)
  }

  const processImage = async () => {
    if (!file || processing) return
    setProcessing(true)
    setProgress(0)

    try {
      for (const step of STEPS) {
        setStepLabel(`${step.label} (simulated)`)
        const start = progress
        const steps = 10
        for (let i = 1; i <= steps; i += 1) {
          await new Promise((r) => setTimeout(r, 45))
          const value = start + ((step.at - start) * i) / steps
          setProgress(Math.min(step.at, value))
        }
      }

      const compressed = await compressImage(file)
      const baseName = file.name.replace(/\.[^.]+$/, '').trim() || 'Untitled scan'
      const doc = createDocumentFromImage({
        name: baseName,
        dataUrl: compressed.dataUrl,
        width: compressed.originalWidth,
        height: compressed.originalHeight,
      })
      upsertDocument(doc)
      pushToast('success', 'Document created. Opening the editor…')
      navigate(`/editor/${doc.id}`, { replace: true })
    } catch (err) {
      setProcessing(false)
      setProgress(0)
      setStepLabel('')
      const message = err?.message || 'Something went wrong while preparing the document.'
      setError(message)
      pushToast('error', message)
    }
  }

  return (
    <div className="upload">
      <div className="page-head">
        <div>
          <h2 className="page-title">{t('upload.title')}</h2>
          <p className="page-subtitle">{t('upload.subtitle')}</p>
        </div>
      </div>

      <div className="upload-grid">
        <section className="upload-main card">
          {!file ? (
            <div
              className={`dropzone ${dragging ? 'is-dragging' : ''} ${error ? 'has-error' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            >
              <span className="dropzone-icon">
                <ImagePlus size={28} strokeWidth={1.6} />
              </span>
              <h3 className="dropzone-title">Drag &amp; drop your image here</h3>
              <p className="dropzone-desc">or click to browse your files</p>
              <span className="dropzone-types">
                JPG · JPEG · PNG &nbsp;·&nbsp; up to {formatFileSize(MAX_FILE_SIZE)}
              </span>
              <input
                ref={inputRef}
                type="file"
                accept={`${ACCEPTED_EXTENSIONS},image/jpeg,image/png`}
                onChange={onInputChange}
                hidden
              />
            </div>
          ) : (
            <div className="preview">
              <div className="preview-frame">
                <img src={previewUrl} alt="Selected document preview" />
              </div>
              <div className="preview-meta">
                <div className="preview-meta-top">
                  <p className="preview-name" title={file.name}>{file.name}</p>
                  <button
                    type="button"
                    className="preview-remove"
                    onClick={clearFile}
                    disabled={processing}
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="preview-facts">
                  {formatFileSize(file.size)}
                  {dims ? ` · ${dims.width} × ${dims.height} px` : ''}
                  {' · '}
                  {file.type}
                </p>
                <div className="preview-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    disabled={processing}
                  >
                    Replace image
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearFile} disabled={processing}>
                    Remove
                  </Button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept={`${ACCEPTED_EXTENSIONS},image/jpeg,image/png`}
                  onChange={onInputChange}
                  hidden
                />
              </div>
            </div>
          )}

          {error ? (
            <div className="upload-error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          ) : null}

          {processing ? (
            <div className="upload-progress">
              <ProgressBar
                value={progress}
                label={stepLabel || 'Working…'}
                hint="Prototype note: image processing is simulated. Logrithoo does not run OCR in this build."
              />
            </div>
          ) : null}

          <div className="upload-actions">
            <Button
              size="lg"
              onClick={processImage}
              disabled={!file || processing}
              loading={processing}
            >
              {processing ? 'Processing…' : 'Process image'}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              disabled={processing}
            >
              Cancel
            </Button>
          </div>
        </section>

        <aside className="upload-side">
          <div className="note">
            <Info size={16} />
            <span>
              <strong>No OCR in this prototype.</strong> After processing, the editor opens with your
              image as the page background and a sample text block you can edit — it is not
              extracted text.
            </span>
          </div>

          <div className="card upload-side-card">
            <h3>Tips for best results</h3>
            <ul>
              <li>Use a straight, well-lit photo or scan of a printed page.</li>
              <li>Keep the file under 10 MB — larger images are downscaled automatically.</li>
              <li>JPG and PNG are supported; other formats are rejected.</li>
              <li>Your image stays in this browser and is never uploaded to a server.</li>
            </ul>
          </div>

          <div className="card upload-side-card upload-side-done">
            <CheckCircle2 size={18} />
            <div>
              <h3>What happens next</h3>
              <p>
                A new draft document is created in your dashboard. You can reposition text, apply
                formatting, then export to PDF or DOCX.
              </p>
            </div>
          </div>

          {processing ? (
            <div className="card upload-side-card">
              <Loader2 size={16} className="spin" />
              <div>
                <h3>Working</h3>
                <p>Keep this tab open while the canvas is prepared.</p>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
