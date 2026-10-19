import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileStack, Plus, Search, X } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import Modal from '../components/common/Modal.jsx'
import DocumentCard from '../components/dashboard/DocumentCard.jsx'
import { useApp } from '../context/AppContext.jsx'
import {
  deleteDocument,
  duplicateDocument,
  loadDocuments,
  renameDocument,
} from '../utils/storage.js'

export default function DashboardPage() {
  const { t, pushToast } = useApp()
  const navigate = useNavigate()
  const [docs, setDocs] = useState(null)
  const [query, setQuery] = useState('')
  const [renameTarget, setRenameTarget] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const id = window.setTimeout(() => setDocs(loadDocuments()), 280)
    return () => window.clearTimeout(id)
  }, [])

  const filtered = useMemo(() => {
    if (!docs) return []
    const q = query.trim().toLowerCase()
    const sorted = [...docs].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    if (!q) return sorted
    return sorted.filter((d) => d.name.toLowerCase().includes(q))
  }, [docs, query])

  const handleRename = () => {
    const name = renameValue.trim()
    if (!name) return
    renameDocument(renameTarget.id, name)
    setDocs(loadDocuments())
    setRenameTarget(null)
    pushToast('success', 'Document renamed.')
  }

  const handleDuplicate = (doc) => {
    duplicateDocument(doc.id)
    setDocs(loadDocuments())
    pushToast('success', `Duplicated “${doc.name}”.`)
  }

  const handleDelete = () => {
    deleteDocument(deleteTarget.id)
    setDocs(loadDocuments())
    setDeleteTarget(null)
    pushToast('info', 'Document deleted from this browser.')
  }

  return (
    <div className="dashboard">
      <div className="page-head">
        <div>
          <h2 className="page-title">{t('dashboard.title')}</h2>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/upload')} icon={<Plus size={16} />}>
          {t('dashboard.createNew')}
        </Button>
      </div>

      <div className="dashboard-toolbar">
        <div className="dashboard-search">
          <Search size={16} className="dashboard-search-icon" />
          <input
            className="dashboard-search-input"
            type="search"
            placeholder={`${t('common.search')} documents…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documents"
          />
          {query ? (
            <button type="button" className="dashboard-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={14} />
            </button>
          ) : null}
        </div>
        {docs ? <span className="dashboard-count">{filtered.length} of {docs.length}</span> : null}
      </div>

      {docs === null ? (
        <div className="dashboard-grid">
          {[0, 1, 2, 3].map((i) => (
            <div className="doc-card skeleton-card" key={i}>
              <div className="skeleton skeleton-thumb" />
              <div className="skeleton-body">
                <div className="skeleton" style={{ height: 14, width: '70%' }} />
                <div className="skeleton" style={{ height: 11, width: '45%', marginTop: 8 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        query ? (
          <EmptyState
            icon={Search}
            title={t('dashboard.noResults.title')}
            description={t('dashboard.noResults.desc')}
            action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
          />
        ) : (
          <EmptyState
            icon={FileStack}
            title={t('dashboard.empty.title')}
            description={t('dashboard.empty.desc')}
            action={
              <Button onClick={() => navigate('/upload')} icon={<Plus size={16} />}>
                {t('dashboard.createNew')}
              </Button>
            }
          />
        )
      ) : (
        <div className="dashboard-grid">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onRename={(d) => {
                setRenameTarget(d)
                setRenameValue(d.name)
              }}
              onDuplicate={handleDuplicate}
              onDelete={(d) => setDeleteTarget(d)}
            />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(renameTarget)}
        title={t('common.rename')}
        onClose={() => setRenameTarget(null)}
        width={420}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenameTarget(null)}>{t('common.cancel')}</Button>
            <Button onClick={handleRename} disabled={!renameValue.trim()}>{t('common.save')}</Button>
          </>
        }
      >
        <div className="field">
          <label className="field-label" htmlFor="rename-input">Document name</label>
          <input
            id="rename-input"
            className="input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title={`Delete “${deleteTarget?.name || ''}”?`}
        onClose={() => setDeleteTarget(null)}
        width={420}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
            <Button variant="danger" onClick={handleDelete}>{t('common.delete')}</Button>
          </>
        }
      >
        <p className="dashboard-delete-text">
          This removes the document from this browser’s local storage. Sample documents can be
          restored later from Settings.
        </p>
      </Modal>
    </div>
  )
}
