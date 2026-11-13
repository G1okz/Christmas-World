import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import type {
  LoginCredentials,
  RegisterCredentials,
  UserProfile,
} from '../types/user'

const nicknamePattern = /^[a-z0-9_]{3,20}$/
export const passwordResetConfirmationMessage =
  'Si el correo está asociado a una cuenta, recibirás un enlace para restablecer la contraseña.'

export class NicknameTakenError extends Error {
  constructor() {
    super('Ese nickname ya está en uso.')
    this.name = 'NicknameTakenError'
  }
}

export class RegistrationRollbackError extends Error {
  constructor() {
    super('No se pudo completar el registro ni limpiar la cuenta temporal. Contacta con soporte antes de volver a registrarte.')
    this.name = 'RegistrationRollbackError'
  }
}

export function normalizeNickname(nickname: string): string {
  return nickname.trim().toLowerCase()
}

export function isValidNickname(nickname: string): boolean {
  return nicknamePattern.test(normalizeNickname(nickname))
}

function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== 'object' || value === null) return false

  const profile = value as Record<string, unknown>
  return (
    typeof profile.uid === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.nickname === 'string' &&
    typeof profile.nicknameNormalized === 'string' &&
    profile.nickname === profile.nicknameNormalized &&
    profile.createdAt instanceof Timestamp &&
    typeof profile.totalPoints === 'number' &&
    Number.isSafeInteger(profile.totalPoints) &&
    profile.totalPoints >= 0
  )
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', uid))
  if (!snapshot.exists()) return null

  const data: unknown = snapshot.data()
  if (!isUserProfile(data) || data.uid !== uid) {
    throw new Error('El perfil de usuario tiene un formato no válido.')
  }

  return data
}

async function createUserDocuments(
  user: User,
  email: string,
  nickname: string,
): Promise<void> {
  const nicknameNormalized = normalizeNickname(nickname)
  const nicknameRef = doc(db, 'nicknames', nicknameNormalized)
  const userRef = doc(db, 'users', user.uid)
  const progressRef = doc(db, 'userProgress', user.uid)

  await runTransaction(db, async (transaction) => {
    const [nicknameSnapshot, userSnapshot, progressSnapshot] =
      await Promise.all([
        transaction.get(nicknameRef),
        transaction.get(userRef),
        transaction.get(progressRef),
      ])

    if (nicknameSnapshot.exists()) throw new NicknameTakenError()
    if (userSnapshot.exists() || progressSnapshot.exists()) {
      throw new Error('La cuenta ya tiene datos inicializados.')
    }

    const reservation = { createdAt: serverTimestamp() }
    const profile = {
      uid: user.uid,
      email,
      nickname: nicknameNormalized,
      nicknameNormalized,
      createdAt: serverTimestamp(),
      totalPoints: 0,
    }
    const progress = {
      openedAdventDays: [],
      completedChallenges: [],
      quizStats: {
        gamesPlayed: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        bestScore: 0,
      },
      updatedAt: serverTimestamp(),
    }

    transaction.set(nicknameRef, reservation)
    transaction.set(userRef, profile)
    transaction.set(progressRef, progress)
  })
}

export async function register(credentials: RegisterCredentials): Promise<User> {
  const nickname = normalizeNickname(credentials.nickname)
  if (!isValidNickname(nickname)) {
    throw new Error('El nickname debe tener entre 3 y 20 caracteres: letras, números o guion bajo.')
  }

  const email = credentials.email.trim().toLowerCase()
  const { user } = await createUserWithEmailAndPassword(
    auth,
    email,
    credentials.password,
  )

  try {
    await createUserDocuments(user, email, nickname)
  } catch (error) {
    try {
      await deleteUser(user)
    } catch {
      throw new RegistrationRollbackError()
    }
    throw error
  }

  return user
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const { user } = await signInWithEmailAndPassword(
    auth,
    credentials.email.trim().toLowerCase(),
    credentials.password,
  )
  return user
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase())
}

export function getAuthErrorMessage(
  error: unknown,
  action: 'register' | 'login' | 'reset' | 'logout',
): string {
  if (error instanceof NicknameTakenError) return error.message
  if (error instanceof RegistrationRollbackError) return error.message

  if (error instanceof FirebaseError) {
    if (error.code === 'auth/network-request-failed') {
      return 'No se pudo conectar con Firebase. Comprueba tu conexión e inténtalo de nuevo.'
    }

    if (action === 'register' && error.code === 'auth/email-already-in-use') {
      return 'No se pudo crear la cuenta con esos datos.'
    }

    if (
      action === 'register' &&
      (error.code === 'auth/weak-password' ||
        error.code === 'auth/invalid-email')
    ) {
      return 'Revisa el correo electrónico y la contraseña e inténtalo de nuevo.'
    }
  }

  if (action === 'login') {
    return 'No se pudo iniciar sesión. Revisa el correo y la contraseña e inténtalo de nuevo.'
  }
  if (action === 'reset') {
    return 'No se pudo tramitar la solicitud. Inténtalo de nuevo más tarde.'
  }
  if (action === 'logout') {
    return 'No se pudo cerrar la sesión. Inténtalo de nuevo.'
  }
  return 'No se pudo completar el registro. Inténtalo de nuevo.'
}
