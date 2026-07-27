import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import './login.css'
import Footer from '../components/Footer.jsx'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { changePassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setMessage('Please fill in both password fields')
      return
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await changePassword(password)
      setMessage('Password updated successfully!')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!searchParams.get('mode') || searchParams.get('mode') !== 'resetPassword') {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h1>Invalid Link</h1>
            <p>This password reset link is invalid or has expired.</p>
          </div>
          <div className="auth-footer">
            <p><Link to="/">Back to Login</Link></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your new password below</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group password-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength="6"
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

             <div className="form-group password-group">
               <label>Confirm Password</label>
               <div className="password-input-wrapper">
                 <input
                   type={showConfirmPassword ? 'text' : 'password'}
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   placeholder="Confirm new password"
                   required
                   minLength="6"
                 />
                 <button
                   type="button"
                   className={`toggle-password ${showConfirmPassword ? 'active' : ''}`}
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                 >
                   {showConfirmPassword ? (
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
               </div>
             )}

             <button type="submit" className="submit-btn" disabled={loading}>
               {loading ? 'Updating...' : 'Update Password'}
             </button>
           </form>

           <div className="auth-footer">
             <p>Remember your password? <Link to="/login">Sign In</Link></p>
           </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
