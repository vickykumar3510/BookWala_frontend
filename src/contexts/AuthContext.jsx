import { createContext, useCallback, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"))

  const setToken = useCallback((next) => {
    if (next) {
      localStorage.setItem("token", next)
      setTokenState(next)
    } else {
      localStorage.removeItem("token")
      setTokenState(null)
    }
  }, [])

  const value = useMemo(() => ({ token, setToken }), [token, setToken])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export default AuthContext
