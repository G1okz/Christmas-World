import type { User } from 'firebase/auth'
import type { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string
  nickname: string
  nicknameNormalized: string
  createdAt: Timestamp
  totalPoints: number
}

export interface NicknameReservation {
  createdAt: Timestamp
}

export interface UserProgress {
  openedAdventDays: number[]
  completedChallenges: string[]
  quizStats: {
    gamesPlayed: number
    correctAnswers: number
    totalAnswers: number
    bestScore: number
  }
  updatedAt: Timestamp
}

export interface RegisterCredentials {
  nickname: string
  email: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  refreshProfile: () => Promise<void>
}
