import { Navigate } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { isAuthenticated, loading, profile } = useAuth()
  if (!loading && isAuthenticated && profile) return <Navigate to="/calendar" replace />

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section aria-labelledby="register-title" className="auth-card">
          <p className="eyebrow">Tu aventura empieza aquí</p>
          <h1 id="register-title">Crea tu cuenta</h1>
          <p className="auth-card__description">Prepara tu nickname y únete a Christmas World.</p>
          <RegisterForm />
        </section>
      </main>
    </>
  )
}
