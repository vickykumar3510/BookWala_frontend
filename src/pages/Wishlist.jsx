import Header from "../components/Header"
import Footer from "../components/Footer"
import WishlistContext from "../contexts/WishlistContext"
import { useContext } from "react"
import CartContext from "../contexts/CartContext"
import SearchContext from "../contexts/SearchContext"

const Wishlist = () => {
    const {searchTerm, setSearchTerm} = useContext(SearchContext)
    const {wishlistItem, setWishlistItem, removeFromWishlist, totalPriceWishlist} = useContext(WishlistContext)
    const { addToCart } = useContext(CartContext)

    const search = searchTerm?.toLowerCase() || ""

    const filteredWishlist = wishlistItem.filter((b) =>
        b.bookAuthor.toLowerCase().includes(search) ||
        b.bookName.toLowerCase().includes(search)
    )
    return (
        <>
        <Header />
        <main className="wishlist">
        <div className="wishlist__intro">
        <h1 className="wishlist__title">Wishlist Page</h1>
        <div className="wishlist__stats">
        <p className="wishlist__stat">Total Wishlist Items: {wishlistItem.length}</p>
        <p className="wishlist__stat">Total Price: Rs. {totalPriceWishlist}</p>
        </div>
        </div>

        {filteredWishlist.length > 0 ? (
            <div className="wishlist__grid">
            {filteredWishlist.map((b) => (
                <article key={b._id} className="wishlist__card">
                    <div className="wishlist__card-media">
                    <img src={b.bookImage} alt={b.bookName} />
                    </div>
                    <div className="wishlist__card-body">
                    <h3 className="wishlist__card-title">{b.bookName}</h3>
                    <p className="wishlist__card-author">{b.bookAuthor}</p>
                    <p className="wishlist__card-rating">★ {b.bookRating}</p>
                    <p className="wishlist__card-price">Rs. {b.bookPrice}</p>
                    <div className="wishlist__card-actions">
                    <button type="button" className="wishlist__btn wishlist__btn--primary" onClick={() => addToCart(b)}>Add to Cart</button>
                    <button type="button" className="wishlist__btn wishlist__btn--outline" onClick={() => removeFromWishlist(b)}>Remove</button>
                    </div>
                    </div>
                </article>
            ))}
            </div>

        ) : (<p className="wishlist__empty"> No items in wishlist.</p>)}

        </main>
        <Footer />
        </>
    )
}

export default Wishlist
