import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../services/firebase'
import { getUserProfile } from '../services/auth'
import type { AuthContextValue, UserProfile } from '../types/user'

interface AuthContextState extends AuthContextValue {
  error: Error | null
}

const AuthContext = createContext<AuthContextState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    let revision = 0

    const unsubscribe = onAuthStateChanged(
      auth,
      async (nextUser) => {
        const currentRevision = ++revision
        setUser(nextUser)
        setProfile(null)
        setError(null)
        setLoading(true)

        if (!nextUser) {
          setLoading(false)
          return
        }

        try {
          const nextProfile = await getUserProfile(nextUser.uid)
          if (!active || currentRevision !== revision) return
          setProfile(nextProfile)
        } catch (cause) {
          if (!active || currentRevision !== revision) return
          setError(
            cause instanceof Error
              ? cause
              : new Error('No se pudo cargar el perfil.'),
          )
        } finally {
          if (active && currentRevision === revision) setLoading(false)
        }
      },
      (cause) => {
        if (!active) return
        setUser(null)
        setProfile(null)
        setError(cause)
        setLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('No hay una sesión activa.')

    const nextProfile = await getUserProfile(currentUser.uid)
    if (auth.currentUser?.uid !== currentUser.uid) return
    setProfile(nextProfile)
    setError(null)
  }, [])

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: user !== null,
      refreshProfile,
      error,
    }),
    [user, profile, loading, refreshProfile, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  }
  return context
}
