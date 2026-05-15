import { create }
from 'zustand'

import {
  persist,
} from 'zustand/middleware'

import type { UserRole } from '@/types/roles'
interface UserProfile {
  uid: string
  name: string
  email: string
  role: UserRole
}

interface AuthStore {

  user:
    UserProfile | null

  setUser:
    (
      user: UserProfile
    ) => void

  logout:
    () => void
}

export const useAuthStore =
create<AuthStore>()(

  persist(

    (set) => ({

      user: null,

      setUser: (user) =>
        set({ user }),

      logout: () =>
        set({ user: null }),

    }),

    {
      name: 'auth-storage',
    }

  )

)