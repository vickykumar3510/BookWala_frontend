import HeaderNoSearchBar from "../components/HeadeNoSearchBar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import useFetch from "../../useFetch";
import CartContext from "../contexts/CartContext";
import { useContext } from "react";
import WishlistContext from "../contexts/WishlistContext";

import { API_BASE_URL } from "../config/api.js";

const BookDetails = () => {
    const { cartItem, addToCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);
    const { data, loading, error } = useFetch(`${API_BASE_URL}/book`);
    const { bookID } = useParams();
    const clickedBook = data?.find((b) => b._id === bookID);

    const inCart = clickedBook ? cartItem.find((b) => b._id === clickedBook._id) : undefined;

    const genreText = clickedBook
        ? Array.isArray(clickedBook.bookGenre)
            ? clickedBook.bookGenre.join(', ')
            : clickedBook.bookGenre
        : '';

    return (
        <>
            <HeaderNoSearchBar />
            <main className="book-detail">
                {loading && (
                    <div className="book-detail__loading" role="status" aria-live="polite">
                        <span className="book-detail__spinner" aria-hidden />
                        <span>Loading…</span>
                    </div>
                )}
                {error && (
                    <p className="book-detail__error" role="alert">Error while loading the data.</p>
                )}
                {!loading && !error && clickedBook && (
                    <div className="book-detail__layout">
                        <div className="book-detail__media">
                            <img src={clickedBook.bookImage} alt={clickedBook.bookName} />
                            <p className="book-detail__price">Rs. {clickedBook.bookPrice}</p>
                            <p className="book-detail__rating">Rating: ⭐ {clickedBook.bookRating}</p>
                        </div>
                        <div className="book-detail__content">
                            <h1 className="book-detail__title">{clickedBook.bookName}</h1>
                            <p className="book-detail__author">by {clickedBook.bookAuthor}</p>
                            {genreText ? (
                                <p className="book-detail__genre"><span className="book-detail__label">Genre</span> {genreText}</p>
                            ) : null}
                            <h2 className="book-detail__section-title">Description</h2>
                            <p className="book-detail__description">{clickedBook.bookDescription}</p>

                            <div className="book-detail__actions">
                                {inCart ? (
                                    <div className="book-detail__qty" aria-label="Quantity in cart">
                                        <button type="button" className="book-detail__qty-btn" onClick={() => decreaseQuantity(clickedBook._id)} aria-label="Decrease quantity">−</button>
                                        <span className="book-detail__qty-value">{inCart.quantity}</span>
                                        <button type="button" className="book-detail__qty-btn" onClick={() => increaseQuantity(clickedBook._id)} aria-label="Increase quantity">+</button>
                                    </div>
                                ) : (
                                    <button type="button" className="book-detail__btn book-detail__btn--primary" onClick={() => addToCart(clickedBook)}>Add to Cart</button>
                                )}
                                <button type="button" className="book-detail__btn book-detail__btn--secondary" onClick={() => addToWishlist(clickedBook)}>Add Wishlist</button>
                            </div>
                        </div>
                    </div>
                )}
                {!loading && !error && !clickedBook && Array.isArray(data) && (
                    <p className="book-detail__not-found">Book not found.</p>
                )}
            </main>
            <Footer />
        </>
    );
};

export default BookDetails;
