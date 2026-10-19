import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Redo2,
  Save,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react'
import Tooltip from '../common/Tooltip.jsx'
import './EditorToolbar.css'

export default function EditorToolbar({
  doc,
  onNameChange,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  onFit,
  onAddText,
  onDelete,
  hasSelection,
  onSave,
  onExport,
  onTogglePanel,
}) {
  return (
    <header className="editor-toolbar">
      <div className="editor-toolbar-group">
        <Tooltip label="Back to dashboard" placement="bottom">
          <Link to="/dashboard" className="tool-btn" aria-label="Back to dashboard">
            <ArrowLeft size={17} />
          </Link>
        </Tooltip>
        <input
          className="editor-title-input"
          value={doc.name}
          onChange={(e) => onNameChange(e.target.value)}
          aria-label="Document name"
        />
        <span className={`save-pill save-${saveStatus}`}>
          <span className="save-pill-dot" />
          {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'unsaved' ? 'Unsaved' : 'Saved locally'}
        </span>
      </div>

      <div className="editor-toolbar-group editor-toolbar-center">
        <Tooltip label="Undo (Ctrl+Z)">
          <button type="button" className="tool-btn" onClick={onUndo} disabled={!canUndo} aria-label="Undo">
            <Undo2 size={16} />
          </button>
        </Tooltip>
        <Tooltip label="Redo (Ctrl+Shift+Z)">
          <button type="button" className="tool-btn" onClick={onRedo} disabled={!canRedo} aria-label="Redo">
            <Redo2 size={16} />
          </button>
        </Tooltip>

        <span className="tool-divider" />

        <Tooltip label="Zoom out">
          <button
            type="button"
            className="tool-btn"
            onClick={() => onZoomChange(Math.max(0.4, +(zoom - 0.1).toFixed(2)))}
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
        </Tooltip>
        <button type="button" className="tool-zoom" onClick={onFit} title="Fit to screen">
          {Math.round(zoom * 100)}%
        </button>
        <Tooltip label="Zoom in">
          <button
            type="button"
            className="tool-btn"
            onClick={() => onZoomChange(Math.min(2, +(zoom + 0.1).toFixed(2)))}
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </Tooltip>
        <Tooltip label="Fit page">
          <button type="button" className="tool-btn" onClick={onFit} aria-label="Fit page">
            <Maximize size={16} />
          </button>
        </Tooltip>

        <span className="tool-divider" />

        <button type="button" className="tool-btn tool-btn-wide" onClick={onAddText}>
          <Type size={16} />
          <span>Add text</span>
        </button>
        <Tooltip label="Delete selected">
          <button
            type="button"
            className="tool-btn"
            onClick={onDelete}
            disabled={!hasSelection}
            aria-label="Delete selected element"
          >
            <Trash2 size={16} />
          </button>
        </Tooltip>
      </div>

      <div className="editor-toolbar-group">
        <button type="button" className="tool-btn tool-btn-wide tool-props-toggle" onClick={onTogglePanel}>
          <SlidersHorizontal size={16} />
          <span>Properties</span>
        </button>
        <button type="button" className="tool-btn tool-btn-wide" onClick={onSave}>
          <Save size={16} />
          <span>Save draft</span>
        </button>
        <button type="button" className="tool-primary" onClick={onExport}>
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </header>
  )
}
