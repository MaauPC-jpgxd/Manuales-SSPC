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

interface CreateManualDTO {
  title: string
priority: 'ALTA' | 'MEDIA' | 'BAJA'
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
  await addDoc(collection(db, 'manuals'), {
    title: data.title.trim(),
    normalizedTitle: normalizeTitle(data.title),
    priority: data.priority,
    fileUrl: data.fileUrl,
    publicId: data.publicId,
    uploadedBy: data.uploadedBy,
    uploadedByName: data.uploadedByName,
    status: ManualStatus.PENDING,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
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
) => {
  await updateDoc(doc(db, 'manuals', manualId), {
    status: ManualStatus.REJECTED,
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