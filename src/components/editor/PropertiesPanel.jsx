import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Trash2, Type } from 'lucide-react'
import { COLOR_PRESETS, FONT_CHOICES } from '../../data/samples.js'
import './PropertiesPanel.css'

function Row({ label, children }) {
  return (
    <div className="props-row">
      <label className="props-label">{label}</label>
      {children}
    </div>
  )
}

export default function PropertiesPanel({
  doc,
  element,
  open,
  onUpdateElement,
  onCommitPatch,
  onLivePatch,
  onFinalizePatch,
  onDelete,
  baselineRef,
}) {
  if (!element) {
    return (
      <div className={`props-panel ${open ? 'is-open' : ''}`}>
        <div className="props-head">
          <Type size={15} />
          <h3>Document</h3>
        </div>

        <div className="props-group">
          <Row label="Page size">
            <span className="props-static">
              {doc.page.width} × {doc.page.height} px
            </span>
          </Row>
          <Row label="Text blocks">
            <span className="props-static">{doc.elements.length}</span>
          </Row>
          {doc.page.backgroundImage ? (
            <Row label="Source image">
              <label className="props-check">
                <input
                  type="checkbox"
                  checked={doc.page.showBackground !== false}
                  onChange={(e) =>
                    onCommitPatch({ page: { ...doc.page, showBackground: e.target.checked } })
                  }
                />
                <span>Show scan behind text</span>
              </label>
            </Row>
          ) : null}
        </div>

        <div className="props-hint">
          Select a text block on the canvas to edit its content, formatting, and position.
          Double-click a block to type directly on the page.
        </div>
      </div>
    )
  }

  const style = element.style

  const patchStyle = (partial, { record = true } = {}) => {
    const next = {
      ...element,
      style: { ...style, ...partial },
    }
    if (record) onUpdateElement(next)
    else onLivePatch(next)
  }

  return (
    <div className={`props-panel ${open ? 'is-open' : ''}`}>
      <div className="props-head">
        <Type size={15} />
        <h3>Text properties</h3>
        <button type="button" className="props-delete" onClick={onDelete} aria-label="Delete element">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="props-group">
        <Row label="Content">
          <textarea
            className="props-textarea"
            value={element.text}
            rows={4}
            onFocus={() => {
              baselineRef.current = doc
            }}
            onChange={(e) => onUpdateElement({ ...element, text: e.target.value }, { record: false })}
            onBlur={(e) =>
              onFinalizePatch(
                { elements: doc.elements.map((el) => (el.id === element.id ? { ...el, text: e.target.value } : el)) },
                baselineRef.current,
              )
            }
          />
        </Row>
      </div>

      <div className="props-group">
        <Row label="Font">
          <select
            className="props-select"
            value={style.fontFamily}
            onChange={(e) => patchStyle({ fontFamily: e.target.value })}
          >
            {FONT_CHOICES.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Row>

        <Row label="Size">
          <div className="props-inline">
            <input
              type="number"
              className="props-number"
              min={8}
              max={96}
              value={style.fontSize}
              onChange={(e) => {
                const v = Math.max(8, Math.min(96, Number(e.target.value) || 16))
                patchStyle({ fontSize: v })
              }}
            />
            <input
              type="range"
              className="props-range"
              min={8}
              max={72}
              value={style.fontSize}
              onChange={(e) => patchStyle({ fontSize: Number(e.target.value) }, { record: false })}
              onPointerDown={() => {
                baselineRef.current = doc
              }}
              onPointerUp={() =>
                onFinalizePatch(
                  { elements: doc.elements.map((el) => (el.id === element.id ? { ...el, style: { ...el.style, fontSize: style.fontSize } } : el)) },
                  baselineRef.current,
                )
              }
            />
          </div>
        </Row>

        <Row label="Colour">
          <div className="props-inline">
            <input
              type="color"
              className="props-color"
              value={style.color}
              onChange={(e) => patchStyle({ color: e.target.value }, { record: false })}
              onPointerDown={() => {
                baselineRef.current = doc
              }}
              onBlur={(e) =>
                onFinalizePatch(
                  { elements: doc.elements.map((el) => (el.id === element.id ? { ...el, style: { ...el.style, color: e.target.value } } : el)) },
                  baselineRef.current,
                )
              }
            />
            <div className="props-swatches">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`props-swatch ${style.color.toLowerCase() === c.toLowerCase() ? 'is-active' : ''}`}
                  style={{ background: c }}
                  onClick={() => patchStyle({ color: c })}
                  aria-label={`Set colour ${c}`}
                />
              ))}
            </div>
          </div>
        </Row>

        <Row label="Style">
          <div className="segmented">
            <button
              type="button"
              className={style.bold ? 'is-active' : ''}
              onClick={() => patchStyle({ bold: !style.bold })}
              aria-pressed={style.bold}
            >
              <Bold size={14} /> Bold
            </button>
            <button
              type="button"
              className={style.italic ? 'is-active' : ''}
              onClick={() => patchStyle({ italic: !style.italic })}
              aria-pressed={style.italic}
            >
              <Italic size={14} /> Italic
            </button>
          </div>
        </Row>

        <Row label="Alignment">
          <div className="segmented">
            {[
              { key: 'left', Icon: AlignLeft },
              { key: 'center', Icon: AlignCenter },
              { key: 'right', Icon: AlignRight },
            ].map(({ key, Icon }) => (
              <button
                key={key}
                type="button"
                className={style.align === key ? 'is-active' : ''}
                onClick={() => patchStyle({ align: key })}
                aria-label={`Align ${key}`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </Row>

        <Row label="Line spacing">
          <select
            className="props-select"
            value={style.lineHeight}
            onChange={(e) => patchStyle({ lineHeight: Number(e.target.value) })}
          >
            {[1, 1.15, 1.25, 1.5, 1.75, 2].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Row>

        <Row label="Direction">
          <select
            className="props-select"
            value={style.dir || 'ltr'}
            onChange={(e) => patchStyle({ dir: e.target.value })}
          >
            <option value="ltr">Left to right</option>
            <option value="rtl">Right to left</option>
          </select>
        </Row>
      </div>

      <div className="props-group">
        <Row label="Width">
          <input
            type="range"
            className="props-range props-range-full"
            min={120}
            max={720}
            step={10}
            value={element.width}
            onChange={(e) =>
              onUpdateElement({ ...element, width: Number(e.target.value) }, { record: false })
            }
            onPointerDown={() => {
              baselineRef.current = doc
            }}
            onPointerUp={() =>
              onFinalizePatch(
                {
                  elements: doc.elements.map((el) =>
                    el.id === element.id ? { ...el, width: element.width } : el,
                  ),
                },
                baselineRef.current,
              )
            }
          />
        </Row>

        <div className="props-pos">
          <Row label="X">
            <input
              type="number"
              className="props-number"
              value={element.x}
              onChange={(e) =>
                onUpdateElement({ ...element, x: Number(e.target.value) || 0 }, { record: false })
              }
              onBlur={(e) =>
                onFinalizePatch(
                  {
                    elements: doc.elements.map((el) =>
                      el.id === element.id ? { ...el, x: Number(e.target.value) || 0 } : el,
                    ),
                  },
                  baselineRef.current || doc,
                )
              }
              onFocus={() => {
                baselineRef.current = doc
              }}
            />
          </Row>
          <Row label="Y">
            <input
              type="number"
              className="props-number"
              value={element.y}
              onChange={(e) =>
                onUpdateElement({ ...element, y: Number(e.target.value) || 0 }, { record: false })
              }
              onBlur={(e) =>
                onFinalizePatch(
                  {
                    elements: doc.elements.map((el) =>
                      el.id === element.id ? { ...el, y: Number(e.target.value) || 0 } : el,
                    ),
                  },
                  baselineRef.current || doc,
                )
              }
              onFocus={() => {
                baselineRef.current = doc
              }}
            />
          </Row>
        </div>
      </div>

      <div className="props-hint">
        Tip: drag the block on the canvas to reposition it. Undo restores earlier layouts.
      </div>
    </div>
  )
}
