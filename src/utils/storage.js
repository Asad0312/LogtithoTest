import { createSampleDocuments } from '../data/samples.js'

const DOCS_KEY = 'logrithoo:documents'
const SEED_KEY = 'logrithoo:seeded'

export function makeId(prefix = 'doc') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function loadDocuments() {
  try {
    const raw = localStorage.getItem(DOCS_KEY)
    if (!raw) {
      const seeded = createSampleDocuments()
      localStorage.setItem(DOCS_KEY, JSON.stringify(seeded))
      localStorage.setItem(SEED_KEY, '1')
      return seeded
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return createSampleDocuments()
  }
}

export function saveDocuments(docs) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs))
}

export function getDocument(id) {
  return loadDocuments().find((d) => d.id === id) || null
}

export function upsertDocument(doc) {
  const docs = loadDocuments()
  const idx = docs.findIndex((d) => d.id === doc.id)
  if (idx >= 0) docs[idx] = doc
  else docs.unshift(doc)
  saveDocuments(docs)
  return doc
}

export function deleteDocument(id) {
  const docs = loadDocuments().filter((d) => d.id !== id)
  saveDocuments(docs)
  return docs
}

export function duplicateDocument(id) {
  const docs = loadDocuments()
  const src = docs.find((d) => d.id === id)
  if (!src) return null
  const now = new Date().toISOString()
  const copy = {
    ...JSON.parse(JSON.stringify(src)),
    id: makeId(),
    name: `${src.name} (copy)`,
    source: 'user',
    createdAt: now,
    updatedAt: now,
    elements: src.elements.map((el) => ({ ...el, id: makeId('el') })),
  }
  docs.unshift(copy)
  saveDocuments(docs)
  return copy
}

export function renameDocument(id, name) {
  const docs = loadDocuments()
  const doc = docs.find((d) => d.id === id)
  if (!doc) return null
  doc.name = name
  doc.updatedAt = new Date().toISOString()
  saveDocuments(docs)
  return doc
}

export function reseedSamples() {
  const seeded = createSampleDocuments()
  saveDocuments(seeded)
  return seeded
}

export function formatDocDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function formatDocDateTime(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
  } catch {
    return iso
  }
}
