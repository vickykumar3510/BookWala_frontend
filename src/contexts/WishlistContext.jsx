import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItem, setWishlistItem] = useState(() => {
        const stored = localStorage.getItem("wishlistItem");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlistItem", JSON.stringify(wishlistItem));
    }, [wishlistItem]);

    const addToWishlist = (book) => {
        const existing = wishlistItem.find((b) => b._id === book._id);

        if (!existing) {
            setWishlistItem([...wishlistItem, { ...book, quantity: 1 }]);
            toast.success("Book added to wishlist!");
        } else {
            toast.info("Book already in wishlist.");
        }
    };

    const removeFromWishlist = (book) => {
        setWishlistItem((prev) => prev.filter((b) => b._id !== book._id));
         toast.error("Book removed from wishlist.");
    };

    const totalPriceWishlist = wishlistItem.reduce(
        (sum, item) => sum + item.bookPrice * item.quantity,
        0
    );

    return (
        <WishlistContext.Provider
            value={{
                wishlistItem,
                setWishlistItem,
                addToWishlist,
                removeFromWishlist,
                totalPriceWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;
