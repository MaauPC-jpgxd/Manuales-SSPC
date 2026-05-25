export type ManualPriority =
  'ALTA' |
  'MEDIA' |
  'BAJA'

export type DocumentCategory =
  'MANUAL' |
  'INVENTARIO' |
  'TICKETS'

export interface Manual {
  id: string
  title: string
  normalizedTitle: string
  fileUrl: string
  publicId: string
  uploadedBy: string
  uploadedByName: string
  status: string
  category?: DocumentCategory
  priority?: ManualPriority
  startDate?: string
  endDate?: string
  createdAt?: unknown
  approvedAt?: unknown
  approvedBy?: string
  archivedAt?: unknown
  replacedBy?: string
  oldPublicId?: string
  rejectionReason?: string
}