import { useState, useEffect, useRef } from 'react'
import { loadAnnouncements, saveAllAnnouncements } from '../data/announcementsUtils'
import './admin.css'

// const ADMIN_PASSWORD = 'Satyam@ab82'
const ADMIN_PASSWORD = 'Abcde@123'
export default function AnnouncementsAdmin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [showList, setShowList] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    img: '',
    imgPreview: '',
    description: ''
  })
  const saveInProgress = useRef(false)

  useEffect(() => {
    loadAnnouncements().then(data => {
      if (data && data.length > 0) {
        setAnnouncements(data)
      }
    })
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const compressed = await compressImage(file, 800, 0.7)
    setFormData(prev => ({ ...prev, img: compressed, imgPreview: compressed }))
  }

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.src = ev.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const generateId = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const save = async () => {
    if (!formData.title || !formData.description || saveInProgress.current) return
    saveInProgress.current = true

    const now = new Date().getTime()
    const newAnnouncement = {
      id: generateId(formData.title) + '-' + now,
      title: formData.title,
      img: formData.img || '',
      description: formData.description,
      created_at: now

    }

    const updated = editingIndex !== null
      ? [...announcements.slice(0, editingIndex), newAnnouncement, ...announcements.slice(editingIndex + 1)]
      : [...announcements, newAnnouncement]

    setAnnouncements(updated)
    await saveAllAnnouncements(updated)
    resetForm()
    saveInProgress.current = false
  }

  const resetForm = () => {
    setFormData({ title: '', img: '', imgPreview: '', description: '' })
    setEditingIndex(null)
  }

  const editItem = (index) => {
    const item = announcements[index]
    setFormData({
      title: item.title,
      img: item.img || '',
      imgPreview: item.img || '',
      description: item.description
    })
    setEditingIndex(index)
  }

  const deleteItem = async (index) => {
    if (window.confirm('Delete this announcement?')) {
      const updated = announcements.filter((_, i) => i !== index)
      setAnnouncements(updated)
      await saveAllAnnouncements(updated)
    }
  }

  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (!authenticated) {
    return (
      <div className="admin-wrapper">
        <div className="admin-container">
          <h1>Announcements Admin</h1>
          <div className="admin-form">
            <h2>Enter Password</h2>
            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  className={`toggle-password ${showPassword ? 'active' : ''}`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 2.16M15 12a3 3 0 1 1-4.08-2.58M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11-8 11-8 11 8" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button className="save-btn" onClick={() => {
              if (password === ADMIN_PASSWORD) {
                setAuthenticated(true)
                setAuthError('')
              } else {
                setAuthError('Incorrect password')
                setPassword('')
              }
            }}>
              Login
            </button>
            {authError && <p className="error-message" style={{ marginTop: '8px' }}>{authError}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <h1>Announcements Admin</h1>

        <div className="admin-form">
          <h2>{editingIndex !== null ? 'Edit Announcement' : 'Add New Announcement'}</h2>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter announcement title"
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.imgPreview && (
              <img src={formData.imgPreview} alt="Preview" className="img-preview" />
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter announcement description"
              rows="3"
            />
          </div>

          <button className="save-btn" onClick={save}>
            {editingIndex !== null ? 'Update' : 'Save'}
          </button>
          {editingIndex !== null && (
            <button className="cancel-btn" onClick={resetForm}>Cancel</button>
          )}
        </div>

        <div className="admin-list">
          <h2 onClick={() => setShowList(!showList)} className="list-header">
            Current Announcements ({announcements.length})
            <span className={`dropdown-arrow ${showList ? 'open' : ''}`}>▼</span>
          </h2>
          {showList && (
            <div className="list-items">
              {announcements.map((item, i) => (
                <div key={i} className="list-item" style={{ alignItems: 'flex-start', padding: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</div>
                    {item.img && (
                      <img src={item.img} alt={item.title} style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' }} />
                    )}
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{item.description}</div>
                  </div>
                  <div>
                    <button onClick={() => editItem(i)}>Edit</button>
                    <button onClick={() => deleteItem(i)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}