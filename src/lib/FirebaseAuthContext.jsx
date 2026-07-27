import { useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { auth } from './firebase'
import { getStoredUser, storeUser } from './authUtils'
import { AuthContext } from './AuthContext'

function getAuthErrorCode(error) {
  if (error?.code) return error.code
  const message = error?.message || ''
  const match = message.match(/\(auth\/[a-z0-9-]+\)/)
  return match ? match[0].replace(/[()]/g, '') : ''
}

function getFriendlyAuthMessage(error, fallback) {
  const code = getAuthErrorCode(error)
  const message = error?.message || ''
  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
    return 'No account found for this email. Please create an account before signing in.'
  }
  if (code === 'auth/wrong-password') {
    return 'Incorrect password. Please check your password or reset it.'
  }
  if (code === 'auth/too-many-requests' || message.includes('RESET_PASSWORD_EXCEED_LIMIT')) {
    return 'Too many password reset attempts. Please wait a few minutes before trying again.'
  }
  return error?.message || fallback
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      storeUser(firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || null
      } : null)
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  const signUp = async (email, password, displayName) => {
    const normalizedEmail = email.trim().toLowerCase()
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password.trim())

    if (displayName && userCredential.user) {
      try {
        await updateProfile(userCredential.user, { displayName })
      } catch (profileError) {
        console.warn('Profile update failed:', profileError.message)
      }
    }
    return userCredential.user
  }

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
      return user
    } catch (error) {
      throw new Error(getFriendlyAuthMessage(error, 'Unable to sign in. Please try again.'), { cause: error })
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const changePassword = async (newPassword) => {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('No user logged in')
    await updatePassword(currentUser, newPassword)
  }

  const resetPassword = async (email) => {
    const normalizedEmail = email.trim().toLowerCase()
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: false
    }

    try {
      await sendPasswordResetEmail(auth, normalizedEmail, actionCodeSettings)
    } catch (error) {
      throw new Error(getFriendlyAuthMessage(error, 'Unable to send password reset email. Please try again later.'), { cause: error })
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, changePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}
