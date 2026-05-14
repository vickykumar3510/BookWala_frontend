import { Link } from "react-router-dom"
import SearchContext from "../contexts/SearchContext"
import { useContext } from "react"
import CartContext from "../contexts/CartContext"
import WishlistContext from "../contexts/WishlistContext"
import { toast } from "react-toastify"
import BookWalaLogo from "./BookWalaLogo"

const Header = () => {
    const { setSearchTerm } = useContext(SearchContext)
    const {cartItem} = useContext(CartContext)
    const {wishlistItem} = useContext(WishlistContext)

    const handleInput = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("authToken")
        toast.success("Logout Successfully.");
        window.location.replace("/");
    }
    return (
        <header className="site-header">
            <div className="site-header__inner">
                <div className="site-header__brand">
                    <BookWalaLogo />
                </div>
                <div className="site-header__search-wrap">
                    <label htmlFor="site-header-search" className="sr-only">Search by book or author</label>
                    <input
                        id="site-header-search"
                        className="site-header__search"
                        type="search"
                        placeholder="Search books or authors…"
                        onChange={handleInput}
                        autoComplete="off"
                    />
                </div>
                <nav className="site-header__nav" aria-label="Main">
                    <Link to="/profile" className="site-header__link">Profile</Link>
                    <Link to="/wishlist" className="site-header__link">
                        Wishlist
                        <span className="site-header__badge" aria-hidden>{wishlistItem.length}</span>
                    </Link>
                    <Link to="/cart" className="site-header__link site-header__link--cart">
                        Cart
                        <span className="site-header__badge" aria-hidden>{cartItem.length}</span>
                    </Link>
                    <button type="button" className="site-header__logout" onClick={handleLogout}>
                        Log out
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header
