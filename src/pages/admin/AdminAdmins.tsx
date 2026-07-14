import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { roleLabel } from '../../lib/utils'
import type { UserRole } from '../../lib/types'

interface AdminUser {
  id: string
  email: string
  role: UserRole
  display_name: string | null
}

export default function AdminAdmins() {
  const { user: currentUser, role: currentRole } = useAuth()
  const { show } = useToast()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('skribent')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('user_roles')
      .select('user_id, role, profiles(display_name)')
      .order('created_at')

    if (!data) { setLoading(false); return }

    const adminList: AdminUser[] = data.map((row: Record<string, unknown>) => ({
      id: row.user_id as string,
      email: '', // We can't access email via anon key
      role: row.role as UserRole,
      display_name: (row.profiles as Record<string, string | null> | null)?.display_name ?? null,
    }))

    setAdmins(adminList)
    setLoading(false)
  }

  async function addAdmin() {
    if (!newEmail.trim()) return
    // We need to find the user by email. Since we can't query auth.users directly,
    // we'll need the user to have signed up first, then we can assign a role.
    show('För att lägga till en administratör: personen måste först skapa ett konto, sedan kan du tilldela en roll här.', 'warning')
    setNewEmail('')
  }

  async function updateRole(userId: string, role: UserRole) {
    const { error } = await supabase
      .from('user_roles')
      .update({ role })
      .eq('user_id', userId)

    if (error) show('Kunde inte uppdatera: ' + error.message, 'error')
    else { show('Roll uppdaterad', 'success'); load() }
  }

  async function removeRole(userId: string) {
    if (userId === currentUser?.id) {
      show('Du kan inte ta bort din egen roll', 'error')
      return
    }
    if (!confirm('Ta bort administratörsrollen?')) return
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (error) show('Kunde inte ta bort: ' + error.message, 'error')
    else { show('Roll borttagen', 'success'); load() }
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1>Administratörer</h1>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Lägg till administratör</h3>
        <p className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
          Personen måste först ha skapat ett konto via inloggningssidan. Därefter kan du tilldela en roll här.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label className="form-label" htmlFor="newEmail">E-post</label>
            <input id="newEmail" className="form-input" type="email" placeholder="admin@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="newRole">Roll</label>
            <select id="newRole" className="form-select" value={newRole} onChange={e => setNewRole(e.target.value as UserRole)}>
              <option value="superadmin">Superadmin</option>
              <option value="redaktor">Redaktör</option>
              <option value="skribent">Skribent</option>
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={addAdmin}>Lägg till</button>
        </div>
      </div>

      {admins.length === 0 ? (
        <div className="empty-state"><p>Inga administratörer finns ännu.</p></div>
      ) : (
        <div className="admin-list">
          {admins.map(a => (
            <div key={a.id} className="admin-list-item">
              <div className="admin-list-item-info">
                <div className="admin-list-item-title">
                  {a.display_name ?? 'Okänd användare'}
                  {a.id === currentUser?.id && <span className="badge badge-success" style={{ marginLeft: 'var(--space-2)' }}>Du</span>}
                </div>
                <div className="admin-list-item-meta">
                  <span>{roleLabel(a.role)}</span>
                </div>
              </div>
              <div className="admin-table-actions">
                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={a.role}
                  onChange={e => updateRole(a.id, e.target.value as UserRole)}
                  disabled={a.id === currentUser?.id && currentRole === 'superadmin'}
                  aria-label="Ändra roll"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="redaktor">Redaktör</option>
                  <option value="skribent">Skribent</option>
                </select>
                <button className="btn btn-danger btn-sm" onClick={() => removeRole(a.id)}>Ta bort</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
