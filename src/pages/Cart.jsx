import CartContext from "../contexts/CartContext"
import { useContext, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WishlistContext from "../contexts/WishlistContext"
import SearchContext from "../contexts/SearchContext"
import AddressContext from "../contexts/AddressContext"
import { useNavigate } from "react-router-dom"


const Cart = () => {
  const { savedAddress } = useContext(AddressContext)
  const { searchTerm } = useContext(SearchContext)
  const { clearCart, cartItem, increaseQuantity, decreaseQuantity, removeFromCart, totalPriceCart } = useContext(CartContext)
  const { addToWishlist } = useContext(WishlistContext)
  const navigate = useNavigate()

  const [selectedAddress, setSelectedAddress] = useState("")

  const search = searchTerm?.toLowerCase() || ""
  const filteredCartList = cartItem.filter((b) =>
    b.bookAuthor.toLowerCase().includes(search) ||
    b.bookName.toLowerCase().includes(search)
  )

  const totalBooks = cartItem.reduce((acc, item) => acc + item.quantity, 0)

  const handleProceedToCheckout = async () => {
    const addr = savedAddress.find(a => a.nickname === selectedAddress)

    const orderData = {
      customerName: addr.nickname,
      customerAddress: {
        flat: addr.flat,
        area: addr.area,
        landmark: addr.landmark,
        city: addr.city,
        state: addr.state,
        pincode: Number(addr.pincode)
      },
      customerPhone: addr.customerPhone,
      totalBooks,
      totalPrice: totalPriceCart,
      items: cartItem.map((b) => ({
        bookName: b.bookName,
        bookImage: b.bookImage,
        bookDescription: b.bookDescription,
        bookRating: b.bookRating,
        quantity: b.quantity
      }))
    }

    try {
      const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const data = await response.json()
        clearCart()
        navigate("/checkout", { state: { order: data } })
      } else {
        const err = await response.json()
        alert("Error placing order: " + err.message)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong while placing order.")
    }
  }

  return (
    <>
      <Header />
      <main className="cart">
        <div className="cart__intro">
          <h1 className="cart__title">Cart Page</h1>
          <p className="cart__meta">Total Cart Items: {cartItem.length}</p>
        </div>

        <section className="cart__summary">
          <h2 className="cart__summary-title">Cart Summary</h2>
          <div className="cart__summary-stats">
            <p className="cart__summary-line">Total Number of Books: {totalBooks}</p>
            <p className="cart__summary-line">Total Amount: Rs. {totalPriceCart}</p>
          </div>

          <label htmlFor="address" className="cart__label">Please select a delivery address:</label>
          <select
            name="address"
            id="address"
            className="cart__select"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            <option value="">Select Address</option>
            {savedAddress && savedAddress.length > 0 ? (
              savedAddress.map((addr, idx) => (
                <option key={idx} value={addr.nickname}>
                  {`${addr.nickname} - ${addr.flat}, ${addr.area}, ${addr.city}, ${addr.state}, ${addr.pincode}${addr.customerPhone != null && String(addr.customerPhone).trim() !== "" ? `, ${addr.customerPhone}` : ""}`}
                </option>
              ))
            ) : (
              <option disabled>No saved addresses</option>
            )}
          </select>

          <div className="cart__summary-actions">
            <button
              type="button"
              className="cart__btn cart__btn--secondary"
              onClick={() => navigate("/profile")}
            >
              Add Address
            </button>
            <button
              type="button"
              className="cart__btn cart__btn--primary"
              disabled={!selectedAddress}
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </section>

        {filteredCartList.length > 0 ? (
          <div className="cart__grid">
            {filteredCartList.map((b) => (
              <article key={b._id} className="cart__item">
                <div className="cart__item-media">
                  <img
                    src={b.bookImage}
                    alt={b.bookName}
                  />
                </div>
                <div className="cart__item-body">
                  <h3 className="cart__item-title">{b.bookName}</h3>
                  <p className="cart__item-text">Author: {b.bookAuthor}</p>
                  <p className="cart__item-text">Rating: ⭐ {b.bookRating}</p>
                  <p className="cart__item-text">Price: Rs. {b.bookPrice}</p>
                  <p className="cart__item-text">Quantity: {b.quantity}</p>
                  <div className="cart__item-controls">
                    <button type="button" className="cart__icon-btn cart__icon-btn--plus" onClick={() => increaseQuantity(b._id)}>+</button>
                    <button type="button" className="cart__icon-btn cart__icon-btn--minus" onClick={() => decreaseQuantity(b._id)}>-</button>
                    <button type="button" className="cart__btn cart__btn--wishlist" onClick={() => addToWishlist(b)}>Add to Wishlist</button>
                    <button type="button" className="cart__btn cart__btn--remove" onClick={() => removeFromCart(b)}>Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="cart__empty">No items in cart.</p>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Cart
