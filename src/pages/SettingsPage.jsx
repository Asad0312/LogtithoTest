import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Download,
  Eye,
  Globe,
  RotateCcw,
  User,
} from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { LANGUAGES } from '../utils/i18n.js'
import { reseedSamples } from '../utils/storage.js'

export default function SettingsPage() {
  const { prefs, setPreference, setProfile, t, pushToast } = useApp()
  const [confirmReset, setConfirmReset] = useState(false)
  const [profileDraft, setProfileDraft] = useState(prefs.profile)

  const saveProfile = () => {
    setProfile({
      name: profileDraft.name.trim() || 'Demo User',
      email: profileDraft.email.trim(),
    })
    pushToast('success', 'Profile updated (demo data, stored locally).')
  }

  return (
    <div className="settings">
      <div className="page-head">
        <div>
          <h2 className="page-title">{t('settings.title')}</h2>
          <p className="page-subtitle">{t('settings.subtitle')}</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="card settings-card">
          <div className="settings-card-head">
            <User size={17} />
            <h3>{t('settings.profile')}</h3>
            <span className="chip chip-demo">Demo data</span>
          </div>

          <div className="settings-avatar-row">
            <span className="settings-avatar">
              {(profileDraft.name || 'DU')
                .split(/\s+/)
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </span>
            <p>
              This profile is fictional and exists only for the prototype. There is no
              authentication, and nothing is sent to a server.
            </p>
          </div>

          <div className="settings-fields">
            <div className="field">
              <label className="field-label" htmlFor="profile-name">Display name</label>
              <input
                id="profile-name"
                className="input"
                value={profileDraft.name}
                onChange={(e) => setProfileDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                className="input"
                value={profileDraft.email}
                onChange={(e) => setProfileDraft((d) => ({ ...d, email: e.target.value }))}
              />
              <span className="field-hint">Shown in the header menu only. No mail is ever sent.</span>
            </div>
          </div>

          <div className="settings-actions">
            <Button onClick={saveProfile}>Save profile</Button>
            <Button
              variant="ghost"
              onClick={() => {
                setProfileDraft(prefs.profile)
                pushToast('info', 'Changes discarded.')
              }}
            >
              Reset fields
            </Button>
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-card-head">
            <Eye size={17} />
            <h3>{t('settings.appearance')}</h3>
          </div>
          <div className="settings-options">
            {[
              { key: 'light', label: 'Light', desc: 'Bright white surfaces (default)' },
              { key: 'dim', label: 'Dim', desc: 'Softer grey surfaces, reduced contrast' },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`settings-option ${prefs.theme === opt.key ? 'is-active' : ''}`}
                onClick={() => setPreference('theme', opt.key)}
              >
                <span className={`theme-preview theme-${opt.key}`} aria-hidden="true" />
                <span>
                  <strong>{opt.label}</strong>
                  <em>{opt.desc}</em>
                </span>
                {prefs.theme === opt.key ? <Check size={16} className="settings-check" /> : null}
              </button>
            ))}
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-card-head">
            <Download size={17} />
            <h3>{t('settings.exportFormat')}</h3>
          </div>
          <div className="settings-fields">
            <div className="field">
              <label className="field-label" htmlFor="default-export">Preferred format</label>
              <select
                id="default-export"
                className="select"
                value={prefs.defaultExport}
                onChange={(e) => setPreference('defaultExport', e.target.value)}
              >
                <option value="pdf">PDF — pixel-accurate page render</option>
                <option value="docx">DOCX — editable Word document</option>
              </select>
              <span className="field-hint">
                Used to pre-select the format in the export dialog. You can still switch formats
                each time.
              </span>
            </div>
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-card-head">
            <Globe size={17} />
            <h3>{t('settings.language')}</h3>
          </div>
          <div className="settings-langs">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`settings-lang ${prefs.language === lang.code ? 'is-active' : ''}`}
                onClick={() => setPreference('language', lang.code)}
              >
                <span className="settings-lang-native">{lang.native}</span>
                <span className="settings-lang-label">{lang.label}</span>
                {prefs.language === lang.code ? <Check size={15} className="settings-check" /> : null}
              </button>
            ))}
          </div>
          <div className="note note-warning settings-note">
            <AlertTriangle size={16} />
            <span>
              This changes interface labels and page direction only. It does <strong>not</strong>{' '}
              enable OCR, translation, or language detection — those are outside the scope of this
              prototype. Long-form marketing text stays in English.
            </span>
          </div>
        </section>

        <section className="card settings-card settings-danger">
          <div className="settings-card-head">
            <RotateCcw size={17} />
            <h3>Local data</h3>
          </div>
          <p className="settings-danger-text">
            Restore the three bundled sample documents and remove any drafts you created in this
            browser. Preferences are kept.
          </p>
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>
            Reset documents to samples
          </Button>
        </section>
      </div>

      <Modal
        open={confirmReset}
        title="Reset local documents?"
        onClose={() => setConfirmReset(false)}
        width={430}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>{t('common.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => {
                reseedSamples()
                setConfirmReset(false)
                pushToast('info', 'Documents reset to the bundled samples.')
              }}
            >
              Reset documents
            </Button>
          </>
        }
      >
        <p className="settings-danger-text">
          Every document stored in this browser — including drafts created from uploaded images —
          will be replaced by the original sample set. This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
