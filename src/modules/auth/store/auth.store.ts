import { create } from 'zustand'

import {
  persist,
} from 'zustand/middleware'

import type {
  UserRole,
} from '@/types/roles'

interface UserProfile {
  uid: string
  name: string
  email: string
  role: UserRole
}

interface AuthStore {
  user:
    UserProfile | null

  previewRole:
    UserRole | null

  setUser:
    (
      user: UserProfile,
    ) => void

  setPreviewRole:
    (
      role: UserRole | null,
    ) => void

  logout:
    () => void
}

export const useAuthStore =
create<AuthStore>()(

  persist(

    (set) => ({

      user: null,

      previewRole: null,

      setUser: (user) =>
        set({
          user,
        }),

      setPreviewRole: (role) =>
        set({
          previewRole: role,
        }),

      logout: () =>
        set({
          user: null,
          previewRole: null,
        }),

    }),

    {
      name: 'auth-storage',
    },

  ),

)