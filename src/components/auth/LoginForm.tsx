import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getAuthErrorMessage, login } from '../../services/auth'
import type { LoginCredentials } from '../../types/user'

interface LoginLocationState {
  from?: {
    pathname?: string
    search?: string
    hash?: string
  }
}

export default function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshProfile } = useAuth()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(credentials)
      await refreshProfile()
      const state = location.state as LoginLocationState | null
      const target = state?.from
        ? `${state.from.pathname ?? '/'}${state.from.search ?? ''}${state.from.hash ?? ''}`
        : '/calendar'
      navigate(target, { replace: true })
    } catch (cause) {
      setError(getAuthErrorMessage(cause, 'login'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="login-email">Correo electrónico</label>
      <input
        autoComplete="email"
        id="login-email"
        name="email"
        onChange={(event) =>
          setCredentials({ ...credentials, email: event.target.value })
        }
        required
        type="email"
        value={credentials.email}
      />

      <label htmlFor="login-password">Contraseña</label>
      <input
        autoComplete="current-password"
        id="login-password"
        name="password"
        onChange={(event) =>
          setCredentials({ ...credentials, password: event.target.value })
        }
        required
        type="password"
        value={credentials.password}
      />

      {error && <p className="form-message form-message--error" role="alert">{error}</p>}

      <button className="button button--primary" disabled={submitting} type="submit">
        {submitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </button>

      <div className="auth-form__links">
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        <span>
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate</Link>
        </span>
      </div>
    </form>
  )
}
