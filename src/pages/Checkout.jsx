import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { insert, update } from '../lib/firebaseDB'
import img1 from '../images/part1.png'
import img2 from '../images/part2.png'
import img3 from '../images/part3.png'
import img4 from '../images/part4.png'
import img5 from '../images/part5.png'
import img6 from '../images/bufferspring.png'
import img7 from '../images/machinebase.png'
import img8 from '../images/ropethimbles.png'
import img9 from '../images/swingdoor.png'
import './checkout.css'
import Footer from '../components/Footer.jsx'

const imageMap = {
  'part1.png': img1,
  'part2.png': img2,
  'part3.png': img3,
  'part4.png': img4,
  'part5.png': img5,
  'bufferspring.png': img6,
  'machinebase.png': img7,
  'ropethimbles.png': img8,
  'swingdoor.png': img9
}

const getOrderId = () => Date.now()
const formatPrice = (value) => {
  const number = typeof value === 'number' ? value : parseFloat(value)
  if (Number.isFinite(number)) return `₹${number.toFixed(2)}`
  return '₹0.00'
}

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [submitMessage, setSubmitMessage] = useState('')
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [orderTotal, setOrderTotal] = useState('0.00')
  const [utr, setUtr] = useState('')
  const [utrSubmitted, setUtrSubmitted] = useState(false)
  const [orderItems, setOrderItems] = useState([])

  const getImgSrc = (img) => {
    if (img?.startsWith('data:')) return img
    return imageMap[img] || img
  }

  const calculateTotal = (items) => items.reduce((sum, item) => {
    const base = item.variantPrice || item.price || 0
    const numeric = typeof base === 'number' ? base : Number(base)
    return sum + (Number.isFinite(numeric) ? numeric : 0) * (item.qty || 1)
  }, 0)
  const total = calculateTotal(cart)

  const saveOrder = async () => {
    const orderTotalValue = total.toFixed(2)
    const newOrderId = getOrderId()
    const orderData = {
      id: newOrderId,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      items: JSON.stringify(cart.map(item => ({ name: item.name, qty: item.qty, price: item.variantPrice || item.price }))),
      total: orderTotalValue,
      payment_method: paymentMethod,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    storedOrders.push(orderData)
    localStorage.setItem('orders', JSON.stringify(storedOrders))

    try {
      await insert('orders', orderData)
    } catch (err) {
      console.error('Firebase save order failed (local saved):', err)
    }

    return newOrderId
  }

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitMessage('Please fill in all required fields')
      return
    }

    setLoading(true)
    setSubmitMessage('')

    try {
      const id = await saveOrder()
      setOrderId(id)
      setOrderTotal(total.toFixed(2))
      setOrderItems(cart)
      setOrderComplete(true)
      setSubmitMessage(`Order #AAL-${id} placed! Please complete payment using details below and provide UTR.`)
      clearCart()
    } catch (err) {
      console.error('Order error:', err)
      setSubmitMessage(err.message || 'Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUtrSubmit = async () => {
    if (!utr.trim()) {
      setSubmitMessage('Please enter UTR number')
      return
    }

    setLoading(true)
    setSubmitMessage('')

    try {
      const whatsappNumber = '919876543210'
      let text = `New Order #AAL-${orderId}\n`
      text += `Customer Name: ${formData.name}\n`
      text += `Customer Email: ${formData.email}\n`
      text += `Customer Phone: ${formData.phone}\n`
      text += `Customer Address: ${formData.address}\n`
      text += `UTR Number: ${utr}\n`
      text += 'Items:\n'
      orderItems.forEach((item, idx) => {
        const itemPrice = item.variantPrice || item.price
        text += `${idx + 1}. ${item.name} - Qty: ${item.qty} - ${formatPrice(itemPrice)}\n`
      })
      text += `Total: ${formatPrice(orderTotal)}\n`
      text += `Payment Method: ${paymentMethod}`
      const encodedText = encodeURIComponent(text)
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank')

      setUtrSubmitted(true)

      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updated = storedOrders.map(o => String(o.id) === String(orderId) ? { ...o, status: 'UTR Submitted', utr: utr.trim() } : o)
      localStorage.setItem('orders', JSON.stringify(updated))

      try { await update('orders', orderId, { status: 'UTR Submitted', utr: utr.trim() }) } catch (e) {
        console.error('Firebase update failed:', e)
      }

      setSubmitMessage(`UTR submitted successfully! Your payment will be verified shortly. Thank you for your order #AAL-${orderId}.`)
    } catch (err) {
      console.error('UTR submission error:', err)
      setSubmitMessage('Error submitting UTR. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (orderComplete && !utrSubmitted) {
    const paymentDetails = {
      bank: {
        title: 'Bank Transfer Details',
        details: [
          'Account Name: Alliance Lifts Pvt Ltd',
          'Account Number: 43703304503',
          'IFSC Code: SBIN00011469',
          'Bank: State Bank of India',
          'Branch: Govindpuram, Distt Ghaziabad'
        ]
      },
      upi: {
        title: 'UPI Payment Details',
        details: [
          'UPI ID: aallianceliftsprivatelimited@sbi',
          'Merchant Name: Alliance Lifts Pvt Ltd',
          'Pay using any UPI app (Google Pay, PhonePe, Paytm)'
        ]
      }
    }

    const selectedDetails = paymentDetails[paymentMethod] || paymentDetails.bank
    return (
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <h1>Payment Details</h1>
          <div className="order-success">
            <h2>Thank you for your order!</h2>
            <p className="order-id">Order #AAL-{orderId}</p>
            <p>Total Amount: <strong>{formatPrice(orderTotal)}</strong></p>

            <div className="payment-instructions">
              <h3>Payment Instructions</h3>
              <div className="bank-details">
                <p><strong>{selectedDetails.title}:</strong></p>
                {selectedDetails.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
                <p className="note">Please include Order #AAL-{orderId} in payment reference</p>
              </div>

              <div className="utr-section">
                <h3>Submit UTR Number</h3>
                <p>After making the payment, please enter your UTR (Unique Transaction Reference) number below:</p>
                <div className="form-group">
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Enter UTR number"
                    required
                  />
                </div>
                {submitMessage && <p className="submit-message">{submitMessage}</p>}
                <button
                  className="checkout-btn"
                  onClick={handleUtrSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit UTR'}
                </button>
              </div>

              <div className="contact-info">
                <p><strong>Questions? Contact us:</strong></p>
                <p>Email: abcde@gmail.com</p>
                <p>Phone: +91 9876543210</p>
              </div>
            </div>

            <button className="checkout-btn" onClick={() => window.location.href = '/'}>
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (orderComplete && utrSubmitted) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-container">
          <h1>UTR Submitted</h1>
          <div className="order-success">
            <h2>Payment verification in progress</h2>
            <p className="order-id">Order #AAL-{orderId}</p>
            <p>UTR Number: <strong>{utr}</strong></p>
            <p>Total Amount: <strong>{formatPrice(orderTotal)}</strong></p>

            <div className="contact-info" style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
              <p><strong>Your payment is being verified</strong></p>
              <p>Please allow some time for the admin to confirm your payment. You will be notified once confirmed.</p>
              <p style={{ fontSize: '13px', color: '#92400e', marginTop: '8px' }}>Email: aallianceliftspvtltd@gmail.com | Phone: +91 9899744484</p>
            </div>

            <button className="checkout-btn" onClick={() => window.location.href = '/'} style={{ marginTop: '16px' }}>
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty. <Link to="/spareparts">Continue shopping</Link></p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => {
                const itemPrice = item.variantPrice || item.price
                const itemKey = [item.id, item.selectedThickness || ''].join('|')
                return (
                  <div key={itemKey} className="cart-item">
                    <img src={getImgSrc(item.img)} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      {item.selectedThickness && <p style={{ fontSize: '13px', color: '#64748b' }}>Size: {item.selectedThickness}</p>}
                      <p className="cart-item-price">{formatPrice(itemPrice)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.selectedThickness, item.qty - 1)}>-</button>
                        <span>Qty: {item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedThickness, item.qty + 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id, item.selectedThickness)}>Remove</button>
                  </div>
                )
              })}
            </div>

            <div className="customer-form">
              <h2>Customer Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="address"
                    placeholder="Shipping Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="payment-options">
              <h2>Payment Method</h2>

              <div className="payment-methods">
                <button
                  className={`payment-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  Bank Transfer
                </button>
                <button
                  className={`payment-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  UPI Payment
                </button>
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Items:</span>
                  <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
                </div>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="order-summary-total">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? 'Processing Order...' : `Place Order (${formatPrice(total)})`}
              </button>

              {submitMessage && <p className="submit-message">{submitMessage}</p>}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

