import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Profile from './pages/Profile.jsx'
import Cart from './pages/Cart.jsx'
import SignUp from './pages/SignUp.jsx'
import { SearchProvider } from './contexts/SearchContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { WishlistProvider } from './contexts/WishlistContext.jsx'
import Checkout from './pages/Checkout.jsx'
import { AddressProvider } from './contexts/AddressContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./react-toastify-overrides.css";
import ToastHeaderInsetSync from "./components/ToastHeaderInsetSync.jsx";


const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signup', element: <SignUp /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/bookdetail/:bookID', element: <BookDetails /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/profile', element: <Profile /> },
      { path: '/cart', element: <Cart /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/checkout', element: <Checkout /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AddressProvider>
    <WishlistProvider>
    <CartProvider>
    <SearchProvider>
    <ToastHeaderInsetSync />
    <RouterProvider router={router}/>
    <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              hideProgressBar={false} 
              newestOnTop={false} 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover 
              theme="colored"
            />
    </SearchProvider>
    </CartProvider>
    </WishlistProvider>
    </AddressProvider>
  </StrictMode>,
)
