export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[äÄ]/g, 'a')
    .replace(/[åÅ]/g, 'a')
    .replace(/[öÖ]/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(date: string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('sv-SE', opts ?? { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateShort(date: string | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function senderTypeLabel(type: string | null): string {
  const map: Record<string, string> = {
    ncc: 'NCC',
    lund_kommun: 'Lunds kommun',
    authority: 'Myndighet',
    media: 'Media',
    initiative: 'Initiativet',
    private: 'Privatperson',
  }
  return type ? (map[type] ?? type) : 'Okänd'
}

export function senderTypeBadge(type: string | null): string {
  const map: Record<string, string> = {
    ncc: 'badge-error',
    lund_kommun: 'badge',
    authority: 'badge-warning',
    media: 'badge-muted',
    initiative: 'badge-success',
    private: 'badge-muted',
  }
  return type ? (map[type] ?? 'badge-muted') : 'badge-muted'
}

export function mediaTypeLabel(type: string): string {
  const map: Record<string, string> = {
    image: 'Bild',
    video: 'Video',
    map: 'Karta',
    graphic: 'Grafik',
    press_image: 'Pressbild',
  }
  return map[type] ?? type
}

export function mapPointTypeLabel(type: string): string {
  const map: Record<string, string> = {
    work_area: 'Verksamhetsområde',
    quarry_area: 'Brytområde',
    property_border: 'Fastighetsgräns',
    transport_route: 'Transportväg',
    residence_distance: 'Avstånd till bostad',
    nature_value: 'Naturvärde',
    walking_trail: 'Promenadstråk',
    observation_point: 'Observationspunkt',
    photo_point: 'Fotopunkt',
    testimony_point: 'Vittnesmålspunkt',
  }
  return map[type] ?? type
}

export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    superadmin: 'Superadmin',
    redaktor: 'Redaktör',
    skribent: 'Skribent',
  }
  return map[role] ?? role
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: 'Utkast',
    review: 'Väntar på granskning',
    published: 'Publicerad',
    archived: 'Arkiverad',
    pending: 'Väntar på granskning',
    approved: 'Godkänd',
    rejected: 'Avslagen',
    unread: 'Oläst',
    read: 'Läst',
    handled: 'Hanterat',
  }
  return map[status] ?? status
}

export function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    published: 'badge-success',
    approved: 'badge-success',
    handled: 'badge-success',
    draft: 'badge-muted',
    archived: 'badge-muted',
    rejected: 'badge-error',
    review: 'badge-warning',
    pending: 'badge-warning',
    unread: 'badge-warning',
    read: 'badge-muted',
  }
  return map[status] ?? 'badge-muted'
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '…'
}
