import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '@/firebase/firestore'

import type {
  VideoTutorial,
} from '../types/video.types'

interface CreateVideoDTO {
  title: string
  description: string
  youtubeUrl: string
  createdBy: string
  createdByName: string
}

const getYoutubeEmbedUrl = (url: string) => {
  const videoId =
    url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1]

  if (!videoId) {
    throw new Error('Link de YouTube no válido')
  }

  return `https://www.youtube.com/embed/${videoId}`
}

export const createVideoTutorial = async (
  data: CreateVideoDTO,
) => {
  await addDoc(collection(db, 'video_tutorials'), {
    title: data.title.trim(),
    description: data.description.trim(),
    youtubeUrl: data.youtubeUrl.trim(),
    youtubeEmbedUrl: getYoutubeEmbedUrl(data.youtubeUrl),
    createdBy: data.createdBy,
    createdByName: data.createdByName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getVideoTutorials = async (): Promise<VideoTutorial[]> => {
  const videosQuery = query(
    collection(db, 'video_tutorials'),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(videosQuery)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as VideoTutorial[]
}