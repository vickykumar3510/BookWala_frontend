import { useState } from "react"
import { Link } from "react-router-dom"
import BookWalaLogo from "../components/BookWalaLogo.jsx"
import { toast } from "react-toastify"

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userPhoneNumber: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const phoneDigits = String(formData.userPhoneNumber).replace(/\D/g, "")
    if (phoneDigits.length !== 10) {
      toast.error("Phone number is incorrect. It should be 10 digits.")
      return
    }
    const payload = { ...formData, userPhoneNumber: phoneDigits }
    try {
      const response = await fetch("https://book-wala-backend.vercel.app/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("User registered successfully!")
      } else {
        alert(data.error || "Error registering user")
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
        <p className="auth__tagline">Create your account</p>
        <h2 className="auth__title">Sign Up</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <label htmlFor="signup-name" className="auth__label">Name</label>
          <input
            id="signup-name"
            className="auth__input"
            type="text"
            name="userName"
            placeholder="Name"
            onChange={handleChange}
            required
            autoComplete="name"
          />
          <label htmlFor="signup-email" className="auth__label">Email</label>
          <input
            id="signup-email"
            className="auth__input"
            type="email"
            name="userEmail"
            placeholder="Email"
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <label htmlFor="signup-password" className="auth__label">Password</label>
          <input
            id="signup-password"
            className="auth__input"
            type="password"
            name="userPassword"
            placeholder="Password"
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <label htmlFor="signup-phone" className="auth__label">Phone Number</label>
          <input
            id="signup-phone"
            className="auth__input"
            type="text"
            name="userPhoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            autoComplete="tel"
          />
          <button type="submit" className="auth__btn auth__btn--primary">Register</button>
        </form>
        <div className="auth__switch">
          <p className="auth__switch-text">Already have account</p>
          <Link className="auth__link-secondary" to="/">Login Page</Link>
        </div>
      </div>
    </main>
  )
}

export default SignUp
