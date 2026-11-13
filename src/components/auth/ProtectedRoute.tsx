import { useState, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getAuthErrorMessage, logout } from '../../services/auth'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { error, isAuthenticated, loading, profile, refreshProfile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [actionError, setActionError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  if (loading) {
    return (
      <main className="status-page" aria-live="polite">
        <p>Comprobando tu sesión…</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (error || !profile) {
    async function retryProfile() {
      setActionError('')
      setRefreshing(true)
      try {
        await refreshProfile()
      } catch {
        setActionError('No se pudo recuperar el perfil. Inténtalo más tarde.')
      } finally {
        setRefreshing(false)
      }
    }

    async function leaveAccount() {
      setActionError('')
      try {
        await logout()
        navigate('/', { replace: true })
      } catch (cause) {
        setActionError(getAuthErrorMessage(cause, 'logout'))
      }
    }

    return (
      <main className="status-page">
        <section className="status-card">
          <h1>No se pudo cargar tu perfil</h1>
          <p>
            La cuenta está autenticada, pero sus datos no están disponibles.
            No se ha creado un perfil nuevo automáticamente.
          </p>
          {actionError && <p className="form-message form-message--error" role="alert">{actionError}</p>}
          <div className="status-card__actions">
            <button className="button button--primary" disabled={refreshing} onClick={retryProfile} type="button">
              {refreshing ? 'Reintentando…' : 'Reintentar'}
            </button>
            <button className="button button--outline" onClick={leaveAccount} type="button">
              Cerrar sesión
            </button>
          </div>
        </section>
      </main>
    )
  }

  return children
}
