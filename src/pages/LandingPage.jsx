import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  FileDown,
  FileText,
  Layers,
  Menu,
  MousePointerClick,
  Palette,
  ScanLine,
  UploadCloud,
  X,
  ShieldCheck,
  HardDrive,
  Type,
} from 'lucide-react'
import Logo from '../components/common/Logo.jsx'
import Toaster from '../components/common/Toaster.jsx'
import Button from '../components/common/Button.jsx'

const STEPS = [
  {
    icon: UploadCloud,
    title: 'Upload a scan',
    desc: 'Drop in a JPG or PNG of a printed page. Files never leave your browser in this prototype.',
  },
  {
    icon: MousePointerClick,
    title: 'Edit the layout',
    desc: 'Reposition and restyle text blocks on a live document canvas with simple formatting tools.',
  },
  {
    icon: FileDown,
    title: 'Export the result',
    desc: 'Download a real PDF rendered from your canvas, or a DOCX file built from the text model.',
  },
]

const FEATURES = [
  { icon: Type, title: 'Visual text editor', desc: 'Double-click any block to edit it in place, or use the properties panel.' },
  { icon: Layers, title: 'Drag-and-drop blocks', desc: 'Move headings, paragraphs, and signatures anywhere on the page.' },
  { icon: Palette, title: 'Formatting controls', desc: 'Font family, size, colour, bold, italic, alignment, and line spacing.' },
  { icon: HardDrive, title: 'Local drafts', desc: 'Documents and preferences are saved in your browser with localStorage.' },
  { icon: ScanLine, title: 'Bilingual samples', desc: 'English and Urdu sample layouts demonstrate mixed-script documents.' },
  { icon: FileText, title: 'Real file exports', desc: 'PDF and DOCX downloads are genuine files, not screenshots.' },
]

const LIMITS = [
  'No AI or OCR — sample text is pre-written demo content',
  'No cloud storage, accounts, or payments',
  'Urdu right-to-left editing is a prototype-level approximation',
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="landing">
      <Toaster />

      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <Logo />
          </Link>

          <nav className={`landing-links ${menuOpen ? 'is-open' : ''}`}>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#formats" onClick={() => setMenuOpen(false)}>Formats</a>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/dashboard" className="landing-links-cta" onClick={() => setMenuOpen(false)}>
              Get started
            </Link>
          </nav>

          <div className="landing-nav-actions">
            <Link to="/dashboard" className="landing-nav-desktop-cta">
              <Button size="sm">
                Get started <ArrowRight size={15} />
              </Button>
            </Link>
            <button
              type="button"
              className="landing-burger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                Frontend prototype · v0.1
              </span>
              <h1 className="hero-title">
                Turn scanned images into <span className="hero-accent">editable documents</span>.
              </h1>
              <p className="hero-desc">
                Logrithoo helps you reconstruct printed pages as structured documents. Upload a scan,
                arrange and format text blocks on a clean canvas, then export to PDF or DOCX.
              </p>
              <div className="hero-cta">
                <Link to="/upload">
                  <Button size="lg">
                    Start composing <ArrowRight size={17} />
                  </Button>
                </Link>
                <a href="#how">
                  <Button size="lg" variant="secondary">
                    See how it works
                  </Button>
                </a>
              </div>
              <p className="hero-note">No account, no API key — everything runs in your browser.</p>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-window">
                <div className="hero-window-bar">
                  <span /><span /><span />
                  <p>School Weekly Notice — Grade 5</p>
                </div>
                <div className="hero-window-body">
                  <div className="hero-doc">
                    <p className="hero-doc-title">OFFICE NOTICE</p>
                    <p className="hero-doc-line">Dear Parents and Guardians,</p>
                    <p className="hero-doc-para">
                      The Parent–Teacher Meeting for Grades 1 to 5 will be held on Saturday,
                      25 October 2026, from 9:00 AM to 1:00 PM in the school main hall.
                    </p>
                    <p className="hero-doc-block hero-doc-block-selected">
                      Principal
                      <span className="hero-handle" />
                    </p>
                  </div>
                  <div className="hero-panel">
                    <p className="hero-panel-title">Properties</p>
                    <div className="hero-panel-row"><span>Font</span><b>Georgia</b></div>
                    <div className="hero-panel-row"><span>Size</span><b>15</b></div>
                    <div className="hero-panel-row"><span>Align</span><b>Right</b></div>
                    <div className="hero-panel-row"><span>Bold</span><b>On</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="section-inner">
            <p className="section-eyebrow">Workflow</p>
            <h2 className="section-title">How it works</h2>
            <p className="section-desc">Three focused steps from a flat image to a downloadable document.</p>
            <div className="steps">
              {STEPS.map((step, i) => (
                <div className="step card" key={step.title}>
                  <div className="step-top">
                    <span className="step-icon"><step.icon size={20} /></span>
                    <span className="step-num">Step {i + 1}</span>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt" id="formats">
          <div className="section-inner">
            <p className="section-eyebrow">Export</p>
            <h2 className="section-title">Supported output formats</h2>
            <p className="section-desc">
              Exports in this prototype produce genuine downloadable files on your machine.
            </p>
            <div className="formats">
              <div className="format-card card">
                <span className="format-icon format-pdf"><FileDown size={22} /></span>
                <h3>PDF</h3>
                <p>
                  Your document canvas is rendered pixel-accurately into a single-page PDF that
                  matches the on-screen page size.
                </p>
                <span className="badge badge-user"><Check size={12} /> Real download</span>
              </div>
              <div className="format-card card">
                <span className="format-icon format-docx"><FileText size={22} /></span>
                <h3>DOCX</h3>
                <p>
                  Text blocks are converted into an editable Word document with preserved bold,
                  italic, size, colour, and alignment.
                </p>
                <span className="badge badge-user"><Check size={12} /> Real download</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-inner">
            <p className="section-eyebrow">Capabilities</p>
            <h2 className="section-title">Feature highlights</h2>
            <div className="features">
              {FEATURES.map((f) => (
                <div className="feature card" key={f.title}>
                  <span className="feature-icon"><f.icon size={19} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="limits card">
              <div className="limits-head">
                <ShieldCheck size={18} />
                <h3>Prototype boundaries</h3>
              </div>
              <ul className="limits-list">
                {LIMITS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="cta-band-inner">
            <h2>Compose your first document in minutes.</h2>
            <p>Open the dashboard to explore bundled samples, or upload your own scan.</p>
            <div className="cta-band-actions">
              <Link to="/dashboard">
                <Button size="lg">Open dashboard <ArrowRight size={17} /></Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="secondary">Upload an image</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Logo />
            <p>Image-to-document composer prototype. Built with React and standard CSS.</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Product</h4>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#formats">Formats</a>
            </div>
            <div>
              <h4>App</h4>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/upload">New upload</Link>
              <Link to="/settings">Settings</Link>
            </div>
            <div>
              <h4>Notes</h4>
              <span>Demo data only</span>
              <span>No OCR performed</span>
              <span>Local browser storage</span>
            </div>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2026 Logrithoo prototype</span>
          <span>Not a commercial product</span>
        </div>
      </footer>
    </div>
  )
}
