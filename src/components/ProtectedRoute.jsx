import { Navigate, Outlet } from "react-router-dom"

/** Must match the key used after login in `App.jsx` (`localStorage.setItem("token", …)`). */
const ProtectedRoute = () => {
  const token = localStorage.getItem("token")
  return token ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
