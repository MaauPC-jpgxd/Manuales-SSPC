import {
  signInWithEmailAndPassword,
} from 'firebase/auth'

import {
  doc,
  getDoc,
} from 'firebase/firestore'

import { auth }
from '@/firebase/auth'

import { db }
from '@/firebase/firestore'

export const loginUser =
async (
  email: string,
  password: string,
) => {

  const response =
    await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )

  const firebaseUser =
    response.user

  const userDoc =
    await getDoc(
      doc(
        db,
        'users',
        firebaseUser.uid,
      )
    )

  if (!userDoc.exists()) {
    throw new Error(
      'Usuario no autorizado'
    )
  }

  const profile =
    userDoc.data()

  if (profile.status !== true) {
    throw new Error(
      'Tu cuenta está desactivada'
    )
  }

  return {
    firebaseUser,
    profile,
  }
}