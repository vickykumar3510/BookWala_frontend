import CartContext from "../contexts/CartContext.jsx"
import { useContext, useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WishlistContext from "../contexts/WishlistContext"
import SearchContext from "../contexts/SearchContext"
import AddressContext from "../contexts/AddressContext"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config/api.js"
import { useAuth } from "../contexts/AuthContext.jsx"


const Cart = () => {
  const { savedAddress, selectedAddressId, selectAddress } = useContext(AddressContext)
  const { searchTerm } = useContext(SearchContext)
  const { clearCart, cartItem, increaseQuantity, decreaseQuantity, removeFromCart, totalPriceCart } = useContext(CartContext)
  const { addToWishlist } = useContext(WishlistContext)
  const navigate = useNavigate()
  const { token } = useAuth()
  const [profilePhone, setProfilePhone] = useState("")

  useEffect(() => {
    if (!token) {
      setProfilePhone("")
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const me = await res.json()
        if (!cancelled && me?.userPhoneNumber != null) {
          setProfilePhone(String(me.userPhoneNumber))
        }
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  const search = searchTerm?.toLowerCase() || ""
  const matchesSearch = (b) => {
    const author = String(b.bookAuthor ?? "").toLowerCase()
    const title = String(b.bookName ?? "").toLowerCase()
    return author.includes(search) || title.includes(search)
  }
  const filteredCartList = cartItem.filter(matchesSearch)

  const totalBooks = cartItem.reduce((acc, item) => acc + item.quantity, 0)

  const canProceedToCheckout =
    Boolean(selectedAddressId) && cartItem.length > 0 && totalBooks > 0

  const handleProceedToCheckout = async () => {
    if (!cartItem.length || totalBooks <= 0) {
      alert("Your cart is empty. Add books before checkout.")
      return
    }
    const addr = savedAddress.find((a) => a._id === selectedAddressId)
    if (!addr) return

    const phone =
      String(addr.customerPhone ?? "").replace(/\D/g, "").length === 10
        ? String(addr.customerPhone).replace(/\D/g, "")
        : String(profilePhone ?? "").replace(/\D/g, "")

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
      customerPhone: phone,
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
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const data = await response.json()
        clearCart()
        navigate("/checkout", { state: { order: data } })
      } else {
        const err = await response.json().catch(() => ({}))
        alert("Error placing order: " + (err.message || err.error || response.statusText))
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
            <p className="cart__summary-line">Total Price: Rs. {totalPriceCart}</p>
          </div>

          <label htmlFor="address" className="cart__label">Please select a delivery address:</label>
          <select
            name="address"
            id="address"
            className="cart__select"
            value={selectedAddressId ?? ""}
            onChange={(e) => selectAddress(e.target.value || null)}
          >
            <option value="">Select Address</option>
            {savedAddress && savedAddress.length > 0 ? (
              savedAddress.map((addr) => (
                <option key={addr._id} value={addr._id}>
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
              disabled={!canProceedToCheckout}
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
