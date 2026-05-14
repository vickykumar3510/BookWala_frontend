import { useLocation } from "react-router-dom"
import HeaderNoSearchBar from '../components/HeadeNoSearchBar'
import Footer from "../components/Footer"

const Checkout = () => {
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <>
        <HeaderNoSearchBar />
        <main className="checkout">
          <h1 className="checkout__title">Order Summary</h1>
          <p className="checkout__empty">No order found. Please go back to cart.</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <HeaderNoSearchBar />
      <main className="checkout">
        <div className="checkout__intro">
          <h1 className="checkout__title">Order Summary</h1>
          <div className="checkout__stats">
            <p className="checkout__stat">Total Books: {order.totalBooks}</p>
            <p className="checkout__stat">Total Amount: Rs. {order.totalPrice}</p>
          </div>
        </div>

        <section className="checkout__card">
          <h2 className="checkout__card-title">Delivery Address</h2>
          <p className="checkout__address">
            {`${order.customerName} - ${order.customerAddress.flat}, ${order.customerAddress.area}, ${order.customerAddress.city}, ${order.customerAddress.state}, ${order.customerAddress.pincode}${order.customerPhone != null && String(order.customerPhone).trim() !== "" ? `, ${order.customerPhone}` : ""}`}
          </p>
        </section>

        <section className="checkout__card">
          <h2 className="checkout__card-title">Books Ordered</h2>
          <ul className="checkout__list">
            {order.items.map((b, idx) => (
              <li key={idx} className="checkout__item">
                <img
                  className="checkout__thumb"
                  src={b.bookImage}
                  alt={b.bookName}
                />
                <div className="checkout__item-meta">
                  <strong className="checkout__item-name">{b.bookName}</strong>
                  <span className="checkout__item-sub">⭐{b.bookRating} (x{b.quantity})</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="checkout__thankyou">
          <h2 className="checkout__thankyou-title">Thank you for your order!</h2>
          <p className="checkout__thankyou-text">Your books will be delivered soon.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Checkout
