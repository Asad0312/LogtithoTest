import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, MoreVertical, Pencil, Trash2, FileText } from 'lucide-react'
import DocumentThumbnail from './DocumentThumbnail.jsx'
import { formatDocDate } from '../../utils/storage.js'
import './DocumentCard.css'

export default function DocumentCard({ doc, onRename, onDuplicate, onDelete }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const open = () => navigate(`/editor/${doc.id}`)

  return (
    <article
      className={`doc-card ${menuOpen ? 'is-menu-open' : ''}`}
      onClick={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open()
      }}
    >
      <div className="doc-card-thumb">
        <DocumentThumbnail doc={doc} width={148} />
        {doc.page.backgroundImage ? (
          <span className="doc-card-scan">Scan</span>
        ) : null}
      </div>

      <div className="doc-card-body">
        <div className="doc-card-title-row">
          <FileText size={15} className="doc-card-icon" />
          <h3 className="doc-card-name" title={doc.name}>{doc.name}</h3>
        </div>
        <p className="doc-card-meta">
          Edited {formatDocDate(doc.updatedAt)}
          <span className={`badge ${doc.source === 'sample' ? 'badge-sample' : 'badge-user'}`}>
            {doc.source === 'sample' ? 'Sample' : 'Draft'}
          </span>
        </p>
      </div>

      <div className="doc-card-menu" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="doc-card-menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Document actions"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen ? (
          <div className="doc-card-menu-list">
            <button type="button" onClick={() => { setMenuOpen(false); open() }}>
              <Pencil size={14} /> Open
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); onRename(doc) }}>
              <Pencil size={14} /> Rename
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); onDuplicate(doc) }}>
              <Copy size={14} /> Duplicate
            </button>
            <button type="button" className="is-danger" onClick={() => { setMenuOpen(false); onDelete(doc) }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  )
}
