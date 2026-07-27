import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'
import './profile.css'
import Footer from '../components/Footer.jsx'

export default function Profile() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    address: '',
    phone: ''
  })

const getProfileExtra = () => {
    try {
      const raw = localStorage.getItem('alliance_profile_extra')
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  }

  const [saving, setSaving] = useState(false)

  const handleEditClick = () => {
    const extra = getProfileExtra()
    if (user) {
      setEditData({
        name: user.displayName || '',
        address: extra.address || '',
        phone: extra.phone || ''
      })
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: editData.name
        })
      }
      try {
        localStorage.setItem('alliance_profile_extra', JSON.stringify({
          phone: editData.phone,
          address: editData.address
        }))
      } catch (storageError) {
        console.warn('Failed to save profile extras:', storageError)
      }
      setIsEditing(false)
    } catch (err) {
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'
  }

  if (!user) {
    return (
      <div className="profile-wrapper">
        <div className="profile-content">
          <div className="profile-container">
            <h1>Your Profile</h1>
            <p style={{ textAlign: 'center' }}>Please <Link to="/login">login</Link> to view your profile.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-content">
        <div className="profile-container">
          <h1>Your Profile</h1>
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">{getInitials(user.displayName)}</div>
              <h2>{user.displayName || user.email?.split('@')[0]}</h2>
              <p>{user.email}</p>
            </div>

            <div className="profile-fields">
              {isEditing ? (
                <>
                  <div className="profile-field">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div className="profile-field">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      rows="3"
                    />
                  </div>
                  <div className="profile-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div className="profile-info-list">
                  <div className="profile-info-item">
                    <strong>Full Name</strong>
                    <span>{user.displayName || user.email?.split('@')[0] || 'Not provided'}</span>
                  </div>
                  <div className="profile-info-item">
                    <strong>Email Address</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="profile-info-item">
                    <strong>Address</strong>
                    <span>{getProfileExtra().address || 'Not provided'}</span>
                  </div>
                  <div className="profile-info-item">
                    <strong>Phone Number</strong>
                    <span>{getProfileExtra().phone || 'Not provided'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="profile-btn" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="profile-btn secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="profile-btn" onClick={handleEditClick}>Edit Profile</button>
                  <button className="profile-btn secondary" onClick={logout}>Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
