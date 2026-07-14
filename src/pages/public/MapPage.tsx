import { useEffect, useState } from 'react'
import type { MapLocation } from '../../lib/types'
import { supabase } from '../../lib/supabase'
import MapPreview from '../../components/public/MapPreview'
import { mapPointTypeLabel } from '../../lib/utils'

const COLORS: Record<string, string> = {
  work_area: '#b94a3d',
  quarry_area: '#b94a3d',
  property_border: '#4a6c7f',
  transport_route: '#b8860b',
  residence_distance: '#8b6f47',
  nature_value: '#3d7a52',
  walking_trail: '#2d5a3d',
  observation_point: '#4a6c7f',
  photo_point: '#8b6f47',
  testimony_point: '#2d5a3d',
}

export default function MapPage() {
  const [points, setPoints] = useState<MapLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase
      .from('map_locations')
      .select('*')
      .eq('status', 'published')
      .then(({ data }) => {
        setPoints(data as MapLocation[] ?? [])
        setLoading(false)
      })
  }, [])

  const filteredPoints = activeTypes.size === 0 ? points : points.filter(p => activeTypes.has(p.point_type))

  function toggleType(type: string) {
    setActiveTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const uniqueTypes = Array.from(new Set(points.map(p => p.point_type)))

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h1>Karta</h1>
        <p>Det planerade området och intressanta punkter.</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : points.length === 0 ? (
        <div className="empty-state">
          <p>Inga kartpunkter har publicerats ännu.</p>
        </div>
      ) : (
        <>
          <div className="map-container">
            <MapPreview points={filteredPoints} height={500} />
          </div>

          {uniqueTypes.length > 0 && (
            <div className="map-legend">
              {uniqueTypes.map(type => (
                <button
                  key={type}
                  className="map-legend-item"
                  onClick={() => toggleType(type)}
                  style={{
                    cursor: 'pointer',
                    opacity: activeTypes.size === 0 || activeTypes.has(type) ? 1 : 0.4,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  <span className="map-legend-dot" style={{ background: COLORS[type] ?? '#2d5a3d' }}></span>
                  {mapPointTypeLabel(type)}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
