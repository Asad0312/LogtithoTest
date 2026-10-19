import { forwardRef } from 'react'
import TextElement from './TextElement.jsx'

const DocumentCanvas = forwardRef(function DocumentCanvas(
  { doc, selectedId, editingId, zoom, onSelect, onBeginEdit, onEndEdit, onMove },
  pageRef,
) {
  const showBg = doc.page.backgroundImage && doc.page.showBackground !== false

  return (
    <div
      ref={pageRef}
      className="doc-page"
      style={{ width: doc.page.width, height: doc.page.height, background: doc.page.background || '#fff' }}
      onClick={() => onSelect(null)}
    >
      {showBg ? (
        <img className="doc-page-bg" src={doc.page.backgroundImage} alt="" draggable={false} />
      ) : null}
      {doc.elements.map((el) => (
        <TextElement
          key={el.id}
          el={el}
          zoom={zoom}
          pageWidth={doc.page.width}
          pageHeight={doc.page.height}
          selected={el.id === selectedId}
          editing={el.id === editingId}
          onSelect={onSelect}
          onBeginEdit={onBeginEdit}
          onEndEdit={onEndEdit}
          onMove={onMove}
        />
      ))}
    </div>
  )
})

export default DocumentCanvas
