import HeaderNoSearchBar from "../components/HeadeNoSearchBar";
import Footer from "../components/Footer";
import AddressContext from "../contexts/AddressContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ORDER_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatOrderedOn(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Ordered On: —";

  const day = d.getDate();
  const month = ORDER_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  let hour24 = d.getHours();
  const period = hour24 >= 12 ? "pm" : "am";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  const hoursStr = String(hour12).padStart(2, "0");
  const minutesStr = String(d.getMinutes()).padStart(2, "0");

  return `Ordered On: ${day} ${month} ${year}, ${hoursStr}:${minutesStr} ${period}`;
}

const Profile = () => {
  const {
    addAddress,
    selectAddress,
    savedAddress,
    selectedAddress,
    deleteAddress,
    updateAddress,
  } = useContext(AddressContext);

  const [nickname, setNickname] = useState("");
  const [flat, setFlat] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("")
  const [editAddress, setEditAddress] = useState(null);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  
  const [user, setUser] = useState(null)

  const resetForm = () => {
    setNickname("");
    setFlat("");
    setArea("");
    setLandmark("");
    setPincode("");
    setCity("");
    setState("");
    setPhone("")
    setEditAddress(null);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!nickname || !flat || !area || !landmark || !pincode || !city || !state || !phone) {
      alert("Please fill all the fields");
      return;
    }

    const phoneDigits = String(phone).replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast.error("Phone number is incorrect. It should be 10 digits.");
      return;
    }

    const newAddress = {
      nickname,
      flat,
      area,
      landmark,
      pincode,
      city,
      state,
      customerPhone: phoneDigits,
    };

    if (editAddress !== null) {
      updateAddress(editAddress, newAddress);
    } else {
      addAddress(newAddress);
    }

    resetForm();
  };

  useEffect(() => {
    const fetchUser = async() => {
      try {
        const res = await axios.get('https://book-wala-backend.vercel.app/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        })
        setUser(res.data)
      }catch(error){
        console.error('Failed to fetch user', error)
      }
    }
    fetchUser()
  }, [])

  

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await axios.get("https://book-wala-backend.vercel.app/order", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
   
        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.orderDateTime) - new Date(a.orderDateTime)
        );
        setOrders(sortedOrders);
      } catch (error) {
        setErrorOrders(error.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <HeaderNoSearchBar />
      <main className="profile">
      <div className="profile__intro">
      <h1 className="profile__title">Hello, {user?.userName}!</h1>
      <div className="profile__meta">
        <p className="profile__meta-item"><span className="profile__meta-label">Email</span> {user?.userEmail}</p>
        <p className="profile__meta-item"><span className="profile__meta-label">Phone number</span> {user?.userPhoneNumber}</p>
      </div>
      </div>

      <div className="profile__layout">
        <form className="profile__form profile__card" onSubmit={submitHandler}>
          <label htmlFor="nickname">Nick Name / Customer Name</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <br />

          <label htmlFor="flat">Flat / House No / Building</label>
          <input
            type="text"
            id="flat"
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
          />
          <br />

          <label htmlFor="area">Area / Street / Sector</label>
          <input
            type="text"
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <br />

          <label htmlFor="landmark">Landmark</label>
          <input
            type="text"
            id="landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
          <br />

          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <br />

          <label htmlFor="state">State</label>
          <select id="state" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Select</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bihar">Bihar</option>
            <option value="Uttrakhand">Uttrakhand</option>
            <option value="Punjab">Punjab</option>
          </select>
          <br />

          <label htmlFor="pincode">Pincode</label>
          <input
            type="number"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <br />

           <label htmlFor="phone">Phone Number</label> 
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />

          <button type="submit" className="profile__btn profile__btn--primary">
            {editAddress !== null ? "Update Address" : "Add Address"}
          </button>
        </form>

        <section className="profile__card profile__addresses">
          <h3 className="profile__card-title">Saved Address</h3>
          {savedAddress.length === 0 ? (
            <p className="profile__empty">No addresses saved yet.</p>
          ) : (
            <form className="profile__address-form">
              {savedAddress.map((addr, i) => (
                <div key={i} className="profile__address-row">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddress === i}
                    onChange={() => selectAddress(i)}
                  />
                  <label>
                    <strong>{addr.nickname}</strong> - {addr.flat}, {addr.area},{" "}
                    {addr.landmark}, {addr.city}, {addr.state} - {addr.pincode}, {addr.customerPhone}
                  </label>

                  <div className="profile__address-actions">
                    <button
                      type="button"
                      className="profile__btn profile__btn--secondary"
                      onClick={() => {
                        setEditAddress(i);
                        setNickname(addr.nickname);
                        setFlat(addr.flat);
                        setArea(addr.area);
                        setLandmark(addr.landmark);
                        setPincode(addr.pincode);
                        setCity(addr.city);
                        setState(addr.state);
                        setPhone(addr.customerPhone)
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="profile__btn profile__btn--danger"
                      onClick={() => {
                        deleteAddress(i);
                        resetForm();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </form>
          )}
        </section>

        <section className="profile__card profile__orders">
          <h3 className="profile__card-title">My Orders</h3>
          {loadingOrders && <p className="profile__loading">Loading orders...</p>}
          {errorOrders && <p className="profile__orders-error" role="alert">{errorOrders}</p>}
          {orders.length === 0 && !loadingOrders ? (
            <p className="profile__empty">No orders found.</p>
          ) : (
            <ul className="profile__order-list">
              {orders.map((order, i) => (
                <li key={order._id || i} className="profile__order">
                  <strong>{formatOrderedOn(order.orderDateTime ?? order.createdAt)}</strong>
                  <br />
                  Customer: {order.customerName} <br />
                  Address: {order.customerAddress.flat}, {order.customerAddress.area}, {order.customerAddress.landmark}, {order.customerAddress.city}, {order.customerAddress.state}, {order.customerAddress.pincode} <br />
                  Phone: {order.customerPhone} <br />
                  Total Books: {order.totalBooks} <br />
                  Total Price: Rs. {order.totalPrice} <br />
                  Items:
                  <ul className="profile__order-items">
                    {order.items.map((item, j) => (
                      <li key={j} className="profile__order-item">
                        <span className="profile__order-item-text">{item.bookName} (x{item.quantity})</span>
                       <img className="profile__order-thumb" src={item.bookImage} alt={item.bookName} />
                      </li>
                    ))}
                  </ul>
                  <hr className="profile__order-rule" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      </main>
      <Footer />
    </>
  );
};

export default Profile;
