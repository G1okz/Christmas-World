import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  getAuthErrorMessage,
  isValidNickname,
  NicknameTakenError,
  register,
} from '../../services/auth'
import type { RegisterCredentials } from '../../types/user'

interface RegisterFields extends RegisterCredentials {
  confirmPassword: string
}

interface RegisterErrors {
  nickname?: string
  email?: string
  password?: string
  confirmPassword?: string
  form?: string
}

const initialFields: RegisterFields = {
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterForm() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [fields, setFields] = useState<RegisterFields>(initialFields)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): RegisterErrors {
    const nextErrors: RegisterErrors = {}
    if (!isValidNickname(fields.nickname)) {
      nextErrors.nickname = 'Usa entre 3 y 20 letras, números o guiones bajos.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      nextErrors.email = 'Introduce un correo electrónico válido.'
    }
    if (fields.password.length < 8) {
      nextErrors.password = 'La contraseña debe tener al menos 8 caracteres.'
    }
    if (fields.confirmPassword !== fields.password) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }
    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await register(fields)
      await refreshProfile()
      navigate('/calendar', { replace: true })
    } catch (cause) {
      const message = getAuthErrorMessage(cause, 'register')
      setErrors(
        cause instanceof NicknameTakenError
          ? { nickname: message }
          : { form: message }
      )
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(field: keyof RegisterFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="register-nickname">Nickname</label>
      <input
        autoComplete="nickname"
        aria-describedby={errors.nickname ? 'register-nickname-error' : undefined}
        aria-invalid={Boolean(errors.nickname)}
        id="register-nickname"
        maxLength={20}
        name="nickname"
        onChange={(event) => updateField('nickname', event.target.value)}
        required
        type="text"
        value={fields.nickname}
      />
      {errors.nickname && (
        <p className="field-error" id="register-nickname-error">
          {errors.nickname}
        </p>
      )}

      <label htmlFor="register-email">Correo electrónico</label>
      <input
        autoComplete="email"
        aria-describedby={errors.email ? 'register-email-error' : undefined}
        aria-invalid={Boolean(errors.email)}
        id="register-email"
        name="email"
        onChange={(event) => updateField('email', event.target.value)}
        required
        type="email"
        value={fields.email}
      />
      {errors.email && (
        <p className="field-error" id="register-email-error">
          {errors.email}
        </p>
      )}

      <label htmlFor="register-password">Contraseña</label>
      <input
        autoComplete="new-password"
        aria-describedby={errors.password ? 'register-password-error' : undefined}
        aria-invalid={Boolean(errors.password)}
        id="register-password"
        minLength={8}
        name="password"
        onChange={(event) => updateField('password', event.target.value)}
        required
        type="password"
        value={fields.password}
      />
      {errors.password && (
        <p className="field-error" id="register-password-error">
          {errors.password}
        </p>
      )}

      <label htmlFor="register-confirm-password">Confirmar contraseña</label>
      <input
        autoComplete="new-password"
        aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
        aria-invalid={Boolean(errors.confirmPassword)}
        id="register-confirm-password"
        name="confirmPassword"
        onChange={(event) => updateField('confirmPassword', event.target.value)}
        required
        type="password"
        value={fields.confirmPassword}
      />
      {errors.confirmPassword && (
        <p className="field-error" id="register-confirm-password-error">
          {errors.confirmPassword}
        </p>
      )}

      {errors.form && (
        <p className="form-message form-message--error" role="alert">
          {errors.form}
        </p>
      )}

      <button className="button button--primary" disabled={submitting} type="submit">
        {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
      <p className="auth-form__footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  )
}
