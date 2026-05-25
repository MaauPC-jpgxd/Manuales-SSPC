import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '@/firebase/firestore'
import { ManualStatus } from '@/types/manuals'

import type {
  Manual,
} from '../types/manual.types'

import type {
  ManualPriority,
} from '../types/manual.types'
import {
  deleteDoc,
} from 'firebase/firestore'

interface CreateManualDTO {
  title: string

  priority:
    'ALTA' |
    'MEDIA' |
    'BAJA'

  category:
    'MANUAL' |
    'INVENTARIO' |
    'TICKETS'

  startDate?: string

  endDate?: string

  fileUrl: string

  publicId: string

  uploadedBy: string

  uploadedByName: string
}
const normalizeTitle = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')

export const createManualForReview = async (
  data: CreateManualDTO,
) => {

  const shouldGoToReview =
    data.category === 'MANUAL'

  await addDoc(
    collection(db, 'manuals'),
    {
      title:
        data.title.trim(),

      normalizedTitle:
        normalizeTitle(data.title),

      priority:
        data.priority,

      category:
        data.category,

      startDate:
        data.startDate ?? null,

      endDate:
        data.endDate ?? null,

      fileUrl:
        data.fileUrl,

      publicId:
        data.publicId,

      uploadedBy:
        data.uploadedBy,

      uploadedByName:
        data.uploadedByName,

      status:
        shouldGoToReview
          ? ManualStatus.PENDING
          : ManualStatus.APPROVED,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    },
  )
}

export const getPendingManuals = async (): Promise<Manual[]> => {
  const manualsQuery = query(
    collection(db, 'manuals'),
    where('status', '==', ManualStatus.PENDING),
  )

  const snapshot = await getDocs(manualsQuery)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Manual[]
}

export const getApprovedManuals = async (): Promise<Manual[]> => {
  const manualsQuery = query(
    collection(db, 'manuals'),
    where('status', '==', ManualStatus.APPROVED),
  )

  const snapshot = await getDocs(manualsQuery)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Manual[]
}

export const approveManual = async (
  manual: Manual,
  rootUid: string,
) => {
  const approvedQuery = query(
    collection(db, 'manuals'),
    where('normalizedTitle', '==', manual.normalizedTitle),
    where('status', '==', ManualStatus.APPROVED),
  )

  const approvedSnapshot = await getDocs(approvedQuery)

  for (const oldManual of approvedSnapshot.docs) {
    await updateDoc(doc(db, 'manuals', oldManual.id), {
      status: ManualStatus.ARCHIVED,
      archivedAt: serverTimestamp(),
      replacedBy: manual.id,
      updatedAt: serverTimestamp(),
    })
  }

  await updateDoc(doc(db, 'manuals', manual.id), {
    status: ManualStatus.APPROVED,
    approvedBy: rootUid,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    oldPublicId:
      approvedSnapshot.docs[0]?.data().publicId ?? null,
  })
}

export const rejectManual = async (
  manualId: string,
  rejectionReason: string,
) => {
  await updateDoc(doc(db, 'manuals', manualId), {
    status: ManualStatus.REJECTED,
    rejectionReason,
    rejectedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
export const updateManualPriority = async (
  manualId: string,
  priority: ManualPriority,
) => {
  await updateDoc(doc(db, 'manuals', manualId), {
    priority,
    updatedAt: serverTimestamp(),
  })
}
export const getRejectedManuals = async (): Promise<Manual[]> => {
  const rejectedQuery = query(
    collection(db, 'manuals'),
    where('status', '==', ManualStatus.REJECTED),
  )

  const snapshot = await getDocs(rejectedQuery)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Manual[]
}

export const restoreRejectedManual = async (
  manualId: string,
) => {
  await updateDoc(doc(db, 'manuals', manualId), {
    status: ManualStatus.PENDING,
    updatedAt: serverTimestamp(),
  })
}

export const deleteManual = async (
  manualId: string,
) => {
  await deleteDoc(doc(db, 'manuals', manualId))
}