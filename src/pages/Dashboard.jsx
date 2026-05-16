import Header from "../components/Header";
import Footer from "../components/Footer";
import useFetch from "../../useFetch";
import SearchContext from "../contexts/SearchContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CartContext from "../contexts/CartContext";
import WishlistContext from "../contexts/WishlistContext";
import { API_BASE_URL } from "../config/api.js";

const GENRES = [
  { label: "All Genre", value: "" },
  { label: "Fantasy", value: "Fantasy" },
  { label: "Mystery", value: "Mystery" },
  { label: "Thriller", value: "Thriller" },
  { label: "Non-Fiction", value: "Non-Fiction" },
  { label: "History", value: "History" },
  { label: "Romance", value: "Romance" },
  { label: "Fiction", value: "Fiction" },
  { label: "Science Fiction", value: "Science Fiction" },
  { label: "Biography", value: "Biography" },
  { label: "Children", value: "Children" },
];

const Dashboard = () => {
    const {data, loading, error} = useFetch(`${API_BASE_URL}/book`)
    const {cartItem, addToCart, increaseQuantity, decreaseQuantity} = useContext(CartContext)
    const [priceSort, setPriceSort] = useState('none')
    const [ratingFilter, setRatingFilter] = useState(['all'])
    const {addToWishlist} = useContext(WishlistContext)
    const { searchTerm } = useContext(SearchContext)
    const [selectedGenre, setSelectedGenre] = useState('')

    const filtered = data?.filter((b) => {
  const matchesSearch =
    b.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookName.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesGenre = selectedGenre
    ? Array.isArray(b.bookGenre)
      ? b.bookGenre.map(g => g.toLowerCase()).includes(selectedGenre.toLowerCase())
      : b.bookGenre.toLowerCase().split(",").map(g => g.trim()).includes(selectedGenre.toLowerCase())
    : true;

  const matchesRating = ratingFilter.includes('all') ? true : (
    (ratingFilter.includes('above9') && b.bookRating > 9) ||
    (ratingFilter.includes('above7') && b.bookRating > 7) ||
    (ratingFilter.includes('5AndBelow') && b.bookRating <= 5)
  );

  return matchesSearch && matchesGenre && matchesRating;
});

  const handleGenreClick = (genre) => {
        setSelectedGenre(genre)
    }

    const sortedBooks = filtered? [...filtered].sort((a, b) => {
      if(priceSort === 'low'){
        return a.bookPrice - b.bookPrice
      } else if (priceSort === 'high') {
        return b.bookPrice - a.bookPrice
      } else {
        return 0
      }
    }) : []

    const handleRatingChange = (filter) => {
      setRatingFilter((prev) => {
        if (prev.includes(filter)) {
          return prev.filter(f => f !== filter); 
        } else {
          return [...prev.filter(f => f !== 'all'), filter]; 
        }
      });
    };

    const clearFilters = () => {
      setPriceSort('none')
      setSelectedGenre('')
      setRatingFilter(['all']);
    }
    return (
        <>
        <Header />
        <main className="dashboard">
        {loading && (
          <div className="dashboard__loading" role="status" aria-live="polite">
            <span className="dashboard__spinner" aria-hidden />
            <span>Loading catalogue…</span>
          </div>
        )}
        {error && (
          <p className="dashboard__state dashboard__state--error" role="alert">
            Something went wrong while loading books. Please try again later.
          </p>
        )}
        {!loading && !error && (
        <div className="dashboard__layout">
            <aside className="dashboard__sidebar" aria-label="Filters">
              <div className="dashboard__panel">
                <p className="dashboard__panel-title">Refine results</p>
                <div className="dashboard__panel-actions">
                  <button type="button" className="dashboard__btn dashboard__btn--ghost" onClick={clearFilters}>
                    Clear all filters
                  </button>
                </div>

                <div className="dashboard__filter-block">
                  <span className="dashboard__filter-label">Sort by price</span>
                  <label className="dashboard__filter-option">
                    <input name="priceSort" onChange={() => setPriceSort('low')} checked={priceSort === "low"} type="radio" />
                    Low to high
                  </label>
                  <label className="dashboard__filter-option">
                    <input name="priceSort" onChange={() => setPriceSort('high')} checked={priceSort === "high"} type="radio" />
                    High to low
                  </label>
                </div>

                <div className="dashboard__filter-block">
                  <span className="dashboard__filter-label">Rating</span>
                  <label className="dashboard__filter-option">
                    <input
                      type="checkbox"
                      checked={ratingFilter.includes('all')}
                      onChange={() => handleRatingChange('all')}
                    />
                    All ratings
                  </label>
                  <label className="dashboard__filter-option">
                    <input
                      type="checkbox"
                      checked={ratingFilter.includes('above9')}
                      onChange={() => handleRatingChange('above9')}
                    />
                    Above 9
                  </label>
                  <label className="dashboard__filter-option">
                    <input
                      type="checkbox"
                      checked={ratingFilter.includes('above7')}
                      onChange={() => handleRatingChange('above7')}
                    />
                    Above 7
                  </label>
                  <label className="dashboard__filter-option">
                    <input
                      type="checkbox"
                      checked={ratingFilter.includes('5AndBelow')}
                      onChange={() => handleRatingChange('5AndBelow')}
                    />
                    5 and below
                  </label>
                </div>
              </div>
            </aside>

            <div className="dashboard__main">
              <div className="dashboard__toolbar">
                <div className="dashboard__toolbar-head">
                  <h1 className="dashboard__title">Browse books</h1>
                  <span className="dashboard__count">{sortedBooks?.length ?? 0} Book(s)</span>
                </div>
                <div className="dashboard__genres" role="toolbar" aria-label="Genres">
                  {GENRES.map(({ label, value }) => (
                    <button
                      key={label}
                      type="button"
                      className={
                        selectedGenre === value
                          ? "dashboard__chip dashboard__chip--active"
                          : "dashboard__chip"
                      }
                      onClick={() => handleGenreClick(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {sortedBooks && sortedBooks.length > 0 ? (
                <div className="dashboard__grid">
                  {sortedBooks.map((book) => {
                    const inCart = cartItem.find((b) => b._id === book._id);
                    const genreText = Array.isArray(book.bookGenre)
                      ? book.bookGenre.join(", ")
                      : book.bookGenre;

                    return (
                      <article key={book._id} className="dashboard__card">
                        <div className="dashboard__card-media">
                          <img src={book.bookImage} alt="" />
                          <span className="dashboard__card-rating">★ {book.bookRating}</span>
                        </div>
                        <div className="dashboard__card-body">
                          <h3 className="dashboard__card-title">{book.bookName}</h3>
                          <p className="dashboard__card-author">{book.bookAuthor}</p>
                          {genreText ? (
                            <p className="dashboard__card-genre">{genreText}</p>
                          ) : null}
                          <p className="dashboard__card-price">Rs. {book.bookPrice}</p>
                          <div className="dashboard__card-actions">
                            {inCart ? (
                              <div className="dashboard__qty" aria-label="Quantity in cart">
                                <button type="button" onClick={() => decreaseQuantity(book._id)} aria-label="Decrease quantity">−</button>
                                <span>{inCart.quantity}</span>
                                <button type="button" onClick={() => increaseQuantity(book._id)} aria-label="Increase quantity">+</button>
                              </div>
                            ) : (
                              <button type="button" className="dashboard__btn dashboard__btn--primary" onClick={() => addToCart(book)}>
                                Add to cart
                              </button>
                            )}
                            <button type="button" className="dashboard__btn dashboard__btn--secondary" onClick={() => addToWishlist(book)}>
                              Add to wishlist
                            </button>
                            <Link className="dashboard__link" to={`/bookdetail/${book._id}`}>
                              View details
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="dashboard__empty">No books match your filters or search. Try adjusting filters or search terms.</p>
              )}
            </div>
        </div>
        )}
        </main>
        <Footer />
        </>
    )
}

export default Dashboard
