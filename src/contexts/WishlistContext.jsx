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

const WishlistContext = createContext()

async function putWishlistOnServer(token, wishlist) {
  const res = await fetch(`${API_BASE_URL}/user/me/wishlist`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ wishlist }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || err.error || "Failed to save wishlist")
  }
}

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth()
  const [wishlistItem, setWishlistItem] = useState([])

  const persistWishlist = useCallback(
    async (next) => {
      if (!token) return
      try {
        await putWishlistOnServer(token, next)
      } catch (e) {
        console.error(e)
        toast.error(e.message || "Could not sync wishlist", { toastId: "wishlist-sync-error" })
      }
    },
    [token]
  )

  useEffect(() => {
    if (!token) {
      setWishlistItem([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/me/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to load wishlist")
        const raw = await res.json()
        const list = Array.isArray(raw) ? raw : raw?.wishlist ?? []
        const catalogById = await fetchBookCatalogMap()
        if (!cancelled) {
          setWishlistItem(
            list.map((item) => mergeStoredBookItem(item, catalogById))
          )
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setWishlistItem([])
          toast.error("Could not load wishlist", { toastId: "wishlist-load-error" })
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  const addToWishlist = (book) => {
    if (!token) {
      toast.error("Please log in to use the wishlist.", { toastId: "wishlist-login-required" })
      return
    }
    setWishlistItem((prev) => {
      const existing = prev.find((b) => b._id === book._id)
      if (existing) {
        toastOnce(`wishlist-already-in-${book._id}`, (toastId) =>
          toast.info("Book already in wishlist.", { toastId })
        )
        return prev
      }
      const next = [...prev, { ...book, quantity: 1 }]
      void persistWishlist(next)
      toastOnce(`wishlist-book-added-${book._id}-${prev.length}`, (toastId) =>
        toast.success("Book added to wishlist!", { toastId })
      )
      return next
    })
  }

  const removeFromWishlist = (book) => {
    if (!token) return
    setWishlistItem((prev) => {
      const next = prev.filter((b) => b._id !== book._id)
      void persistWishlist(next)
      toastOnce(`wishlist-book-removed-${book._id}-${prev.length}`, (toastId) =>
        toast.error("Book removed from wishlist.", { toastId })
      )
      return next
    })
  }

  const totalPriceWishlist = wishlistItem.reduce(
    (sum, item) => sum + itemLineTotal(item),
    0
  )

  return (
    <WishlistContext.Provider
      value={{
        wishlistItem,
        addToWishlist,
        removeFromWishlist,
        totalPriceWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistContext
