import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import './login.css'
import Footer from '../components/Footer.jsx'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const looksLikeEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const getAuthCode = (error) => {
    if (error?.code) return error.code
    const message = error?.message || ''
    const match = message.match(/\(auth\/[a-z0-9-]+\)/)
    return match ? match[0].replace(/[()]/g, '') : ''
  }

  const getLoginErrorMessage = (error) => {
    const code = getAuthCode(error)
    const message = error?.message || ''
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
      return 'No account found for this email. Please create an account before signing in.'
    }
    if (code === 'auth/wrong-password') {
      return 'Incorrect password. Please check your password or reset it.'
    }
    if (code === 'auth/too-many-requests' || message.includes('RESET_PASSWORD_EXCEED_LIMIT')) {
      return 'Too many password reset attempts. Please wait a few minutes before trying again.'
    }
    return error?.message || 'Unable to sign in. Please try again.'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalizedIdentifier = identifier.trim().toLowerCase()
    const normalizedPassword = password.trim()

    if (!normalizedIdentifier) {
      setMessage('Please enter your email or phone number')
      return
    }
    if (!normalizedPassword) {
      setMessage('Please enter your password')
      return
    }

    const isEmail = looksLikeEmail(normalizedIdentifier)
    if (!isEmail) {
      setMessage('This app supports only email login right now. Please enter your email address.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await login(normalizedIdentifier, normalizedPassword)
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (error) {
      setMessage(getLoginErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group password-group">
                  <label>Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className={`toggle-password ${showPassword ? 'active' : ''}`}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 2.16M15 12a3 3 0 1 1-4.08-2.58M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className="error-message">
                    {message}
                    {message.includes('create an account') && (
                      <>
                        {' '}
                        <Link to="/register" className="auth-link">Sign up here</Link>
                      </>
                    )}
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
