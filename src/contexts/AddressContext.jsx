import { createContext, useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { API_BASE_URL } from "../config/api.js"
import { useAuth } from "./AuthContext.jsx"

const AddressContext = createContext()

const toApiAddressBody = (addr) => ({
  nickname: addr.nickname,
  flat: addr.flat,
  area: addr.area,
  landmark: addr.landmark,
  city: addr.city,
  state: addr.state,
  pincode: addr.pincode,
  customerPhone: addr.customerPhone
})

const mapServerAddress = (a) => ({
  _id: a._id ?? a.id,
  flat: a.flat,
  area: a.area,
  landmark: a.landmark,
  city: a.city,
  state: a.state,
  pincode: a.pincode,
  nickname: a.nickname ?? a.flat ?? "Address",
  customerPhone: a.customerPhone ?? a.userPhoneNumber ?? "",
})

export const AddressProvider = ({ children }) => {
  const { token } = useAuth()
  const [savedAddress, setSavedAddress] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)

  const loadAddresses = useCallback(async () => {
    if (!token) {
      setSavedAddress([])
      setSelectedAddressId(null)
      return
    }
    try {
      const res = await fetch(`${API_BASE_URL}/user/me/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to load addresses")
      const raw = await res.json()
      const list = Array.isArray(raw) ? raw : raw?.addresses ?? []
      setSavedAddress(list.map(mapServerAddress))
    } catch (e) {
      console.error(e)
      setSavedAddress([])
      toast.error("Could not load addresses")
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      setSavedAddress([])
      setSelectedAddressId(null)
      return
    }
    void loadAddresses()
  }, [token, loadAddresses])

  const selectAddress = (addressId) => {
    setSelectedAddressId(addressId)
  }

  const addAddress = async (newAddress) => {
    if (!token) {
      toast.error("Please log in to save addresses.")
      return
    }
    try {
      const res = await fetch(`${API_BASE_URL}/user/me/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(toApiAddressBody(newAddress)),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || err.error || "Failed to add address")
      }
      const created = await res.json().catch(() => null)
      if (created && (created._id || created.id)) {
        setSavedAddress((prev) => [
          ...prev,
          {
            ...mapServerAddress(created),
            nickname: newAddress.nickname,
            customerPhone: newAddress.customerPhone ?? "",
          },
        ])
      } else {
        await loadAddresses()
      }
      toast.success("New address added successfully!")
    } catch (e) {
      console.error(e)
      toast.error(e.message || "Could not add address")
    }
  }

  const deleteAddress = async (addressId) => {
    if (!token || !addressId) return
    try {
      const res = await fetch(
        `${API_BASE_URL}/user/me/addresses/${encodeURIComponent(addressId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || err.error || "Failed to delete address")
      }
      setSavedAddress((prev) => prev.filter((a) => a._id !== addressId))
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null)
      }
      toast.error("Address deleted.")
    } catch (e) {
      console.error(e)
      toast.error(e.message || "Could not delete address")
    }
  }

  const updateAddress = async (addressId, updatedAddress) => {
    if (!token || !addressId) return
    try {
      const del = await fetch(
        `${API_BASE_URL}/user/me/addresses/${encodeURIComponent(addressId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!del.ok) {
        const err = await del.json().catch(() => ({}))
        throw new Error(err.message || err.error || "Failed to update address")
      }
      const post = await fetch(`${API_BASE_URL}/user/me/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(toApiAddressBody(updatedAddress)),
      })
      if (!post.ok) {
        const err = await post.json().catch(() => ({}))
        throw new Error(err.message || err.error || "Failed to save address")
      }
      const created = await post.json().catch(() => null)
      if (created && (created._id || created.id)) {
        setSavedAddress((prev) => {
          const prevEntry = prev.find((a) => a._id === addressId)
          const nextDigits = String(updatedAddress.customerPhone ?? "").replace(/\D/g, "")
          const prevDigits = String(prevEntry?.customerPhone ?? "").replace(/\D/g, "")
          const customerPhone =
            nextDigits.length === 10
              ? nextDigits
              : prevDigits.length === 10
                ? prevDigits
                : String(updatedAddress.customerPhone ?? "").trim() || prevEntry?.customerPhone || ""
          const mapped = {
            ...mapServerAddress(created),
            nickname: updatedAddress.nickname,
            customerPhone,
          }
          return prev.map((a) => (a._id === addressId ? mapped : a))
        })
        if (selectedAddressId === addressId) {
          setSelectedAddressId(mapped._id)
        }
      } else {
        await loadAddresses()
      }
      toast.success("Address updated successfully!")
    } catch (e) {
      console.error(e)
      toast.error(e.message || "Could not update address")
      await loadAddresses()
    }
  }

  return (
    <AddressContext.Provider
      value={{
        addAddress,
        selectAddress,
        savedAddress,
        setSavedAddress,
        selectedAddressId,
        deleteAddress,
        updateAddress,
        loadAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export default AddressContext
