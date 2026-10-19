# Logrithoo — Image-to-Document Composer (Prototype)

Logrithoo is a frontend prototype of an image-to-document composing tool. Users upload a scanned
document image, preview it on a page canvas, edit and format text blocks, and export the result
as a **real** PDF or DOCX file — all entirely in the browser.

> **Honest scope note:** this prototype performs **no OCR**. Text content comes from editable
> sample layouts bundled with the app. Any UI that might imply extraction is labelled accordingly.

## Tech stack

| Layer      | Choice                                                  |
| ---------- | ------------------------------------------------------- |
| Framework  | React 18 + Vite (JavaScript)                            |
| Routing    | React Router v6                                         |
| Icons      | lucide-react                                            |
| Styling    | Standard CSS (design tokens, no Tailwind)               |
| PDF export | html2canvas + jsPDF (real downloadable file)            |
| DOCX export| `docx` package (real downloadable file)                 |
| Storage    | Browser `localStorage` (documents + preferences)        |

No API keys, paid services, or backend infrastructure are required.

## Getting started

```bash
# 1. install dependencies
npm install

# 2. start the dev server
npm run dev
```

Open the printed URL (default: http://localhost:5173).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build
```

> PowerShell note: if `npm` is blocked by execution policy, use `npm.cmd install` / `npm.cmd run dev`.

## Pages & flows

| Route            | Page             | What works                                                                 |
| ---------------- | ---------------- | -------------------------------------------------------------------------- |
| `/`              | Landing          | Product intro, how it works, formats, features, honest limitations section |
| `/dashboard`     | Dashboard        | Sidebar app shell, search, recent docs, open / rename / duplicate / delete |
| `/upload`        | Upload           | Drag-and-drop + file picker, JPG/PNG & 10 MB validation, preview, replace/remove |
| `/editor/:id`    | Document editor  | Editable text blocks, drag positioning, formatting, zoom, undo/redo, autosave |
| `/settings`      | Settings         | Demo profile, appearance (Light/Dim), default export format, 4 languages, data reset |

### First-run experience

On first load, three sample documents are seeded into `localStorage`:

1. **School Weekly Notice — Grade 5** (English school notice with a bilingual Urdu line)
2. **اردو اطلاع — امتحانات** (short Urdu notice using a Nastaliq font fallback, RTL)
3. **Inter-Office Memorandum** (business memo)

Open any sample in the editor, or use **Create new document** on the dashboard to upload your own
image. The upload flow places your image as the page background and adds an editable sample text
block — it does **not** extract text from the image.

### Editor shortcuts

| Action              | How                                  |
| ------------------- | ------------------------------------ |
| Edit text           | Double-click a block (or press Enter)|
| Move text           | Drag a block on the canvas           |
| Undo / Redo         | `Ctrl+Z` / `Ctrl+Shift+Z` (`Ctrl+Y`) |
| Save draft          | `Ctrl+S` or **Save draft** button    |
| Delete block        | Select + `Delete` / `Backspace`      |
| Deselect / exit edit| `Escape`                             |

Drafts autosave locally ~1 second after edits.

### Exports

* **PDF** — the visible page canvas (including the background scan) is rendered with
  html2canvas and written into a single-page PDF via jsPDF. Real file download.
* **DOCX** — text blocks are converted (ordered top-to-bottom) into an editable Word document
  with bold, italic, size, colour, and alignment. Real file download.

## Architecture

```
src/
├── components/
│   ├── common/      Button, Modal, Tooltip, Toaster, EmptyState, ProgressBar, Logo
│   ├── layout/      AppLayout (sidebar + header + profile menu)
│   ├── dashboard/   DocumentCard, DocumentThumbnail
│   └── editor/      EditorToolbar, DocumentCanvas, TextElement,
│                    PropertiesPanel, ExportDialog
├── context/         AppContext (preferences, toasts, i18n hook)
├── data/            samples.js (sample documents + shared defaults)
├── pages/           Landing, Dashboard, Upload, Editor, Settings
├── styles/          variables.css, base.css, components.css + per-page CSS
└── utils/           storage.js, validation.js, export.js, i18n.js
```

### Document model

Documents are plain JSON objects:

```js
{
  id: 'sample_school_notice',
  name: 'School Weekly Notice — Grade 5',
  source: 'sample' | 'user',
  createdAt: '2026-10-12T09:20:00.000Z',
  updatedAt: '2026-10-14T11:05:00.000Z',
  page: {
    width: 800,
    height: 1120,
    background: '#ffffff',
    backgroundImage: null,        // data URL of an uploaded scan (optional)
    showBackground: true,
  },
  elements: [
    {
      id: 's1_title',
      type: 'text',
      x: 70, y: 176,
      width: 660,
      text: 'OFFICE NOTICE',
      style: {
        fontFamily: 'Georgia, …',
        fontSize: 22,
        color: '#101a30',
        bold: true,
        italic: false,
        align: 'center',
        lineHeight: 1.5,
        dir: 'ltr',
      },
    },
  ],
}
```

Editor state is managed with a reducer (`load`, `set`, `commit`, `finalize`, `undo`, `redo`)
that keeps snapshots of whole documents for reliable history, including drag operations
(`commit` records immediately; `finalize` records a pre-interaction baseline).

## Known limitations

* **No OCR / AI** — text blocks are sample content; Urdu OCR is not attempted.
* **Urdu/Arabic RTL editing** is a prototype-level approximation (direction flag + Nastaliq
  system-font fallback); no InPage-style shaping controls.
* **DOCX export** reproduces text content and basic formatting, not absolute pixel positions or
  the background scan image.
* **PDF export** is a visual render — the result is an image-based PDF, not a text-selectable one.
* **No auth, cloud storage, payments, or chatbot.** Preferences and drafts live in one browser.
* Interface translation covers app chrome only; long marketing copy on the landing page remains
  in English.
* Uploaded images are downscaled to ≤1400 px and stored as JPEG data URLs so they fit within
  `localStorage` limits (~5 MB per origin).

## Next development steps

1. Real OCR integration (e.g. Tesseract.js) with a clear confidence UI and language packs.
2. Word-level bounding boxes and auto-wrapping to the detected text regions.
3. Multi-page documents and page reordering.
4. Layer support (background image layer, text layer) with visibility locking.
5. Selectable-text PDF export (vector text instead of canvas raster).
6. DOCX absolute positioning pass-through.
7. Optional cloud sync and real accounts — the document model is already backend-friendly JSON.
