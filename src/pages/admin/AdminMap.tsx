import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { MapLocation } from '../../lib/types'
import { supabase } from '../../lib/supabase'
import { mapPointTypeLabel, statusLabel, statusBadgeClass } from '../../lib/utils'

export default function AdminMap() {
  const [points, setPoints] = useState<MapLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('map_locations').select('*').order('updated_at', { ascending: false }).then(({ data }) => {
      setPoints(data as MapLocation[] ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1>Kartpunkter</h1>
        <Link to="/admin/karta/ny" className="btn btn-primary btn-sm">Ny kartpunkt</Link>
      </div>
      {points.length === 0 ? (
        <div className="empty-state"><p>Inga kartpunkter finns ännu.</p></div>
      ) : (
        <div className="admin-list">
          {points.map(p => (
            <div key={p.id} className="admin-list-item">
              <div className="admin-list-item-info">
                <div className="admin-list-item-title">{p.title}</div>
                <div className="admin-list-item-meta">
                  <span className={statusBadgeClass(p.status)}>{statusLabel(p.status)}</span>
                  <span>{mapPointTypeLabel(p.point_type)}</span>
                  <span>{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>
                </div>
              </div>
              <div className="admin-table-actions">
                <Link to={`/admin/karta/${p.id}`} className="btn btn-secondary btn-sm">Redigera</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
