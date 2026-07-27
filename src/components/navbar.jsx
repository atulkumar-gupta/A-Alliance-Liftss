import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../images/latest.png'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import './navbar.css'

function Navbar({ isScrolled }) {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Spare Parts', path: '/spareparts' },
    { name: 'Services', path: '/services' },
    { name: 'Contact Us', path: '/contactus' },
    { name: 'Certificates', path: '/certificates' }
  ]

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const loggedIn = !!user
  const isLoginPage = location.pathname === '/login'

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Alliance Lifts" className="navbar-logo" />
      </Link>

      <div className="navbar-center">
        <div className="navbar-links">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="nav-link">
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className={`navbar-right ${isLoginPage || location.pathname === '/register' ? 'navbar-right--auth-pages' : ''}`}>
        <div className="navbar-auth">
          {/* User icon — always present with stable DOM node */}
          <Link to={loggedIn ? '/profile' : '#'} className="user-icon-btn user-icon-btn--active" onClick={!loggedIn ? (e) => e.preventDefault() : undefined} aria-label="Profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Auth button — stable DOM + deterministic text prevents blink */}
          {loggedIn ? (
            <Link to="#" className="auth-btn auth-btn--neutral" onClick={handleLogout}>
              Logout
            </Link>
          ) : isLoginPage ? (
            <Link to="/register" className="auth-btn auth-btn--neutral">
              Signup
            </Link>
          ) : (
            <Link to="/login" className="auth-btn auth-btn--neutral">
              Login
            </Link>
          )}
        </div>
      </div>

      <button
        className={`hamburger-btn ${isMobileMenuOpen ? 'hamburger-btn-open hamburger-triggered' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mobile-buttons">
          <div className="mobile-auth-group">
            <Link to={loggedIn ? '/profile' : '#'} className="user-icon-btn user-icon-btn--active" onClick={!loggedIn ? (e) => e.preventDefault() : undefined} aria-label="Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            {loggedIn ? (
              <Link
                to="#"
                className="auth-btn auth-btn--neutral mobile-auth-btn"
                onClick={(e) => {
                  setIsMobileMenuOpen(false)
                  handleLogout(e)
                }}
              >
                Logout
              </Link>
            ) : isLoginPage ? (
              <Link
                to="/register"
                className="auth-btn auth-btn--neutral mobile-auth-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Signup
              </Link>
            ) : (
              <Link
                to="/login"
                className="auth-btn auth-btn--neutral mobile-auth-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar