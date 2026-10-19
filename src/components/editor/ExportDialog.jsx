import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, FileDown, FileText } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import { exportToDOCX, exportToPDF } from '../../utils/export.js'

export default function ExportDialog({
  open,
  doc,
  defaultFormat,
  pageRef,
  scalerRef,
  onClose,
  onExported,
}) {
  const [format, setFormat] = useState(defaultFormat || 'pdf')
  const [fileName, setFileName] = useState(doc.name)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(null)

  useEffect(() => {
    if (open) {
      setFileName(doc.name)
      setError(null)
      setDone(null)
      setBusy(false)
      setFormat(defaultFormat || 'pdf')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const run = async () => {
    setBusy(true)
    setError(null)
    setDone(null)
    try {
      const trimmed = (fileName || doc.name || 'document').trim()
      const payload = { ...doc, name: trimmed }
      const result =
        format === 'pdf'
          ? await exportToPDF(pageRef.current, scalerRef.current, payload)
          : await exportToDOCX(payload)
      setDone(result)
      onExported?.(result)
    } catch (err) {
      setError(err?.message || 'Export failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      title="Export document"
      subtitle="Choose a format. The file is generated and downloaded to your device."
      onClose={onClose}
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {done ? 'Close' : 'Cancel'}
          </Button>
          <Button onClick={run} loading={busy} disabled={busy}>
            {busy ? 'Exporting…' : `Export ${format.toUpperCase()}`}
          </Button>
        </>
      }
    >
      <div className="export-formats">
        {[
          {
            key: 'pdf',
            icon: FileDown,
            title: 'PDF',
            desc: 'Pixel-accurate render of your canvas. Best for sharing as-is.',
          },
          {
            key: 'docx',
            icon: FileText,
            title: 'DOCX',
            desc: 'Editable Word file built from text blocks with basic formatting.',
          },
        ].map(({ key, icon: Icon, title, desc }) => (
          <button
            key={key}
            type="button"
            className={`export-format ${format === key ? 'is-active' : ''}`}
            onClick={() => setFormat(key)}
          >
            <Icon size={20} />
            <div>
              <strong>{title}</strong>
              <p>{desc}</p>
            </div>
            <span className="export-check">{format === key ? '✓' : ''}</span>
          </button>
        ))}
      </div>

      <div className="field" style={{ marginTop: '1rem' }}>
        <label className="field-label" htmlFor="export-name">File name</label>
        <div className="export-name-row">
          <input
            id="export-name"
            className="input"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <span className="export-ext">.{format}</span>
        </div>
      </div>

      {error ? (
        <div className="export-alert export-alert-error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {done ? (
        <div className="export-alert export-alert-success">
          <CheckCircle2 size={16} />
          <span>
            Downloaded <strong>{done}</strong>. Open it from your downloads folder.
          </span>
        </div>
      ) : null}

      <p className="export-note">
        Both exports are real files generated in your browser — no server is involved. The DOCX
        export uses text blocks only; the PDF export captures the visual page including the
        background scan.
      </p>
    </Modal>
  )
}
