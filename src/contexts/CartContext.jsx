import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItem, setCartItem] = useState(() => {
        const stored = localStorage.getItem("cartItem");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItem", JSON.stringify(cartItem));
    }, [cartItem]);

    const addToCart = (book) => {
        const existing = cartItem.find((b) => b._id === book._id);

        if (!existing) {
            setCartItem([...cartItem, { ...book, quantity: 1 }]);
            toast.success("Book added to cart!");
        } else {
            toast.info("Book already in cart.");
        }
    };

    const increaseQuantity = (bookId) => {
        setCartItem(
            cartItem.map((b) =>
                b._id === bookId ? { ...b, quantity: b.quantity + 1 } : b
            )
        );
        toast.success("Quantity increased.");
    };

    const decreaseQuantity = (bookId) => {
        setCartItem(
            cartItem
                .map((b) =>
                    b._id === bookId ? { ...b, quantity: b.quantity - 1 } : b
                )
                .filter((b) => b.quantity > 0)
        );
        toast.info("Quantity decreased.");
    };

    const removeFromCart = (book) => {
        setCartItem((prev) => prev.filter((b) => b._id !== book._id));
        toast.error("Book removed from cart.")
    };

    const totalPriceCart = cartItem.reduce(
        (sum, item) => sum + item.bookPrice * item.quantity,
        0
    );

const clearCart = () => {
  setCartItem([])            
  localStorage.removeItem("cartItem") 
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
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
