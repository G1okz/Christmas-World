import { Navigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { isAuthenticated, loading, profile } = useAuth()
  if (!loading && isAuthenticated && profile) return <Navigate to="/calendar" replace />

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section aria-labelledby="login-title" className="auth-card">
          <p className="eyebrow">Qué alegría verte</p>
          <h1 id="login-title">Inicia sesión</h1>
          <p className="auth-card__description">Entra para continuar tu aventura navideña.</p>
          <LoginForm />
        </section>
      </main>
    </>
  )
}
