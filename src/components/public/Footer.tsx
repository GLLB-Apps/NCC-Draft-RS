import { Link } from 'react-router-dom'
import type { SiteSettings } from '../../lib/types'

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h3 className="footer-title">{settings?.site_name ?? 'Rögleskogen'}</h3>
          <p className="footer-subtitle">{settings?.site_subtitle}</p>
          {settings?.footer_text && <p className="footer-text">{settings.footer_text}</p>}
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Start</Link></li>
            <li><Link to="/amnen">Ämnen</Link></li>
            <li><Link to="/nyheter">Nyheter</Link></li>
            <li><Link to="/vittnesmal">Vittnesmål</Link></li>
            <li><Link to="/dokument">Dokument</Link></li>
            <li><Link to="/kontakt">Kontakt</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Kontakt</h4>
          {settings?.contact_email && (
            <p className="footer-contact">
              <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
            </p>
          )}
          {settings?.contact_phone && (
            <p className="footer-contact">{settings.contact_phone}</p>
          )}
          {settings?.social_links && Object.entries(settings.social_links).length > 0 && (
            <div className="footer-social">
              {Object.entries(settings.social_links).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {settings?.site_name ?? 'Rögleskogen'}. Exempeldata — inte verifierade fakta utan källhänvisning.
          </p>
          <Link to="/admin" className="footer-admin-link">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
