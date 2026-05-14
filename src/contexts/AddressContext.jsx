import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [savedAddress, setSavedAddress] = useState(() => {
    const stored = localStorage.getItem("savedAddress");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    const stored = localStorage.getItem("selectedAddress");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem("savedAddress", JSON.stringify(savedAddress));
  }, [savedAddress]);

  useEffect(() => {
    localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  const addAddress = (newAddress) => {
    setSavedAddress([...savedAddress, newAddress]);
    toast.success("New address added successfully!");
  };

  const selectAddress = (index) => {
    setSelectedAddress(index);
  };

  const deleteAddress = (index) => {
    const filterList = savedAddress.filter((_, i) => i !== index);
    setSavedAddress(filterList);

    if (selectedAddress === index) {
      setSelectedAddress(null);
    } else if (selectedAddress > index) {
      setSelectedAddress(selectedAddress - 1);
    }
    toast.error("Address deleted.");
  };

  const updateAddress = (index, updatedAddress) => {
    const updatedList = savedAddress.map((item, i) =>
      i === index ? updatedAddress : item
    );
    setSavedAddress(updatedList);
    toast.success("Address updated successfully!");
  };

  return (
    <AddressContext.Provider
      value={{
        addAddress,
        selectAddress,
        savedAddress,
        setSavedAddress,
        selectedAddress,
        deleteAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export default AddressContext;