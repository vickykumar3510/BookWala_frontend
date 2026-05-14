import { Link } from "react-router-dom"

const BookWalaLogo = ({ variant = "header", to }) => {
  const isAuth = variant === "auth"
  const linkClass = isAuth ? "auth__logo" : "site-header__logo"
  const markClass = isAuth ? "auth__logo-mark" : "site-header__logo-mark"
  const svgClass = isAuth ? "auth__logo-svg" : "site-header__logo-svg"
  const textClass = isAuth ? "auth__logo-text" : "site-header__logo-text"
  const href = to ?? (isAuth ? "/" : "/dashboard")

  return (
    <Link to={href} className={linkClass} aria-label="BookWala — home">
      <span className={markClass} aria-hidden="true">
        <svg
          className={svgClass}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={textClass}>BookWala</span>
    </Link>
  )
}

export default BookWalaLogo
