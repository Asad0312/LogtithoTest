import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FileStack,
  Home,
  Menu,
  Settings,
  UploadCloud,
  ChevronDown,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react'
import Logo from '../common/Logo.jsx'
import Toaster from '../common/Toaster.jsx'
import { useApp } from '../../context/AppContext.jsx'
import './AppLayout.css'

const NAV_ITEMS = [
  { to: '/dashboard', key: 'nav.dashboard', icon: FileStack },
  { to: '/upload', key: 'nav.upload', icon: UploadCloud },
  { to: '/settings', key: 'nav.settings', icon: Settings },
]

const TITLES = {
  '/dashboard': 'nav.dashboard',
  '/upload': 'nav.upload',
  '/settings': 'nav.settings',
}

export default function AppLayout() {
  const { t, prefs } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [])

  const titleKey = TITLES[location.pathname]
  const initials = (prefs.profile.name || 'DU')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="layout">
      <aside className={`sidebar ${drawerOpen ? 'is-open' : ''}`}>
        <div className="sidebar-head">
          <NavLink to="/" className="sidebar-logo">
            <Logo />
          </NavLink>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          {NAV_ITEMS.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={18} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-card">
            <Sparkles size={16} className="sidebar-card-icon" />
            <p className="sidebar-card-title">{t('app.tagline')}</p>
            <p className="sidebar-card-desc">Prototype build v0.1 · Data stored in this browser only.</p>
          </div>
          <NavLink to="/" className="sidebar-home">
            <Home size={16} />
            <span>{t('nav.home')}</span>
          </NavLink>
        </div>
      </aside>

      {drawerOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      <div className="layout-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="topbar-burger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="topbar-title">{titleKey ? t(titleKey) : 'Logrithoo'}</h1>
          </div>

          <div className="topbar-right" ref={menuRef}>
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={() => navigate('/settings')}
              aria-label={t('nav.settings')}
            >
              <Settings size={18} />
            </button>

            <div className="profile">
              <button
                type="button"
                className="profile-btn"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
              >
                <span className="avatar">{initials}</span>
                <span className="profile-name">{prefs.profile.name}</span>
                <ChevronDown size={15} className="profile-caret" />
              </button>

              {menuOpen ? (
                <div className="profile-menu">
                  <div className="profile-menu-head">
                    <p className="profile-menu-name">{prefs.profile.name}</p>
                    <p className="profile-menu-email">{prefs.profile.email}</p>
                    <span className="chip chip-demo">Demo account</span>
                  </div>
                  <button type="button" className="profile-menu-item" onClick={() => navigate('/settings')}>
                    <Settings size={15} />
                    {t('nav.settings')}
                  </button>
                  <button type="button" className="profile-menu-item" onClick={() => navigate('/')}>
                    <LogOut size={15} />
                    {t('nav.home')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  )
}
