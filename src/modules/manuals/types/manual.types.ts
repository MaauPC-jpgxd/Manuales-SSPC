export type ManualPriority =
  'ALTA' |
  'MEDIA' |
  'BAJA'

export interface Manual {
  id: string
  title: string
  normalizedTitle: string
  fileUrl: string
  publicId: string
  uploadedBy: string
  uploadedByName: string
  status: string
  priority?: ManualPriority
  createdAt?: unknown
  approvedAt?: unknown
  approvedBy?: string
  archivedAt?: unknown
  replacedBy?: string
  oldPublicId?: string
}