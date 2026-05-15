import type { UserRole } from '@/types/roles'

export interface SystemUser {
  uid: string
  name: string
  email: string
  role: UserRole
  status: boolean
  createdAt?: unknown
}