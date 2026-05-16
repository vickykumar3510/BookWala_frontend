import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"

const ProtectedRoute = () => {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
