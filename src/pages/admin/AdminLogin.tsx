import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'

export default function AdminLogin() {
  const { signIn, user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <div className="loading"><div className="spinner"></div></div>
  if (user && isAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
      show('Inloggning misslyckades', 'error')
    } else {
      show('Inloggad', 'success')
      navigate('/admin')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Rögleskogen</h1>
        <p className="admin-login-subtitle">Administrationspanel</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-post</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Lösenord</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="form-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
            {submitting ? 'Loggar in…' : 'Logga in'}
          </button>
        </form>

        <p className="admin-login-hint">
          Endast för administratörer. Kontakta en superadmin om du behöver åtkomst.
        </p>
      </div>
    </div>
  )
}
