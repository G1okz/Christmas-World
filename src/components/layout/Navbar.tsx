import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getAuthErrorMessage, logout } from '../../services/auth'

export default function Navbar() {
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleLogout() {
    setError('')
    try {
      await logout()
      navigate('/', { replace: true })
    } catch (cause) {
      setError(getAuthErrorMessage(cause, 'logout'))
    }
  }

  return (
    <header className="site-header">
      <Link aria-label="Christmas World, inicio" className="brand" to="/">
        <span aria-hidden="true">✦</span> Christmas World
      </Link>
      <nav aria-label="Navegación principal" className="site-nav">
        {isAuthenticated ? (
          <>
            <Link to="/calendar">Calendario</Link>
            <Link to="/quiz">Quiz</Link>
            <Link to="/challenges">Retos</Link>
            <Link to="/progress">Progreso</Link>
            <span className="site-nav__nickname">{profile?.nickname}</span>
            <button className="button button--small" onClick={handleLogout} type="button">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link className="button button--small button--outline" to="/register">
              Crear cuenta
            </Link>
          </>
        )}
      </nav>
      {error && <p className="navbar-error" role="alert">{error}</p>}
    </header>
  )
}
