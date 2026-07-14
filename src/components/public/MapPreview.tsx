import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapLocation } from '../../lib/types'
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

export default function MapPreview({ points, height = 350 }: { points: MapLocation[]; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: points[0] ? [points[0].lat, points[0].lng] : [55.72, 13.32],
      zoom: 13,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    map.eachLayer(layer => {
      if (layer instanceof L.Marker) map.removeLayer(layer)
    })

    points.forEach(point => {
      const color = COLORS[point.point_type] ?? '#2d5a3d'
      const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      const marker = L.marker([point.lat, point.lng], { icon }).addTo(map)
      marker.bindPopup(`
        <strong>${point.title}</strong><br/>
        <span style="font-size:0.85rem;color:#666;">${mapPointTypeLabel(point.point_type)}</span>
        ${point.description ? `<br/><span style="font-size:0.85rem;">${point.description}</span>` : ''}
      `)
    })
  }, [points])

  return <div ref={containerRef} style={{ height, borderRadius: 'var(--radius-lg)' }} />
}
