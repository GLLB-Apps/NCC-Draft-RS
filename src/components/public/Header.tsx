import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { SiteSettings, NavigationItem } from '../../lib/types'
import { supabase } from '../../lib/supabase'

export default function Header({ settings }: { settings: SiteSettings | null }) {
  const [navItems, setNavItems] = useState<NavigationItem[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    supabase
      .from('navigation_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setNavItems(data ?? []))
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="site-header">
      {settings?.status_message && (
        <div className="status-bar">
          <div className="container">
            <span className="status-bar-text">{settings.status_message}</span>
          </div>
        </div>
      )}
      <div className="container header-inner">
        <Link to="/" className="site-logo" aria-label={settings?.site_name ?? 'Rögleskogen'}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.site_name} className="logo-img" />
          ) : (
            <span className="logo-text">
              <span className="logo-name">{settings?.site_name ?? 'Rögleskogen'}</span>
              <span className="logo-subtitle">{settings?.site_subtitle}</span>
            </span>
          )}
        </Link>

        <nav className="main-nav" aria-label="Huvudmeny">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.url}
              className={location.pathname === item.url ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a
            href={settings?.petition_url ?? '#'}
            className="btn btn-primary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Skriv under
          </a>
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobilmeny">
          <div className="container">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.url}
                className={location.pathname === item.url ? 'mobile-nav-link active' : 'mobile-nav-link'}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={settings?.petition_url ?? '#'}
              className="btn btn-primary mobile-nav-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Skriv under
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
