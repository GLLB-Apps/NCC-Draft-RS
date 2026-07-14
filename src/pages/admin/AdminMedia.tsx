import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { MediaItem } from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { formatDateShort, statusLabel, statusBadgeClass, mediaTypeLabel } from '../../lib/utils'

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('media_items').select('*').order('updated_at', { ascending: false }).then(({ data }) => {
      setItems(data as MediaItem[] ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1>Media</h1>
        <Link to="/admin/media/ny" className="btn btn-primary btn-sm">Ny media</Link>
      </div>
      {items.length === 0 ? (
        <div className="empty-state"><p>Inget media finns ännu.</p></div>
      ) : (
        <div className="admin-list">
          {items.map(m => (
            <div key={m.id} className="admin-list-item">
              <div className="admin-list-item-info">
                <div className="admin-list-item-title">{m.title}</div>
                <div className="admin-list-item-meta">
                  <span className={statusBadgeClass(m.status)}>{statusLabel(m.status)}</span>
                  <span>{mediaTypeLabel(m.media_type)}</span>
                  <span>{formatDateShort(m.media_date)}</span>
                </div>
              </div>
              <div className="admin-table-actions">
                <Link to={`/admin/media/${m.id}`} className="btn btn-secondary btn-sm">Redigera</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
