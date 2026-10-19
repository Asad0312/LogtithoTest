import { useEffect, useRef } from 'react'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function TextElement({
  el,
  selected,
  editing,
  zoom,
  pageWidth,
  pageHeight,
  onSelect,
  onBeginEdit,
  onEndEdit,
  onMove,
}) {
  const editRef = useRef(null)
  const lastPosRef = useRef({ x: el.x, y: el.y })

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.innerText = el.text
      editRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(editRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  const startDrag = (e) => {
    if (editing || e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    onSelect(el.id)

    const baselineX = el.x
    const baselineY = el.y
    const startX = e.clientX
    const startY = e.clientY
    let lastX = el.x
    let lastY = el.y
    let moved = false

    const handleMove = (ev) => {
      const dx = (ev.clientX - startX) / zoom
      const dy = (ev.clientY - startY) / zoom
      if (!moved && Math.hypot(dx, dy) < 2) return
      moved = true
      lastX = Math.round(clamp(baselineX + dx, 0, pageWidth - 60))
      lastY = Math.round(clamp(baselineY + dy, 0, pageHeight - 24))
      lastPosRef.current = { x: lastX, y: lastY }
      onMove(el.id, lastX, lastY, 'move')
    }

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      if (moved) {
        onMove(el.id, lastX, lastY, 'end', { x: baselineX, y: baselineY })
      }
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  const style = {
    left: el.x,
    top: el.y,
    width: el.width,
    fontFamily: el.style.fontFamily,
    fontSize: el.style.fontSize,
    color: el.style.color,
    fontWeight: el.style.bold ? 700 : 400,
    fontStyle: el.style.italic ? 'italic' : 'normal',
    textAlign: el.style.align,
    lineHeight: el.style.lineHeight,
    direction: el.style.dir || 'ltr',
  }

  if (editing) {
    return (
      <div
        ref={editRef}
        className="text-el is-editing"
        style={style}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Edit text"
        onBlur={(e) => onEndEdit(el.id, e.currentTarget.innerText)}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === 'Escape') e.currentTarget.blur()
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <div
      className={`text-el ${selected ? 'is-selected' : ''}`}
      style={style}
      onPointerDown={startDrag}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(el.id)
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onSelect(el.id)
        onBeginEdit(el.id)
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onBeginEdit(el.id)
      }}
    >
      {el.text || ' '}
      {selected ? (
        <>
          <span className="text-el-ring" aria-hidden="true" />
          <span className="handle handle-nw" aria-hidden="true" />
          <span className="handle handle-ne" aria-hidden="true" />
          <span className="handle handle-sw" aria-hidden="true" />
          <span className="handle handle-se" aria-hidden="true" />
        </>
      ) : null}
    </div>
  )
}
