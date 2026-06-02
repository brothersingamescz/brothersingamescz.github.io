import { useEffect, useState } from 'react'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firestore'
import { useAuth } from './useAuth'

// `undefined` = still loading, `null` = no document for this account.
export type DataState<T> = T | null | undefined

// Reads (and lets the player delete) the per-game Firestore document at
// `{collection}/{uid}`. The web app is a read-only view of save data the Unity
// game writes; `remove` only clears the web copy. Importing `firebase/firestore`
// here is what keeps that heavy module in the lazy game-detail chunk.
export function usePlayerData<T>(collection: string) {
  const { user } = useAuth()
  const [data, setData] = useState<DataState<T>>(undefined)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!user) {
      setData(undefined)
      setError(false)
      return
    }
    let cancelled = false
    setData(undefined)
    setError(false)
    getDoc(doc(db, collection, user.uid))
      .then((snap) => {
        if (!cancelled) setData(snap.exists() ? (snap.data() as T) : null)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [user, collection])

  async function remove() {
    if (!user) return
    await deleteDoc(doc(db, collection, user.uid))
    setData(null)
  }

  return { data, error, remove }
}
