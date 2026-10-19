import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import {
  AlignmentType,
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
} from 'docx'

const ALIGN_MAP = {
  left: AlignmentType.LEFT,
  center: AlignmentType.CENTER,
  right: AlignmentType.RIGHT,
  justify: AlignmentType.JUSTIFIED,
}

function safeFileName(name) {
  const cleaned = (name || 'document').replace(/[\\/:*?"<>|]+/g, ' ').trim()
  return cleaned || 'document'
}

/**
 * Renders the live page element to a real PDF file and triggers a download.
 * Returns the downloaded file name.
 */
export async function exportToPDF(pageEl, scalerEl, doc) {
  if (!pageEl) throw new Error('Document canvas is not available for export.')

  const prevTransform = scalerEl ? scalerEl.style.transform : null
  if (scalerEl) scalerEl.style.transform = 'none'

  try {
    await new Promise((r) => setTimeout(r, 60))
    const canvas = await html2canvas(pageEl, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    })
    const imageData = canvas.toDataURL('image/jpeg', 0.94)
    const wPt = doc.page.width * 0.75
    const hPt = doc.page.height * 0.75
    const pdf = new jsPDF({ unit: 'pt', format: [wPt, hPt], orientation: 'portrait' })
    pdf.addImage(imageData, 'JPEG', 0, 0, wPt, hPt, undefined, 'FAST')
    const fileName = `${safeFileName(doc.name)}.pdf`
    pdf.save(fileName)
    return fileName
  } finally {
    if (scalerEl) scalerEl.style.transform = prevTransform || ''
  }
}

/**
 * Builds a real .docx file from the document model (text blocks ordered by
 * vertical position) and triggers a download. Returns the file name.
 */
export async function exportToDOCX(doc) {
  const blocks = [...doc.elements]
    .filter((el) => el.type === 'text' && el.text && el.text.trim())
    .sort((a, b) => a.y - b.y)

  const children = blocks.map((el) => {
    const style = el.style || {}
    return new Paragraph({
      alignment: ALIGN_MAP[style.align] || AlignmentType.LEFT,
      spacing: { after: 160, line: Math.round((style.lineHeight || 1.5) * 240) },
      children: [
        new TextRun({
          text: el.text,
          bold: Boolean(style.bold),
          italics: Boolean(style.italic),
          size: Math.max(12, Math.round((style.fontSize || 16) * 0.75) * 2),
          color: (style.color || '#1e293b').replace('#', ''),
          font: String(style.fontFamily || 'Arial').split(',')[0].replace(/["']/g, '').trim(),
        }),
      ],
    })
  })

  if (!children.length) {
    throw new Error('This document has no text blocks to export.')
  }

  const docxDoc = new DocxDocument({
    creator: 'Logrithoo Prototype',
    title: doc.name,
    description: 'Exported from the Logrithoo frontend prototype (no OCR performed).',
    sections: [
      {
        properties: {
          page: {
            size: {
              width: Math.round(doc.page.width * 15),
              height: Math.round(doc.page.height * 15),
            },
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(docxDoc)
  const fileName = `${safeFileName(doc.name)}.docx`
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  window.document.body.appendChild(anchor)
  anchor.click()
  window.document.body.removeChild(anchor)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return fileName
}
