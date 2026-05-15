import {
  createUserWithEmailAndPassword,
} from 'firebase/auth'

import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { auth } from '@/firebase/auth'
import { db } from '@/firebase/firestore'

import type {
  RegisterUserDTO,
} from '../types/register.types'

export const registerUser =
  async (data: RegisterUserDTO) => {

    const response =
      await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

    const user = response.user

    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,

        name: data.name,

        email: data.email,

        role: data.role,

        status: true,

        createdAt: serverTimestamp(),
      }
    )

    return user
  }