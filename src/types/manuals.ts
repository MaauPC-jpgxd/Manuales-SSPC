export const ManualStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
} as const

export type ManualStatus =
  (typeof ManualStatus)[keyof typeof ManualStatus]