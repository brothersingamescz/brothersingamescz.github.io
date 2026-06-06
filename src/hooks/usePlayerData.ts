import { useEffect, useState } from 'react'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { dbFor } from '../lib/firestore'
import type { Game } from '../data/games'

// `undefined` = still loading, `null` = no document for this account.
export type DataState<T> = T | null | undefined

// Reads (and lets the player delete) the per-game Firestore document at
// `{game.firestoreCollection}/{uid}`. The `uid` and the target Firebase project
// come from the game's own auth session (see hooks/useGameAuth), resolved by the
// caller before this hook runs. The web app is a read-only view of save data the
// Unity game writes; `remove` only clears the web copy. Importing
// `firebase/firestore` here is what keeps that heavy module in the lazy
// game-detail chunk.
export function usePlayerData<T>(game: Game, uid: string) {
  const collection = game.firestoreCollection
  const projectKey = game.firebaseProject
  const [data, setData] = useState<DataState<T>>(undefined)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!collection) return
    let cancelled = false
    setData(undefined)
    setError(false)
    getDoc(doc(dbFor(projectKey), collection, uid))
      .then((snap) => {
        if (!cancelled) setData(snap.exists() ? (snap.data() as T) : null)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [collection, projectKey, uid])

  async function remove() {
    if (!collection) return
    await deleteDoc(doc(dbFor(projectKey), collection, uid))
    setData(null)
  }

  return { data, error, remove }
}
