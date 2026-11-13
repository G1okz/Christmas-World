import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import Navbar from '../components/layout/Navbar'
import {
  getAuthErrorMessage,
  passwordResetConfirmationMessage,
  sendPasswordReset,
} from '../services/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      await sendPasswordReset(email)
      setMessage(passwordResetConfirmationMessage)
    } catch (cause) {
      if (cause instanceof FirebaseError && cause.code === 'auth/user-not-found') {
        setMessage(passwordResetConfirmationMessage)
      } else {
        setError(getAuthErrorMessage(cause, 'reset'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section aria-labelledby="reset-title" className="auth-card">
          <p className="eyebrow">Recupera el acceso</p>
          <h1 id="reset-title">Restablece tu contraseña</h1>
          <p className="auth-card__description">Te enviaremos instrucciones al correo asociado a tu cuenta.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="reset-email">Correo electrónico</label>
            <input
              autoComplete="email"
              id="reset-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
            {message && <p className="form-message form-message--success" role="status">{message}</p>}
            {error && <p className="form-message form-message--error" role="alert">{error}</p>}
            <button className="button button--primary" disabled={submitting} type="submit">
              {submitting ? 'Enviando…' : 'Enviar instrucciones'}
            </button>
            <p className="auth-form__footer"><Link to="/login">Volver a iniciar sesión</Link></p>
          </form>
        </section>
      </main>
    </>
  )
}
