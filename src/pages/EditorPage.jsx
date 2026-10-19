import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, FileQuestion } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Toaster from '../components/common/Toaster.jsx'
import EditorToolbar from '../components/editor/EditorToolbar.jsx'
import DocumentCanvas from '../components/editor/DocumentCanvas.jsx'
import PropertiesPanel from '../components/editor/PropertiesPanel.jsx'
import ExportDialog from '../components/editor/ExportDialog.jsx'
import { useApp } from '../context/AppContext.jsx'
import { makeId, getDocument, upsertDocument } from '../utils/storage.js'

const DEFAULT_TEXT_STYLE = {
  fontFamily: 'Arial, "Segoe UI", Helvetica, sans-serif',
  fontSize: 16,
  color: '#1c2740',
  bold: false,
  italic: false,
  align: 'left',
  lineHeight: 1.5,
  dir: 'ltr',
}

function editorReducer(state, action) {
  switch (action.type) {
    case 'load':
      return { doc: action.doc, past: [], future: [] }

    case 'set':
      return {
        ...state,
        doc: { ...state.doc, ...action.patch, updatedAt: new Date().toISOString() },
      }

    case 'commit':
      return {
        doc: {
          ...state.doc,
          ...action.patch,
          elements: action.elements ?? state.doc.elements,
          updatedAt: new Date().toISOString(),
        },
        past: [...state.past.slice(-49), state.doc],
        future: [],
      }

    case 'finalize': {
      if (!action.baseline) return state
      return {
        doc: {
          ...state.doc,
          ...action.patch,
          elements: action.elements ?? state.doc.elements,
          updatedAt: new Date().toISOString(),
        },
        past: [...state.past.slice(-49), action.baseline],
        future: [],
      }
    }

    case 'undo': {
      if (!state.past.length) return state
      const prev = state.past[state.past.length - 1]
      return {
        doc: prev,
        past: state.past.slice(0, -1),
        future: [state.doc, ...state.future].slice(0, 50),
      }
    }

    case 'redo': {
      if (!state.future.length) return state
      const next = state.future[0]
      return {
        doc: next,
        past: [...state.past.slice(-49), state.doc],
        future: state.future.slice(1),
      }
    }

    default:
      return state
  }
}

export default function EditorPage() {
  const { id } = useParams()
  const { pushToast, prefs } = useApp()
  const [state, dispatch] = useReducer(editorReducer, { doc: null, past: [], future: [] })
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [zoom, setZoom] = useState(0.8)
  const [saveStatus, setSaveStatus] = useState('saved')
  const [exportOpen, setExportOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const pageRef = useRef(null)
  const scalerRef = useRef(null)
  const stageRef = useRef(null)
  const baselineRef = useRef(null)
  const editBaselineRef = useRef(null)
  const loadedIdRef = useRef(null)
  const autosaveTimer = useRef(null)

  useEffect(() => {
    const doc = getDocument(id)
    if (!doc) {
      setNotFound(true)
      return
    }
    loadedIdRef.current = doc.id
    dispatch({ type: 'load', doc })
  }, [id])

  const doc = state.doc

  const selectedElement = useMemo(
    () => doc?.elements.find((el) => el.id === selectedId) || null,
    [doc, selectedId],
  )

  /* ---------- autosave ---------- */

  useEffect(() => {
    if (!doc || doc.id !== loadedIdRef.current) return
    setSaveStatus('unsaved')
    window.clearTimeout(autosaveTimer.current)
    autosaveTimer.current = window.setTimeout(() => {
      setSaveStatus('saving')
      try {
        upsertDocument(doc)
        setSaveStatus('saved')
      } catch {
        setSaveStatus('unsaved')
      }
    }, 1100)
    return () => window.clearTimeout(autosaveTimer.current)
  }, [doc])

  const saveNow = useCallback(() => {
    if (!doc) return
    window.clearTimeout(autosaveTimer.current)
    setSaveStatus('saving')
    try {
      upsertDocument(doc)
      setSaveStatus('saved')
      pushToast('success', 'Draft saved in this browser.')
    } catch (err) {
      setSaveStatus('unsaved')
      pushToast('error', err?.message || 'Could not save the draft.')
    }
  }, [doc, pushToast])

  /* ---------- element operations ---------- */

  const updateElement = useCallback(
    (nextElement, { record = true } = {}) => {
      if (!doc) return
      const elements = doc.elements.map((el) => (el.id === nextElement.id ? nextElement : el))
      if (record) dispatch({ type: 'commit', elements })
      else dispatch({ type: 'set', patch: { elements } })
    },
    [doc],
  )

  const commitPatch = useCallback(
    (patch) => {
      dispatch({ type: 'commit', patch })
    },
    [],
  )

  const livePatch = useCallback((nextElement) => {
    updateElement(nextElement, { record: false })
  }, [updateElement])

  const finalizePatch = useCallback((patch, baseline) => {
    dispatch({ type: 'finalize', patch, baseline: baseline || null })
  }, [])

  const handleMove = useCallback(
    (elId, x, y, phase, baseline) => {
      if (!doc) return
      const elements = doc.elements.map((el) => (el.id === elId ? { ...el, x, y } : el))
      if (phase === 'end') {
        dispatch({ type: 'set', patch: { elements } })
        dispatch({ type: 'finalize', elements, baseline })
      } else {
        dispatch({ type: 'set', patch: { elements } })
      }
    },
    [doc],
  )

  const addText = useCallback(() => {
    if (!doc) return
    const el = {
      id: makeId('el'),
      type: 'text',
      x: Math.round((doc.page.width - 420) / 2),
      y: 140 + ((doc.elements.length * 36) % 420),
      width: 420,
      text: 'New text block — double-click to edit.',
      style: { ...DEFAULT_TEXT_STYLE },
    }
    dispatch({ type: 'commit', elements: [...doc.elements, el] })
    setSelectedId(el.id)
  }, [doc])

  const deleteSelected = useCallback(() => {
    if (!doc || !selectedId) return
    const elements = doc.elements.filter((el) => el.id !== selectedId)
    dispatch({ type: 'commit', elements })
    setSelectedId(null)
    setEditingId(null)
  }, [doc, selectedId])

  const beginTextEdit = useCallback((elId) => {
    setSelectedId(elId)
    setEditingId(elId)
  }, [])

  const endTextEdit = useCallback(
    (elId, text) => {
      const baseline = editBaselineRef.current
      const elements = (state.doc?.elements || []).map((el) =>
        el.id === elId ? { ...el, text } : el,
      )
      setEditingId(null)
      editBaselineRef.current = null
      dispatch({ type: 'finalize', elements, baseline })
    },
    [state.doc],
  )

  // capture baseline when an edit starts so blur can restore history entry
  useEffect(() => {
    if (editingId && state.doc) editBaselineRef.current = state.doc
  }, [editingId, state.doc])

  /* ---------- keyboard ---------- */

  useEffect(() => {
    const onKey = (e) => {
      const target = e.target
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) dispatch({ type: 'redo' })
        else dispatch({ type: 'undo' })
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        dispatch({ type: 'redo' })
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveNow()
        return
      }
      if (typing) return
      if (e.key === 'Escape') {
        setEditingId(null)
        setSelectedId(null)
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault()
        deleteSelected()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, deleteSelected, saveNow])

  /* ---------- zoom helpers ---------- */

  const fitPage = useCallback(() => {
    const stage = stageRef.current
    if (!doc || !stage) return
    const availW = stage.clientWidth - 48
    const availH = stage.clientHeight - 48
    const next = Math.min(availW / doc.page.width, availH / doc.page.height, 1.4)
    setZoom(Math.max(0.3, +next.toFixed(2)))
  }, [doc])

  /* ---------- render ---------- */

  if (notFound) {
    return (
      <div className="editor-shell">
        <Toaster />
        <div className="editor-missing card">
          <FileQuestion size={30} />
          <h2>Document not found</h2>
          <p>This draft does not exist in this browser. It may have been deleted.</p>
          <Link to="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="editor-shell">
        <div className="editor-loading">Loading document…</div>
      </div>
    )
  }

  return (
    <div className="editor-shell">
      <Toaster />

      <EditorToolbar
        doc={doc}
        onNameChange={(name) => dispatch({ type: 'set', patch: { name } })}
        saveStatus={saveStatus}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
        onUndo={() => dispatch({ type: 'undo' })}
        onRedo={() => dispatch({ type: 'redo' })}
        zoom={zoom}
        onZoomChange={setZoom}
        onFit={fitPage}
        onAddText={addText}
        onDelete={deleteSelected}
        hasSelection={Boolean(selectedId)}
        onSave={saveNow}
        onExport={() => setExportOpen(true)}
        onTogglePanel={() => setPanelOpen((o) => !o)}
      />

      <div className="editor-body">
        <div className="editor-stage" ref={stageRef}>
          <div className="editor-notice">
            <AlertTriangle size={14} />
            <span>
              Sample text blocks are demo content — <strong>no OCR has been performed</strong> on the
              background image.
            </span>
          </div>

          <div className="editor-zoom-wrap" ref={scalerRef} style={{ transform: `scale(${zoom})` }}>
            <DocumentCanvas
              ref={pageRef}
              doc={doc}
              zoom={zoom}
              selectedId={selectedId}
              editingId={editingId}
              onSelect={(elId) => {
                if (editingId && elId !== editingId) setEditingId(null)
                setSelectedId(elId)
              }}
              onBeginEdit={beginTextEdit}
              onEndEdit={endTextEdit}
              onMove={handleMove}
            />
          </div>
        </div>

        <div className={`editor-panel-wrap ${panelOpen ? 'is-open' : ''}`}>
          <PropertiesPanel
            doc={doc}
            element={selectedElement}
            open={panelOpen}
            onUpdateElement={updateElement}
            onCommitPatch={commitPatch}
            onLivePatch={livePatch}
            onFinalizePatch={finalizePatch}
            onDelete={deleteSelected}
            baselineRef={baselineRef}
          />
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        doc={doc}
        defaultFormat={prefs.defaultExport || 'pdf'}
        pageRef={pageRef}
        scalerRef={scalerRef}
        onClose={() => setExportOpen(false)}
        onExported={(file) => pushToast('success', `Exported ${file}`)}
      />
    </div>
  )
}
