import { Link } from "react-router-dom"
import CartContext from "../contexts/CartContext"
import WishlistContext from "../contexts/WishlistContext"
import { useContext } from "react"
import { toast } from "react-toastify"
import BookWalaLogo from "./BookWalaLogo"

const HeaderNoSearchBar = () => {
    const {cartItem} = useContext(CartContext)
    const {wishlistItem} = useContext(WishlistContext)

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("authToken")
        toast.success("Logout Successfully.");
        window.location.replace("/");
    }

    return (
        <header className="site-header site-header--no-search">
            <div className="site-header__inner site-header__inner--no-search">
                <div className="site-header__brand">
                    <BookWalaLogo />
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

export default HeaderNoSearchBar
