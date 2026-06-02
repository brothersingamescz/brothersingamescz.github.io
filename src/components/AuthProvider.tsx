import { useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { AuthContext, type AuthState } from '../hooks/useAuth'

// Single `onAuthStateChanged` listener for the whole app; the result is shared
// via AuthContext (see hooks/useAuth).
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setState({ user, loading: false }))
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
