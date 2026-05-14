import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import BookWalaLogo from "./components/BookWalaLogo.jsx"

const App = () => {
  const [formData, setFormData] = useState({ userEmail: "", userPassword: "" })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("token", data.token) 
        toast.success("Login successful!")
        navigate("/dashboard") 
      } else {
        toast.error(data.error || "Invalid credentials")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <main className="auth">
      <div className="auth__panel">
        <div className="auth__brand-wrap">
          <BookWalaLogo variant="auth" />
        </div>
        <p className="auth__tagline">Welcome back</p>
        <h2 className="auth__title">Login</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <label htmlFor="login-email" className="auth__label">Email</label>
          <input
            id="login-email"
            className="auth__input"
            type="email"
            name="userEmail"
            placeholder="Email"
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <label htmlFor="login-password" className="auth__label">Password</label>
          <input
            id="login-password"
            className="auth__input"
            type="password"
            name="userPassword"
            placeholder="Password"
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="auth__btn auth__btn--primary">Login</button>
        </form>
        <Link className="auth__link-secondary" to="/signup">Click here for create a new account</Link>
      </div>
    </main>
  )
}

export default App
