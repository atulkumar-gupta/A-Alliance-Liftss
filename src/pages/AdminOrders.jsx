import { useState, useEffect } from 'react'
import { getAll, update, remove as removeOrder } from '../lib/firebaseDB'
import './login.css'
import Footer from '../components/Footer.jsx'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  // const ADMIN_PASSWORD = 'Satyam@ab82'
 const ADMIN_PASSWORD = 'Abcde@123'
  useEffect(() => {
    if (authenticated) {
      const loadOrders = async () => {
        const stored = localStorage.getItem('orders')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            setOrders(parsed)
            setLoading(false)
            return
          } catch {
            console.error('Failed to parse localStorage orders')
          }
        }
        const data = await getAll('orders')
        if (data) {
          setOrders(data)
          localStorage.setItem('orders', JSON.stringify(data))
        } else {
          setOrders([])
        }
        setLoading(false)
      }
      loadOrders()
    }
  }, [authenticated])

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    const updatedOrders = orders.map(o => String(o.id) === String(orderId) ? { ...o, status: newStatus } : o)
    try {
      await update('orders', orderId, { status: newStatus })
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      setOrders(updatedOrders)
    } catch (err) {
      console.error('Update error:', err.message)
      localStorage.setItem('orders', JSON.stringify(orders))
      setOrders(orders)
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return
    try {
      await removeOrder('orders', orderId)
      const updatedOrders = orders.filter(o => String(o.id) !== String(orderId))
      setOrders(updatedOrders)
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
    } catch (err) {
      console.error('Delete error:', err.message)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  if (!authenticated) {
    return (
      <>
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <h1>Admin Login</h1>
              <p>Enter password to access order management</p>
            </div>
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className={`toggle-password ${showPassword ? 'active' : ''}`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 2.16M15 12a3 3 0 1 1-4.08-2.58M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">Login</button>
            </form>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (loading) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <p>Loading orders...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <h1>Admin Orders</h1>
        
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
              const orderTotal = items?.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.qty, 0) || 0
              
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Order #AAL-{order.id}</span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{order.customer_name}</span>
                  </div>
                  <div className="order-items-preview">
                    {items?.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="order-item-badge">{item.name} × {item.qty}</span>
                    ))}
                    {items?.length > 3 && <span className="order-item-badge">+{items.length - 3} more</span>}
                  </div>
                  <div className="order-footer">
                    <span className="order-total">Total: ₹{orderTotal.toFixed(2)}</span>
                    <span className="order-payment">Payment: {order.payment_method || 'bank'}</span>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Status:</span>
                    <select 
                      value={order.status || 'pending'} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="UTR Submitted">UTR Submitted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    {order.status === 'UTR Submitted' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        disabled={updatingId === order.id}
                        style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                      >
                        ✓ Confirm Payment
                      </button>
                    )}
                    
                    {updatingId === order.id && <span style={{ fontSize: '12px', color: '#64748b' }}>Saving...</span>}
                    
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      style={{ marginLeft: 'auto', background: '#e30707', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}