import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Topic } from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { formatDateShort, statusLabel, statusBadgeClass } from '../../lib/utils'

export default function AdminTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('topics')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setTopics(data as Topic[] ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1>Ämnesområden</h1>
        <Link to="/admin/amnen/ny" className="btn btn-primary btn-sm">Nytt ämne</Link>
      </div>

      {topics.length === 0 ? (
        <div className="empty-state"><p>Inga ämnen finns ännu.</p></div>
      ) : (
        <div className="admin-list">
          {topics.map(t => (
            <div key={t.id} className="admin-list-item">
              <div className="admin-list-item-info">
                <div className="admin-list-item-title">{t.title}</div>
                <div className="admin-list-item-meta">
                  <span className={statusBadgeClass(t.status)}>{statusLabel(t.status)}</span>
                  <span>/{t.slug}</span>
                  <span>Uppdaterad {formatDateShort(t.updated_at)}</span>
                </div>
              </div>
              <div className="admin-table-actions">
                <Link to={`/admin/amnen/${t.id}`} className="btn btn-secondary btn-sm">Redigera</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
