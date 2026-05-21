import { createContext, useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../config/api.js"
import { useAuth } from "./AuthContext.jsx"

const toastGuard = new Set()

function toastOnce(actionKey, show) {
  if (toastGuard.has(actionKey)) return
  toastGuard.add(actionKey)
  const toastId = `${actionKey}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  show(toastId)
  queueMicrotask(() => toastGuard.delete(actionKey))
}

function toFiniteNumber(value) {
  if (value == null || value === "") return null
  if (typeof value === "object" && value !== null && "$numberDecimal" in value) {
    return toFiniteNumber(value.$numberDecimal)
  }
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

async function fetchBookCatalogMap() {
  try {
    const res = await fetch(`${API_BASE_URL}/book`)
    if (!res.ok) return new Map()
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    return new Map(list.map((b) => [String(b._id), b]))
  } catch {
    return new Map()
  }
}

function resolveBookPrice(item, catalogById = new Map()) {
  const fromItem = toFiniteNumber(item?.bookPrice ?? item?.price)
  if (fromItem != null) return fromItem

  const book =
    typeof item?.book === "object" && item.book != null ? item.book : null
  const fromNested = toFiniteNumber(book?.bookPrice ?? book?.price)
  if (fromNested != null) return fromNested

  for (const key of [item?.bookId, item?._id]) {
    if (key == null || key === "") continue
    const fromCatalog = toFiniteNumber(catalogById.get(String(key))?.bookPrice)
    if (fromCatalog != null) return fromCatalog
  }

  return 0
}

function mergeStoredBookItem(item, catalogById) {
  const catalogId = String(item?.bookId ?? item?._id ?? "")
  const catalog = catalogById.get(catalogId)
  return {
    ...(catalog || {}),
    ...item,
    _id: item?._id ?? catalog?._id ?? catalogId,
    quantity:
      typeof item?.quantity === "number" && item.quantity > 0
        ? item.quantity
        : 1,
    bookPrice: resolveBookPrice(item, catalogById),
  }
}

function itemLineTotal(item) {
  const price = Number(item?.bookPrice)
  const qty = Number(item?.quantity)
  if (!Number.isFinite(price)) return 0
  return price * (Number.isFinite(qty) && qty > 0 ? qty : 1)
}

const CartContext = createContext()

async function putCartOnServer(token, cart) {
  const res = await fetch(`${API_BASE_URL}/user/me/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cart }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || err.error || "Failed to save cart")
  }
}

export const CartProvider = ({ children }) => {
  const { token } = useAuth()
  const [cartItem, setCartItem] = useState([])

  const persistCart = useCallback(
    async (nextCart) => {
      if (!token) return
      try {
        await putCartOnServer(token, nextCart)
      } catch (e) {
        console.error(e)
        toast.error(e.message || "Could not sync cart", { toastId: "cart-sync-error" })
      }
    },
    [token]
  )

  useEffect(() => {
    if (!token) {
      setCartItem([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/me/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to load cart")
        const raw = await res.json()
        const list = Array.isArray(raw) ? raw : raw?.cart ?? []
        const catalogById = await fetchBookCatalogMap()
        if (!cancelled) {
          setCartItem(list.map((item) => mergeStoredBookItem(item, catalogById)))
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setCartItem([])
          toast.error("Could not load cart", { toastId: "cart-load-error" })
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  const addToCart = (book) => {
    if (!token) {
      toast.error("Please log in to use the cart.")
      return
    }
    setCartItem((prev) => {
      const existing = prev.find((b) => b._id === book._id)
      if (existing) {
        toastOnce(`cart-already-in-cart-${book._id}`, (toastId) =>
          toast.info("Book already in cart.", { toastId })
        )
        return prev
      }
      const next = [...prev, { ...book, quantity: 1 }]
      void persistCart(next)
      toastOnce(`cart-book-added-${book._id}-${prev.length}`, (toastId) =>
        toast.success("Book added to cart!", { toastId })
      )
      return next
    })
  }

  const increaseQuantity = (bookId) => {
    if (!token) return
    setCartItem((prev) => {
      const next = prev.map((b) =>
        b._id === bookId ? { ...b, quantity: b.quantity + 1 } : b
      )
      void persistCart(next)
      toastOnce(
        `cart-qty-increased-${bookId}-${prev.find((b) => b._id === bookId)?.quantity ?? 0}`,
        (toastId) => toast.success("Quantity increased.", { toastId })
      )
      return next
    })
  }

  const decreaseQuantity = (bookId) => {
    if (!token) return
    setCartItem((prev) => {
      const next = prev
        .map((b) =>
          b._id === bookId ? { ...b, quantity: b.quantity - 1 } : b
        )
        .filter((b) => b.quantity > 0)
      void persistCart(next)
      toastOnce(
        `cart-qty-decreased-${bookId}-${prev.find((b) => b._id === bookId)?.quantity ?? 0}`,
        (toastId) => toast.info("Quantity decreased.", { toastId })
      )
      return next
    })
  }

  const removeFromCart = (book) => {
    if (!token) return
    setCartItem((prev) => {
      const next = prev.filter((b) => b._id !== book._id)
      void persistCart(next)
      toastOnce(`cart-book-removed-${book._id}-${prev.length}`, (toastId) =>
        toast.error("Book removed from cart.", { toastId })
      )
      return next
    })
  }

  const totalPriceCart = cartItem.reduce(
    (sum, item) => sum + itemLineTotal(item),
    0
  )

  const clearCart = () => {
    setCartItem([])
    if (token) {
      void persistCart([])
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItem,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        totalPriceCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
