import { useState, useEffect, useCallback } from 'react'
import { getAll, update as firebaseUpdate } from '../lib/firebaseDB'
import './confirmorders.css'
import Footer from '../components/Footer.jsx'

export default function ConfirmOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmingId, setConfirmingId] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('UTR Submitted')
  const ADMIN_PASSWORD = 'Satyam@ab82'

  const loadOrders = useCallback(async () => {
    const stored = localStorage.getItem('orders')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setOrders(parsed)
        setLoading(false)
        return
      } catch (e) {
        console.error('Failed to parse localStorage orders:', e)
      }
    }
    try {
      const data = await getAll('orders')
      setOrders(data || [])
      localStorage.setItem('orders', JSON.stringify(data || []))
    } catch (e) {
      console.error('Failed to load orders:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
     if (authenticated) {
      setTimeout(() => {
        loadOrders()
      }, 0)
    }
  }, [authenticated, loadOrders])

  const confirmPayment = async (order) => {
    if (!window.confirm(`Confirm payment of ₹${order.total} from ${order.customer_name}? UTR: ${order.utr || 'N/A'}`)) return
    setConfirmingId(order.id)
    const updated = { ...order, status: 'confirmed' }
    setOrders(prev => prev.map(o => o.id === order.id ? updated : o))
    try {
      await firebaseUpdate('orders', order.id, { status: 'confirmed' })
      const stored = JSON.parse(localStorage.getItem('orders') || '[]')
      const idx = stored.findIndex(o => String(o.id) === String(order.id))
      if (idx >= 0) { stored[idx] = updated }
      localStorage.setItem('orders', JSON.stringify(stored))
    } catch (err) {
      console.error(err)
      setOrders(prev => prev.map(o => o.id === order.id ? order : o))
    } finally {
      setConfirmingId(null)
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

  const formatDate = (d) => {
    if (!d) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const pendingOrders = orders.filter(o => o.status === 'UTR Submitted' || o.status === filter)
  const utrPending = orders.filter(o => o.status === 'UTR Submitted')

  if (!authenticated) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h1>Payment Confirmation</h1>
            <p>Enter admin password to verify payments</p>
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
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-btn">Verify Access</button>
          </form>
        </div>
        <Footer />
      </div>
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
        <h1>Payment Confirmation</h1>

        {utrPending.length > 0 && (
          <div className="utr-alert" style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
            <strong>⚠️ {utrPending.length} order(s) waiting for UTR verification</strong>
          </div>
        )}

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          >
            <option value="UTR Submitted">UTR Submitted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {pendingOrders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No orders found for this status.</p>
        ) : (
          <div className="orders-list">
            {pendingOrders.map((order) => {
              const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
              const orderTotal = items?.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.qty, 0) || 0
              return (
                <div key={order.id} className="order-card" style={{ border: order.status === 'UTR Submitted' ? '2px solid #f59e0b' : undefined }}>
                  <div className="order-header">
                    <span className="order-id">Order #AAL-{order.id}</span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{order.customer_name}</span>
                  </div>
                  <div style={{ padding: '0 16px' }}>
                    <p><strong>Email:</strong> {order.customer_email}</p>
                    <p><strong>Phone:</strong> {order.customer_phone}</p>
                    <p><strong>Address:</strong> {order.customer_address}</p>
                    <p><strong>Payment:</strong> {order.payment_method === 'upi' ? '📱 UPI' : '🏦 Bank Transfer'}</p>
                    {order.utr && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #16a34a', borderRadius: '6px', padding: '8px 12px', marginTop: '8px' }}>
                        <strong>UTR Number:</strong> <code style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a' }}>{order.utr}</code>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    <strong>Items:</strong>
                    <div className="order-items-preview" style={{ marginTop: '6px' }}>
                      {items?.slice(0, 5).map((item, idx) => (
                        <span key={idx} className="order-item-badge">{item.name} × {item.qty}</span>
                      ))}
                      {items?.length > 5 && <span className="order-item-badge">+{items.length - 5} more</span>}
                    </div>
                  </div>
                  <div className="order-footer" style={{ padding: '0 16px' }}>
                    <span className="order-total">Total: ₹{orderTotal.toFixed(2)}</span>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: order.status === 'UTR Submitted' ? '#fef3c7' : order.status === 'confirmed' ? '#dbeafe' : order.status === 'completed' ? '#d1fae5' : order.status === 'cancelled' ? '#fee2e2' : '#f1f5f9',
                      color: order.status === 'UTR Submitted' ? '#92400e' : order.status === 'confirmed' ? '#1e40af' : order.status === 'completed' ? '#065f46' : order.status === 'cancelled' ? '#991b1b' : '#475569'
                    }}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {order.status === 'UTR Submitted' ? (
                      <>
                        <button
                          className="confirm-payment-btn"
                          onClick={() => confirmPayment(order)}
                          disabled={confirmingId === order.id}
                        >
                          {confirmingId === order.id ? 'Confirming...' : '✓ Confirm Payment'}
                        </button>
<button className="reject-btn" onClick={async () => {
                           if (!window.confirm('Mark this order as cancelled?')) return
                           setConfirmingId(order.id)
                           const cancelled = { ...order, status: 'cancelled' }
                           setOrders(prev => prev.map(o => o.id === order.id ? cancelled : o))
                           try { await firebaseUpdate('orders', order.id, { status: 'cancelled' }) } catch (updateError) {
                             console.error('Failed to update order status:', updateError)
                           }
                           setConfirmingId(null)
                         }} disabled={confirmingId === order.id}>✕ Cancel Order</button>
                      </>
                    ) : order.status === 'confirmed' ? (
<button className="complete-btn" onClick={async () => {
                         const completed = { ...order, status: 'completed' }
                         setOrders(prev => prev.map(o => o.id === order.id ? completed : o))
                         try { await firebaseUpdate('orders', order.id, { status: 'completed' }) } catch (completeErr) {
                           console.error('Complete order error:', completeErr)
                         }
                       }}>✓ Mark as Completed</button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>No action needed</span>
                    )}
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
