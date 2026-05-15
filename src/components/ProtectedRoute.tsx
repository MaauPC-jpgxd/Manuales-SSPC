import {
  Navigate,
} from 'react-router-dom'

import type {
  ReactNode,
} from 'react'

import {
  useAuthStore,
} from '@/modules/auth/store/auth.store'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({
  children,
}: Props) {

  const user =
    useAuthStore(
      (state) => state.user
    )

  if (!user) {
    return <Navigate to="/" />
  }

  return children
}