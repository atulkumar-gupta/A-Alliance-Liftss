import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Topbar from './components/topbar'
import Navbar from './components/navbar'
import AnnouncementBanner from './components/announcement'
import Home from './pages/home'
import Products from './pages/products'
import SpareParts from './pages/spareparts'
import Services from './pages/services'
import AboutPage from './pages/about'
import ContactUs from './pages/contactus'
import ProductDetails from './pages/ProductDetails'
import SparePartDetails from './pages/SparePartDetails'
import Certificates from './pages/certificates'
import SparePartsAdmin from './pages/SparePartsAdmin'
import AdminOrders from './pages/AdminOrders'
import ConfirmOrders from './pages/ConfirmOrders'
import AnnouncementsAdmin from './pages/AnnouncementsAdmin'
import ProjectsAdmin from './pages/ProjectsAdmin'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import CartProvider from './context/CartContext'
import Login from './pages/Login'
import SignupPage from './pages/signup'
import ResetPassword from './pages/ResetPassword'
import { AuthProvider } from './lib/FirebaseAuthContext'
import './App.css'
import useScrollToTopOnRouteChange from './hooks/useScrollToTopOnRouteChange'
import { useState, useEffect } from 'react'


function ScrollToTop() {
  useScrollToTopOnRouteChange()
  return null
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AnnouncementBanner />
          <div className="app-wrapper">
            <Topbar />
            <Navbar isScrolled={isScrolled} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
               <Route path="/" element={<Home />} />
               <Route path="/about" element={<AboutPage />} />
               <Route path="/products" element={<Products />} />
               <Route path="/products/:productId" element={<ProductDetails />} />
               <Route path="/spareparts/:sparePartId" element={<SparePartDetails />} />
               <Route path="/spareparts" element={<SpareParts />} />
               <Route path="/services" element={<Services />} />
               <Route path="/contactus" element={<ContactUs />} />
<Route path="/certificates" element={<Certificates />} />
               <Route path="/admin/spareparts" element={<SparePartsAdmin />} />
               <Route path="/admin/orders" element={<AdminOrders />} />
<Route path="/admin/confirm-orders" element={<ConfirmOrders />} />
                <Route path="/admin/announcements" element={<AnnouncementsAdmin />} />
                <Route path="/admin/projects" element={<ProjectsAdmin />} />
               <Route path="/checkout" element={<Checkout />} />
               <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App