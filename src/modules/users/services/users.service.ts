import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import {
  createUserWithEmailAndPassword,
} from 'firebase/auth'

import { db } from '@/firebase/firestore'
import { secondaryAuth } from '@/firebase/secondaryApp'

import type {
  SystemUser,
} from '../types/user.types'

interface CreateUserDTO {
  name: string
  email: string
  password: string
  role: SystemUser['role']
}

export const getUsers = async (): Promise<SystemUser[]> => {
  const usersQuery = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(usersQuery)

  return snapshot.docs.map((item) => {
    const data = item.data()

    return {
      uid: data.uid ?? item.id,
      name: data.name ?? '',
      email: data.email ?? '',
      role: data.role,
      status: data.status === true,
      createdAt: data.createdAt,
    }
  }) as SystemUser[]
}

export const createSystemUser = async (
  data: CreateUserDTO,
) => {
  const response =
    await createUserWithEmailAndPassword(
      secondaryAuth,
      data.email.trim().toLowerCase(),
      data.password,
    )

  const user = response.user

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    role: data.role,
    status: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  await secondaryAuth.signOut()

  return user
}

export const updateUserRole = async (
  uid: string,
  role: SystemUser['role'],
) => {
  await updateDoc(doc(db, 'users', uid), {
    role,
    updatedAt: serverTimestamp(),
  })
}

export const updateUserStatus = async (
  uid: string,
  status: boolean,
) => {
  await updateDoc(doc(db, 'users', uid), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export const updateUserName = async (
  uid: string,
  name: string,
) => {
  await updateDoc(doc(db, 'users', uid), {
    name: name.trim(),
    updatedAt: serverTimestamp(),
  })
}

export const deleteUserProfile = async (
  uid: string,
) => {
  await deleteDoc(doc(db, 'users', uid))
}