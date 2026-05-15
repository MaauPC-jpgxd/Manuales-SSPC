export const UserRole = {
  ROOT: 'ROOT',
  ADMIN: 'ADMIN',
  LECTOR: 'LECTOR',
} as const

export type UserRole =
  (typeof UserRole)[keyof typeof UserRole]