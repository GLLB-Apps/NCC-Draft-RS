import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import type { SiteSettings, Topic, Post, Testimony, TimelineEvent, DocumentItem, MapLocation } from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { formatDate, formatDateShort, truncate } from '../../lib/utils'
import MapPreview from '../../components/public/MapPreview'

export default function HomePage() {
  const { settings } = useOutletContext<{ settings: SiteSettings | null }>()
  const [topics, setTopics] = useState<Topic[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [mapPoints, setMapPoints] = useState<MapLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('topics').select('*').eq('status', 'published').order('sort_order').limit(10),
      supabase.from('posts').select('*').eq('status', 'published').order('is_pinned', { ascending: false }).order('published_at', { ascending: false }).limit(3),
      supabase.from('testimonies').select('*').eq('status', 'approved').order('published_at', { ascending: false }).limit(3),
      supabase.from('timeline_events').select('*').eq('status', 'published').order('event_date', { ascending: false }).limit(5),
      supabase.from('documents').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(4),
      supabase.from('map_locations').select('*').eq('status', 'published').limit(20),
    ]).then(([t, p, te, tl, d, m]) => {
      setTopics(t.data as Topic[] ?? [])
      setPosts(p.data as Post[] ?? [])
      setTestimonies(te.data as Testimony[] ?? [])
      setTimeline(tl.data as TimelineEvent[] ?? [])
      setDocuments(d.data as DocumentItem[] ?? [])
      setMapPoints(m.data as MapLocation[] ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="hero">
        {settings?.hero_image && (
          <div className="hero-bg" style={{ backgroundImage: `url(${settings.hero_image})` }} />
        )}
        <div className="hero-content">
          <h1>{settings?.hero_title ?? 'Ett nytt stenbrott planeras i Rögleskogen'}</h1>
          <p className="hero-intro">{settings?.hero_intro}</p>
          <div className="hero-actions">
            <Link to="/amnen" className="btn btn-primary">Läs om planerna</Link>
            <a href={settings?.petition_url ?? '#'} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Skriv under</a>
            <Link to="/karta" className="btn btn-secondary">Se området på karta</Link>
          </div>
        </div>
      </section>

      {/* Current status */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Aktuell status</h2>
            <p>Översikt över var i processen vi befinner oss.</p>
          </div>
          <div className="status-card">
            <div className="status-item">
              <span className="status-label">Aktuell fas</span>
              <span className="status-value">{settings?.status_phase ?? 'Informations- och samrådsskedet'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Nästa viktiga datum</span>
              <span className="status-value">{settings?.next_important_date ? formatDate(settings.next_important_date) : 'Ännu ej announced'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Senast uppdaterad</span>
              <span className="status-value">{formatDate(new Date().toISOString())}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Underskrifter</span>
              <span className="status-value">{settings?.signature_count ?? 0}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Namninsamling</span>
              <a href={settings?.petition_url ?? '#'} target="_blank" rel="noopener noreferrer" className="status-value" style={{ color: 'var(--primary)' }}>
                Skrivunder.com →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Kort sammanfattning</h2>
          </div>
          <div className="grid grid-3">
            <div className="card">
              <h3>Vad planeras?</h3>
              <p className="text-muted">NCC har informerat om planer på att ansöka om tillstånd för en ny bergtäkt i Rögleskogen mellan Södra Sandby och Dalby i Lunds kommun.</p>
            </div>
            <div className="card">
              <h3>Varför väcker det frågor?</h3>
              <p className="text-muted">Boende och naturintresserade har frågor om buller, damm, trafik, naturvärden och påverkan på närmiljö och livsmiljö.</p>
            </div>
            <div className="card">
              <h3>Vad händer nu?</h3>
              <p className="text-muted">Processen befinner sig i ett tidigt skede. Information samlas här kontinuerligt. Håll dig uppdaterad via tidslinjen och nyheterna.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      {topics.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Ämnesområden</h2>
              <p>Utforska olika aspekter av den planerade bergtäkten.</p>
            </div>
            <div className="grid grid-3">
              {topics.map(topic => (
                <Link key={topic.id} to={`/amnen/${topic.slug}`} className="card card-clickable topic-card">
                  <div className="topic-card-icon">
                    {topic.featured_image ? (
                      <img src={topic.featured_image} alt="" style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                    ) : (
                      <span aria-hidden="true">◇</span>
                    )}
                  </div>
                  <h3>{topic.title}</h3>
                  {topic.intro && <p>{truncate(topic.intro, 100)}</p>}
                </Link>
              ))}
            </div>
            <Link to="/amnen" className="section-link">Alla ämnen →</Link>
          </div>
        </section>
      )}

      {/* Map preview */}
      {mapPoints.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Karta</h2>
              <p>Se det planerade området och intressanta punkter.</p>
            </div>
            <MapPreview points={mapPoints} />
            <Link to="/karta" className="section-link">Se hela kartan →</Link>
          </div>
        </section>
      )}

      {/* Latest news */}
      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Senaste nytt</h2>
            </div>
            <div className="grid grid-3">
              {posts.map(post => (
                <Link key={post.id} to={`/nyheter/${post.slug}`} className="card card-clickable news-card">
                  {post.featured_image && (
                    <img src={post.featured_image} alt="" className="news-card-image" />
                  )}
                  <span className="news-card-date">{formatDateShort(post.published_at)}</span>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{truncate(post.excerpt, 120)}</p>}
                </Link>
              ))}
            </div>
            <Link to="/nyheter" className="section-link">Fler nyheter →</Link>
          </div>
        </section>
      )}

      {/* Testimonies */}
      {testimonies.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Vittnesmål</h2>
              <p>Röster från boende och besökare i området.</p>
            </div>
            <div className="grid grid-3">
              {testimonies.map(t => (
                <div key={t.id} className="testimony-card">
                  {t.title && <h3>{t.title}</h3>}
                  <p className="testimony-quote">"{truncate(t.story, 200)}"</p>
                  <p className="testimony-author">
                    {t.is_anonymous ? 'Anonym' : t.author_name ?? 'Anonym'}
                    {t.location && `, ${t.location}`}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/vittnesmal" className="section-link">Alla vittnesmål →</Link>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="section">
          <div className="container container-narrow">
            <div className="section-header">
              <h2>Tidslinje</h2>
              <p>Viktiga händelser i processen.</p>
            </div>
            <div className="timeline">
              {timeline.map(event => (
                <div key={event.id} className="timeline-item">
                  <div className="timeline-date">{formatDate(event.event_date)}</div>
                  <div className="timeline-title">{event.title}</div>
                  {event.description && <div className="timeline-desc">{event.description}</div>}
                </div>
              ))}
            </div>
            <Link to="/tidslinje" className="section-link">Hela tidslinjen →</Link>
          </div>
        </section>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Dokument</h2>
              <p>Nyligen publicerade handlingar och underlag.</p>
            </div>
            <div className="grid grid-2">
              {documents.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="document-icon" aria-hidden="true">📄</div>
                  <div className="document-info">
                    <h4>{doc.title}</h4>
                    {doc.description && <p>{truncate(doc.description, 100)}</p>}
                    <p>{doc.document_date && formatDateShort(doc.document_date)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/dokument" className="section-link">Alla dokument →</Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-section">
            <h2>Hjälp till att sprida informationen</h2>
            <p className="text-muted">Skriv under namninsamlingen, dela informationen eller lämna ditt vittnesmål.</p>
            <div className="cta-actions">
              <a href={settings?.petition_url ?? '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Skriv under</a>
              <Link to="/vittnesmal" className="btn btn-secondary">Lämna ett vittnesmål</Link>
              <Link to="/kontakt" className="btn btn-secondary">Kontakta initiativet</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
