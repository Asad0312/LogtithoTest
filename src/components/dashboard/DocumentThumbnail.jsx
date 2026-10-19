export default function DocumentThumbnail({ doc, width = 136 }) {
  const pageW = doc.page.width || 800
  const pageH = doc.page.height || 1120
  const scale = width / pageW
  const height = Math.round(pageH * scale)
  const showBg = doc.page.backgroundImage && doc.page.showBackground !== false

  return (
    <div className="doc-thumb" style={{ width, height }}>
      <div
        className="doc-thumb-inner"
        style={{ width: pageW, height: pageH, transform: `scale(${scale})` }}
      >
        {showBg ? <img className="doc-thumb-bg" src={doc.page.backgroundImage} alt="" /> : null}
        {doc.elements.map((el) => (
          <div
            key={el.id}
            className="doc-thumb-el"
            style={{
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
            }}
          >
            {el.text}
          </div>
        ))}
      </div>
    </div>
  )
}
