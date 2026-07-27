import { useState, useEffect, useCallback } from 'react'
import { getAll, insert, update, remove } from '../lib/firebaseDB'
import './offeradmin.css'

// const ADMIN_PASSWORD = 'Satyam@ab82'
const ADMIN_PASSWORD = 'Abcde@123'
const defaultOffers = [
  {
    id: 'welcome10',
    code: 'WELCOME10',
    title: 'Welcome Discount',
    description: 'Get 10% off on your first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 500,
    maxDiscount: 200,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    usageLimit: 1
  }
]

export default function AdminOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrder: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: ''
  })

  const loadOffers = useCallback(async () => {
    const stored = localStorage.getItem('offers')
    if (stored) {
      try {
        setOffers(JSON.parse(stored))
        setLoading(false)
        return
      } catch (e) {
        console.error('Failed to parse offers from localStorage:', e)
      }
    }
    try {
      const data = await getAll('offers')
      setOffers(data || defaultOffers)
      localStorage.setItem('offers', JSON.stringify(data || defaultOffers))
    } catch (e) {
      console.error('Failed to load offers:', e)
      setOffers(defaultOffers)
    } finally {
      setLoading(false)
    }
  }, [setOffers, setLoading])

  useEffect(() => {
     if (authenticated) {
      setTimeout(() => {
        loadOffers()
      }, 0)
    }
  }, [authenticated, loadOffers])


  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError('')
      setPassword('')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }


  const resetForm = () => {
    setForm({
      code: '', title: '', description: '', discountType: 'percentage',
      discountValue: '', minOrder: '', maxDiscount: '', startDate: '',
      endDate: '', isActive: true, usageLimit: ''
    })
    setEditingId(null)
  }

  const handleEdit = (offer) => {
    setEditingId(offer.id)
    setForm({
      code: offer.code || '',
      title: offer.title || '',
      description: offer.description || '',
      discountType: offer.discountType || 'percentage',
      discountValue: offer.discountValue?.toString() || '',
      minOrder: offer.minOrder?.toString() || '',
      maxDiscount: offer.maxDiscount?.toString() || '',
      startDate: offer.startDate?.split('T')[0] || '',
      endDate: offer.endDate?.split('T')[0] || '',
      isActive: offer.isActive ?? true,
      usageLimit: offer.usageLimit?.toString() || ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.code || !form.title || !form.discountValue) {
      setError('Code, title and discount value are required')
      return
    }

    setSavingId(form.code)
    const offerData = {
      ...form,
      discountValue: parseFloat(form.discountValue) || 0,
      minOrder: parseFloat(form.minOrder) || 0,
      maxDiscount: parseFloat(form.maxDiscount) || 0,
      usageLimit: parseInt(form.usageLimit) || 0,
      id: editingId || form.code.toUpperCase().replace(/\s+/g, '_')
    }

    let updated
    if (editingId) {
      updated = offers.map(o => o.id === editingId ? offerData : o)
    } else {
      updated = [...offers, offerData]
    }
    setOffers(updated)
    localStorage.setItem('offers', JSON.stringify(updated))

    try {
      if (editingId) {
        await update('offers', editingId, offerData)
      } else {
        await insert('offers', offerData)
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSavingId(null)
      resetForm()
    }
  }

  const deleteOffer = async (id) => {
    if (!window.confirm('Delete this offer?')) return
    const updated = offers.filter(o => o.id !== id)
    setOffers(updated)
    localStorage.setItem('offers', JSON.stringify(updated))
    try {
      await remove('offers', id)
    } catch (err) {
      console.error('Delete error:', err)
    }
    if (editingId === id) resetForm()
  }

  const toggleActive = async (offer) => {
    const updated = { ...offer, isActive: !offer.isActive }
    const newList = offers.map(o => o.id === offer.id ? updated : o)
    setOffers(newList)
    localStorage.setItem('offers', JSON.stringify(newList))
    try {
      await update('offers', offer.id, { isActive: updated.isActive })
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  if (!authenticated) {
    return (
      <div className="offers-wrapper">
        <div className="offers-container">
          <div className="offer-form">
            <div className="offer-header">
              <h1>🏷️ Offers Admin</h1>
              <p>Enter admin password to manage discount offers</p>
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
              <button type="submit" className="save-btn">Access Admin</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="offers-wrapper">
        <div className="offers-container">
          <p>Loading offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="offers-wrapper">
      <div className="offers-container">
        <h1>🏷️ Offers Admin</h1>

        <div className="offer-form">
          <h2>{editingId ? 'Edit Offer' : 'Add New Offer'}</h2>
          {error && <p className="error-message" style={{ marginBottom: '16px' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Offer Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FLAT50"
                  disabled={!!editingId}
                />
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Flat ₹50 Off"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the offer"
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Discount Type</label>
                <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount Value *</label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder="e.g. 10 or 50"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Max Discount (₹)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  placeholder="e.g. 200"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Min Order (₹)</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  placeholder="e.g. 500"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Usage Limit (per user)</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  placeholder="0 = unlimited"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '600', color: '#071f4d', fontSize: '14px' }}>Status: </label>
              <button
                type="button"
                className={`active-toggle ${form.isActive ? 'on' : ''}`}
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
              />
              <span style={{ marginLeft: '8px', fontSize: '14px', color: form.isActive ? '#16a34a' : '#64748b' }}>
                {form.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="save-btn" disabled={savingId === form.code}>
                {savingId === form.code ? 'Saving...' : editingId ? 'Update Offer' : 'Add Offer'}
              </button>
              {editingId && (
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="offer-list">
          <h2>All Offers ({offers.length})</h2>
          {offers.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No offers yet. Add one above.</p>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-info">
                  <strong>{offer.title}</strong>
                  {offer.code && <div className="offer-code">{offer.code}</div>}
                  <div style={{ marginTop: '4px', fontSize: '13px', color: '#475569' }}>
                    {offer.description}
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="offer-discount">
                      {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                    </span>
                    {offer.minOrder > 0 && <span style={{ fontSize: '12px', color: '#64748b' }}>Min: ₹{offer.minOrder}</span>}
                    {offer.maxDiscount > 0 && <span style={{ fontSize: '12px', color: '#64748b' }}>Max: ₹{offer.maxDiscount}</span>}
                    <span style={{ 
                      fontSize: '12px', fontWeight: '600',
                      color: offer.isActive ? '#16a34a' : '#ef4444',
                      background: offer.isActive ? '#dcfce7' : '#fee2e2',
                      padding: '2px 8px', borderRadius: '12px'
                    }}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="offer-actions">
                  <button
                    className={`active-toggle ${offer.isActive ? 'on' : ''}`}
                    onClick={() => toggleActive(offer)}
                    title={offer.isActive ? 'Deactivate' : 'Activate'}
                  />
                  <button className="save-btn" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={() => handleEdit(offer)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteOffer(offer.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
