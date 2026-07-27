import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  getAllProjects,
  saveProject,
  deleteProject,
  getAllOngoingProjects,
  saveOngoingProject,
  deleteOngoingProject
} from '../lib/firebaseDB'
import './admin.css'
import pr1 from '../images/pr1.png'
import pr2 from '../images/pr2.jpg'
import pr3 from '../images/pr3.jpg'
import pr4 from '../images/pr4.jpg'
import pr5 from '../images/pr5.png'
import pr6 from '../images/pr6.jpg'
import pr7 from '../images/pr7.png'
import pr9 from '../images/pr9.png'
import pr10 from '../images/pr10.png'
import pr11 from '../images/pr11.jpg'
import pr12 from '../images/pr12.png'
import pr13 from '../images/pr13.jpg'
import pr14 from '../images/pr14.png'
import pr15 from '../images/pr15.png'
import assoImg from '../images/assonew.png'

const ADMIN_PASSWORD = 'Satyam@ab82'
const MAX_IMAGE_SIDE = 1000
const IMAGE_JPEG_QUALITY = 0.75

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = dataUrl
  })
}

function fileFromDataUrl(dataUrl, fileName) {
  return fetch(dataUrl)
    .then(res => res.blob())
    .then(blob => new File([blob], fileName, { type: 'image/jpeg' }))
}

function fileToDataUrl(file) {
  return readFileAsDataUrl(file)
}

async function compressImageFile(file) {
  if (!file.type.startsWith('image/')) return file

  const dataUrl = await readFileAsDataUrl(file)
  const img = await loadImage(dataUrl)
  const longestSide = Math.max(img.width, img.height)
  const scale = longestSide > MAX_IMAGE_SIDE ? MAX_IMAGE_SIDE / longestSide : 1

  if (scale === 1 && file.size < 300 * 1024) return file

  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context.drawImage(img, 0, 0, width, height)

  const compressedDataUrl = canvas.toDataURL('image/jpeg', IMAGE_JPEG_QUALITY)
  return fileFromDataUrl(compressedDataUrl, file.name.replace(/\.[^.]+$/, '.jpg'))
}

const createProjectId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return Date.now().toString()
}

const normalizeProjectList = (data, fallback) => {
  if (!data || data.length === 0) return fallback
  if (data.length >= fallback.length) return data
  const fallbackIds = new Set(fallback.map(item => String(item.id)))
  return [
    ...fallback,
    ...data.filter(item => !fallbackIds.has(String(item.id)))
  ]
}

const defaultCompletedProjects = [
  { id: 'p1',  name: 'HTC Haryana Tourism',          tag: 'Tourism',       img: pr1  },
  { id: 'p2',  name: 'Phaphamau Railway Station',     tag: 'Railways',      img: pr2  },
  { id: 'p3',  name: 'Ambala Railway Station',        tag: 'Railways',      img: pr3  },
  { id: 'p4',  name: 'Saharanpur Railway Station',    tag: 'Railways',      img: pr4  },
  { id: 'p5',  name: 'WCR Guna Railway Station',      tag: 'Railways',      img: pr5  },
  { id: 'p6',  name: 'Varanasi Railway Station',      tag: 'Railways',      img: pr6  },
  { id: 'p7',  name: 'Sultanpur Railway Station',     tag: 'Railways',      img: pr7  },
  { id: 'p8',  name: 'Ayodhya DRM Office',            tag: 'Railways',      img: pr9  },
  { id: 'p9',  name: 'Supreme Court of India',        tag: 'Government',    img: pr10 },
  { id: 'p10', name: 'Kapurthala Railcoach Factory',  tag: 'Manufacturing', img: pr11 },
  { id: 'p11', name: 'DMRC',                          tag: 'Metro',         img: pr12 },
  { id: 'p12', name: 'MMRC',                          tag: 'Metro',         img: pr13 },
  { id: 'p13', name: 'NDLS',                          tag: 'Railways',      img: pr14 },
  { id: 'p14', name: 'Chandigarh Railway Station',    tag: 'Railways',      img: pr15 },
  { id: 'p15', name: 'Bikaner-Hisar Railway Station', tag: 'Railways',      img: pr2  },
]

const defaultOngoingProjects = [
  { id: 'o1', name: 'Prayagraj Division',         tag: 'Railways', img: pr2,    note: 'Site inspection in progress' },
  { id: 'o2', name: 'Fatehpur Railway Station',   tag: 'Railways', img: pr3,    note: 'Construction ongoing' },
  { id: 'o3', name: 'Manikpur Railway Station',   tag: 'Railways', img: pr4,    note: 'On schedule' },
  { id: 'o4', name: 'Prayagraj Central Hospital', tag: 'Hospital', img: pr2,    note: 'Renovation in progress' },
  { id: 'o5', name: 'GM Office',                  tag: 'Office',   img: pr7,    note: 'Furniture installation' },
  { id: 'o6', name: 'Assotech The Nest',          tag: 'Society',  img: assoImg,note: 'Interior work ongoing' },
]

export default function ProjectsAdmin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('completed')
  const [projects, setProjects] = useState([])
  const [ongoingProjects, setOngoingProjects] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({
    name: '',
    tag: '',
    img: '',
    note: ''
  })

  const loadAll = useCallback(async () => {
    try {
      const p = await getAllProjects()
      const projectsWithImages = normalizeProjectList(p, defaultCompletedProjects).map(item => ({
        ...item,
        img: item.img || item.image || pr1
      }))
      setProjects(projectsWithImages)
    } catch (err) {
      console.error('Error loading completed projects:', err)
      setProjects(defaultCompletedProjects)
    }
    try {
      const o = await getAllOngoingProjects()
      const ongoingWithImages = normalizeProjectList(o, defaultOngoingProjects).map(item => ({
        ...item,
        img: item.img || item.image || pr2
      }))
      setOngoingProjects(ongoingWithImages)
    } catch (err) {
      console.error('Error loading ongoing projects:', err)
      setOngoingProjects(defaultOngoingProjects)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll()
  }, [loadAll])

  const resetForm = useCallback(() => {
    setForm({ name: '', tag: '', img: '', note: '' })
    setEditingId(null)
    setSaveMessage('')
    setSaveError('')
  }, [])

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    setSaveMessage('')
    setSaveError('')
    try {
      const compressedFile = await compressImageFile(file)
      const url = await fileToDataUrl(compressedFile)
      setForm(prev => ({ ...prev, img: url }))
    } catch (err) {
      alert('Image upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploadingImage(false)
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      setSaveError('Name is required')
      setSaveMessage('')
      return
    }
    if (uploadingImage) {
      setSaveError('Please wait for the image to finish preparing')
      setSaveMessage('')
      return
    }
    if (!form.img.trim()) {
      setSaveError('Image is required')
      setSaveMessage('')
      return
    }
    setSaving(true)
    setSaveMessage('')
    setSaveError('')
    try {
      const payload = {
        ...form,
        id: editingId || createProjectId()
      }
      let saved
      if (tab === 'completed') {
        saved = await saveProject(payload)
        setProjects(prev => {
          const index = prev.findIndex(item => String(item.id) === String(saved.id))
          if (index >= 0) {
            return prev.map(item => String(item.id) === String(saved.id) ? saved : item)
          }
          return [...prev, saved]
        })
      } else if (tab === 'ongoing') {
        saved = await saveOngoingProject(payload)
        setOngoingProjects(prev => {
          const index = prev.findIndex(item => String(item.id) === String(saved.id))
          if (index >= 0) {
            return prev.map(item => String(item.id) === String(saved.id) ? saved : item)
          }
          return [...prev, saved]
        })
      }
      loadAll()
      resetForm()
      setSaveMessage(`${tab === 'ongoing' ? 'Ongoing project' : 'Completed project'} saved successfully.`)
    } catch (err) {
      setSaveError('Save failed: ' + (err.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }, [form, editingId, tab, loadAll, resetForm, uploadingImage])

  const handleEdit = useCallback((item) => {
    setForm({
      name: item.name || '',
      tag: item.tag || '',
      img: item.img || item.image || '',
      note: item.note || ''
    })
    setEditingId(item.id)
    setSaveMessage('')
    setSaveError('')
  }, [])

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this item?')) return
    try {
      if (tab === 'completed') await deleteProject(id)
      else if (tab === 'ongoing') await deleteOngoingProject(id)
      await loadAll()
    } catch (err) {
      window.alert('Delete failed: ' + (err.message || 'Unknown error'))
    }
  }, [tab, loadAll])

  const handleMarkCompleted = useCallback(async (item) => {
    if (!window.confirm('Mark this project as completed?')) return
    try {
      const completedProject = {
        ...item,
        id: item.id || createProjectId()
      }
      await saveProject(completedProject)
      await deleteOngoingProject(item.id)
      await loadAll()
    } catch (err) {
      window.alert('Failed: ' + (err.message || 'Unknown error'))
    }
  }, [loadAll])

  const [authError, setAuthError] = useState('')
  const [showList, setShowList] = useState(true)

  if (!authenticated) {
    return (
      <div className="admin-wrapper">
        <div className="admin-container">
          <h1>Projects Admin</h1>
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
                >
                  {showPassword ? '👁️' : '👁️\u200d🗨️'}
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
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    )
  }

  const currentList = tab === 'ongoing' ? ongoingProjects : projects

  return (
    <div className="admin-wrapper">
      <div className="admin-container admin-container--wide">
        <h1>Projects Admin</h1>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'completed' ? 'active' : ''}`}
            onClick={() => { setTab('completed'); resetForm() }}
          >
            Completed Projects ({projects.length})
          </button>
          <button
            className={`admin-tab ${tab === 'ongoing' ? 'active' : ''}`}
            onClick={() => { setTab('ongoing'); resetForm() }}
          >
            Ongoing Projects ({ongoingProjects.length})
          </button>
        </div>

        <div className="admin-form">
          <h2>{editingId ? 'Edit' : 'Add New'} {tab === 'ongoing' ? 'Ongoing Project' : 'Completed Project'}</h2>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Project name"
            />
          </div>

          <div className="form-group">
            <label>Tag</label>
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
              <option value="">Select tag</option>
              <option value="Railways">Railways</option>
              <option value="Metro">Metro</option>
              <option value="Hospital">Hospital</option>
              <option value="Office">Office</option>
              <option value="Society">Society</option>
              <option value="Tourism">Tourism</option>
              <option value="Government">Government</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {form.img && (
              <div style={{ marginTop: '8px' }}>
                <img src={form.img} alt="Preview" className="img-preview" style={{ maxHeight: '120px' }} />
                <br />
                <span style={{ fontSize: '12px', color: '#666' }}>{form.img}</span>
              </div>
            )}
            {!form.img && (
              <input
                type="text"
                value={form.img}
                onChange={(e) => setForm({ ...form, img: e.target.value })}
                placeholder="Or paste image URL *"
                style={{ marginTop: '8px' }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="e.g. In progress, On schedule"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className="save-btn" onClick={handleSave} disabled={saving || uploadingImage}>
              {saving ? 'Saving...' : uploadingImage ? 'Preparing image...' : editingId ? 'Update' : 'Save'}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
            )}
          </div>
          {saveMessage && <p style={{ color: '#16a34a', marginTop: '12px', fontWeight: 600 }}>{saveMessage}</p>}
          {saveError && <p className="error-message" style={{ marginTop: '12px' }}>{saveError}</p>}
          {uploadingImage && <p style={{ color: '#64748b', marginTop: '12px' }}>Preparing image, please wait...</p>}
        </div>

        <div className="admin-list">
          <h2 className="list-header" onClick={() => setShowList(!showList)} style={{ cursor: 'pointer' }}>
            {tab === 'ongoing' ? 'Ongoing Projects' : 'Completed Projects'} ({currentList.length})
            <span className={`dropdown-arrow ${showList ? 'open' : ''}`}>▼</span>
          </h2>
          {showList && (
            <div className="list-items">
              {currentList.map((item, i) => (
                <div key={item.id || i} className="list-item" style={{ alignItems: 'flex-start', padding: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                    {item.tag && <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '10px', marginRight: '6px' }}>{item.tag}</span>}
                    {item.note && <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Note: {item.note}</div>}
                    <img src={item.img || item.image || pr1} alt={item.name} style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button type="button" className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button type="button" className="reject-btn" onClick={() => handleDelete(item.id)} style={{ fontSize: '12px' }}>Delete</button>
                    {tab === 'ongoing' && (
                      <button
                        type="button"
                        className="confirm-payment-btn"
                        onClick={() => handleMarkCompleted(item)}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        ✓ Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {currentList.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <p>No {tab === 'ongoing' ? 'ongoing' : 'completed'} projects yet. Add one above.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Link to="/" className="back-link" style={{ marginTop: '20px', display: 'inline-block' }}>← Back to Home</Link>
      </div>
    </div>
  )
}