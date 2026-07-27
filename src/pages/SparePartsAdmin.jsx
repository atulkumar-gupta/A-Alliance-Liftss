import { useState, useEffect } from 'react'
import { loadSpareParts } from '../data/sparepartsUtils'
import { saveSparePart, deleteSparePart } from '../lib/firebaseDB'
import './admin.css'

const defaultSpareParts = [
  {
    id: 'bottom-plengths',
    name: 'Bottom Plengths',
    img: 'part1.png',
    description: 'High-quality bottom plengths and top corona bars for elevator assembly.',
    features: [
      'Durable construction for long service life',
      'Stable mounting for smooth assembly',
      'Designed for elevator component alignment',
      'Used in assembly applications across models',
      'High tensile strength for durability',
      'Corrosion-resistant coating available'
    ],
    specs: [
      { label: 'Material', value: 'Mild Steel (MS) / Structural Steel' },
      { label: 'Thickness', value: '3 mm – 8 mm' },
      { label: 'Width', value: '600 mm – 2500 mm' },
      { label: 'Length', value: '800 mm – 3000 mm' },
      { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Paint' },
      { label: 'Load Capacity', value: '320 kg – 2000 kg+' },
      { label: 'Frame Type', value: 'Welded Reinforced Structure' }
    ]
  },
  {
    id: 'full-vision-glass-doors',
    name: 'Full Vision Glass Doors',
    img: 'part2.png',
    description: 'Premium glass doors for modern elevator aesthetics and safety.',
    features: [
      'Clear vision for modern cabin feel',
      'Safety-oriented door design',
      'Reliable opening/closing performance',
      'Compatible with elevator door systems',
      'Tempered glass for safety',
      'Available in various tints and thicknesses'
    ],
    specs: [
      { label: 'Glass Thickness', value: '8 mm – 12 mm Tempered Safety Glass' },
      { label: 'Door Opening Type', value: 'Center Opening / Side Opening' },
      { label: 'Opening Width', value: '700 mm – 1400 mm' },
      { label: 'Door Height', value: '2000 mm – 2400 mm' },
      { label: 'Frame Material', value: 'SS 304 Stainless Steel' },
      { label: 'Finish Options', value: 'Hairline, Mirror, Gold PVD, Black Titanium' },
      { label: 'Application', value: 'Passenger, Home, Commercial & Panoramic Elevators' }
    ]
  },
  {
    id: 'over-speed-governors',
    name: 'Over Speed Governors',
    img: 'part3.png',
    description: 'Advanced safety governors for elevator speed control.',
    features: [
      'Safety governor for overspeed protection',
      'Precision control for elevator operation',
      'Designed for dependable emergency action',
      'High-performance safety component',
      'Mechanical speed sensing',
      'Fail-safe design'
    ],
    specs: [
      { label: 'Governor Speed Range', value: '0.5 m/s – 4.0 m/s' },
      { label: 'Governor Wheel Diameter', value: '200 mm – 600 mm' },
      { label: 'Rope Diameter Compatibility', value: '6 mm – 10 mm Steel Rope' },
      { label: 'Triggering Accuracy', value: '±5% of Rated Speed' },
      { label: 'Material', value: 'High-Strength Cast Iron / Steel Construction' },
      { label: 'Mounting Type', value: 'Machine Room & Machine Room-Less (MRL) Compatible' },
      { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
    ]
  },
  {
    id: 'combination-brackets',
    name: 'Combination Brackets',
    img: 'part4.png',
    description: 'Durable brackets for elevator component mounting.',
    features: [
      'Strong mounting for key components',
      'Helps maintain component alignment',
      'Suitable for repeated service operations',
      'Built for mechanical stability',
      'Easy to install and replace',
      'Available in various sizes'
    ],
    specs: [
      { label: 'Material', value: 'High-Grade Mild Steel (MS) / Structural Steel' },
      { label: 'Thickness', value: '6 mm – 12 mm' },
      { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Coating' },
      { label: 'Load Capacity', value: 'Suitable for Light to Heavy-Duty Elevator Installations' },
      { label: 'Mounting Type', value: 'Bolted or Welded Installation' },
      { label: 'Compatibility', value: 'T-Guide Rails, Counterweight & Cabin Systems' },
      { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
    ]
  },
  {
    id: 'car-frames',
    name: 'Car Frames',
    img: 'part5.png',
    description: 'Robust car frames engineered for safe and reliable elevator cabin support.',
    features: [
      'Structural frame support for elevator cabins',
      'Stable geometry for consistent installation',
      'Designed for durability and strength',
      'Supports smooth cabin assembly',
      'Precision engineered for alignment',
      'Available in standard and custom sizes'
    ],
    specs: [
      { label: 'Material', value: 'High-Strength Mild Steel (MS) / Structural Steel' },
      { label: 'Load Capacity', value: '320 kg – 3000 kg+' },
      { label: 'Frame Thickness', value: '6 mm – 16 mm' },
      { label: 'Construction Type', value: 'Welded Reinforced Frame Structure' },
      { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Paint' },
      { label: 'Compliance', value: 'ISO 9001' },
      { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
    ]
  },
  {
    id: 'buffer-springs',
    name: 'Buffer Springs',
    img: 'bufferspring.png',
    description: 'High-performance buffer springs for elevator safety systems.',
    features: [
      'Energy absorption for safety operation',
      'Stable performance under load',
      'Reliable safety component',
      'Designed for elevator buffer system compatibility',
      'Long service life',
      'Consistent performance characteristics'
    ],
    specs: [
      { label: 'Material', value: 'High-Grade Spring Steel' },
      { label: 'Load Capacity', value: '320 kg – 3000 kg+' },
      { label: 'Spring Diameter', value: '80 mm – 250 mm' },
      { label: 'Spring Height', value: '100 mm – 500 mm' },
      { label: 'Compression Strength', value: 'Designed for High Impact Energy Absorption' },
      { label: 'Surface Finish', value: 'Anti-Corrosion Coated / Powder Coated' },
      { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
    ]
  },
  {
    id: 'machine-bases',
    name: 'Machine Bases',
    img: 'machinebase.png',
    description: 'Robust machine bases for elevator motor installation.',
    features: [
      'Stable support for elevator machinery',
      'Helps reduce vibration for smooth operation',
      'Designed for secure installation',
      'Durable construction for long-term use',
      'Precision machined for alignment',
      'Available in various configurations'
    ],
    specs: [
      { label: 'Material', value: 'Heavy-Duty Mild Steel (MS) / Structural Steel' },
      { label: 'Load Capacity', value: 'Suitable for Machines up to 5000 kg+' },
      { label: 'Thickness', value: '8 mm – 20 mm' },
      { label: 'Construction Type', value: 'Welded Reinforced Steel Structure' },
      { label: 'Vibration Control', value: 'Compatible with Anti-Vibration Pads & Mounts' },
      { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' },
      { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Paint' }
    ]
  },
  {
    id: 'rope-thimbles',
    name: 'Rope Thimbles',
    img: 'ropethimbles.png',
    description: 'Precision rope thimbles for elevator hoisting systems.',
    features: [
      'Precision component for hoisting systems',
      'Reliable rope interface performance',
      'Supports smooth lift operation',
      'Built for durability and stability',
      'Corrosion resistant',
      'Easy to install'
    ],
    specs: [
      { label: 'Material', value: 'Forged Steel / Galvanized Steel' },
      { label: 'Rope Compatibility', value: '6 mm – 16 mm Steel Wire Ropes' },
      { label: 'Construction Type', value: 'Heavy-Duty Reinforced Design' },
      { label: 'Surface Finish', value: 'Galvanized / Zinc-Coated for Corrosion Resistance' },
      { label: 'Load Capacity', value: 'Suitable for Elevator Suspension Applications' },
      { label: 'Wear Protection', value: 'Prevents Rope Bending and Abrasion at Loop Ends' },
      { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
    ]
  },
  {
    id: 'swing-doors',
    name: 'Swing Doors',
    img: 'swingdoor.png',
    description: 'Modern swing doors designed for secure and convenient elevator cabin access.',
    features: [
      'Door system designed for stable operation',
      'Supports smooth cabin entry and exit',
      'Safety-focused door performance',
      'Compatible with common elevator setups',
      'Available in various finishes',
      'Easy maintenance'
    ],
    specs: [
      { label: 'Door Material', value: 'Mild Steel (MS) / Stainless Steel (SS 304)' },
      { label: 'Door Width', value: '700 mm – 1200 mm' },
      { label: 'Door Height', value: '2000 mm – 2400 mm' },
      { label: 'Panel Thickness', value: '1.2 mm – 2.0 mm' },
      { label: 'Finish Options', value: 'Powder Coated, Hairline, Mirror Finish, Gold PVD' },
      { label: 'Opening Type', value: 'Single Leaf / Double Leaf Manual Operation' },
      { label: 'Application', value: 'Home, Passenger, Hospital & Goods Elevators' }
    ]
  }
]

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

function stripAdminOnlyFields(part) {
  return {
    id: part.id,
    name: part.name,
    img: part.img,
    description: part.description,
    features: part.features,
    specs: part.specs
  }
}

function featuresToArray(value) {
  return value.split('\n').map(item => item.trim()).filter(Boolean)
}

function specsToArray(value) {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const [label, ...rest] = item.split(':')
      return { label: label.trim(), value: rest.join(':').trim() }
    })
}

function specsToString(specs) {
  return (specs || []).map(item => `${item.label}: ${item.value}`).join('\n')
}

function normalizeSpareParts(data, fallback) {
  if (!data || data.length === 0) return fallback

  const fallbackIds = new Set(fallback.map(item => String(item.id)))
  const dataIds = new Set(data.map(item => String(item.id)))
  const missingFallbacks = fallback.filter(item => !dataIds.has(String(item.id)))
  const newItems = data.filter(item => !fallbackIds.has(String(item.id)))

  if (missingFallbacks.length > 0) {
    return [...missingFallbacks, ...newItems]
  }

  return data
}

export default function SparePartsAdmin() {
  const [spareParts, setSpareParts] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [showSparePartsList, setShowSparePartsList] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    img: '',
    imgPreview: '',
    description: '',
    features: '',
    specs: ''
  })

  useEffect(() => {
    loadSpareParts()
      .then(data => setSpareParts(normalizeSpareParts(data, defaultSpareParts).map(stripAdminOnlyFields)))
      .catch(err => {
        console.error('Failed to load spare parts:', err)
        setSpareParts(defaultSpareParts.map(stripAdminOnlyFields))
      })
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    setError('')
    try {
      const compressedFile = await compressImageFile(file)
      const dataUrl = await readFileAsDataUrl(compressedFile)
      setFormData(prev => ({ ...prev, img: dataUrl, imgPreview: dataUrl }))
    } catch (err) {
      setError('Image upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploadingImage(false)
    }
  }

  const generateId = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const save = async () => {
    setError('')
    setMessage('')

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.img.trim()) {
      setError('Image is required')
      return
    }
    if (uploadingImage) {
      setError('Please wait for the image to finish preparing')
      return
    }

    const newPart = {
      id: editingIndex !== null ? spareParts[editingIndex].id : generateId(formData.name),
      name: formData.name.trim(),
      img: formData.img,
      description: formData.description.trim(),
      features: featuresToArray(formData.features),
      specs: specsToArray(formData.specs)
    }

    try {
      if (editingIndex !== null) {
        setSpareParts(prev => prev.map((part, index) => index === editingIndex ? newPart : part))
      } else {
        setSpareParts(prev => [...prev, newPart])
      }

      await saveSparePart(newPart)
      resetForm()
      setMessage('Spare part saved successfully.')
    } catch (err) {
      setError('Save failed: ' + (err.message || 'Unknown error'))
    }
  }

  const resetForm = () => {
    setFormData({ name: '', img: '', imgPreview: '', description: '', features: '', specs: '' })
    setEditingIndex(null)
    setError('')
    setMessage('')
  }

  const editPart = (index) => {
    const part = spareParts[index]
    setFormData({
      name: part.name,
      img: part.img,
      imgPreview: part.img,
      description: part.description || '',
      features: (part.features || []).join('\n'),
      specs: specsToString(part.specs)
    })
    setEditingIndex(index)
    setError('')
    setMessage('')
  }

  const deletePart = async (index) => {
    if (!window.confirm('Delete this spare part?')) return
    const part = spareParts[index]

    try {
      setSpareParts(prev => prev.filter((_, i) => i !== index))
      await deleteSparePart(part.id)
      if (editingIndex === index) resetForm()
      setMessage('Spare part deleted successfully.')
    } catch (err) {
      setError('Delete failed: ' + (err.message || 'Unknown error'))
    }
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <h1>Spare Parts Admin</h1>

        <div className="admin-form">
          <h2>{editingIndex !== null ? 'Edit Spare Part' : 'Add New Spare Part'}</h2>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Spare part name"
            />
          </div>

          <div className="form-group">
            <label>Image *</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            {formData.imgPreview && <img src={formData.imgPreview} alt="Preview" className="img-preview" />}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              placeholder="Short description"
            />
          </div>

          <div className="form-group">
            <label>Features (one per line)</label>
            <textarea
              value={formData.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
              rows="4"
              placeholder="Durable construction&#10;Stable mounting&#10;High tensile strength"
            />
          </div>

          <div className="form-group">
            <label>Specs (label: value per line)</label>
            <textarea
              value={formData.specs}
              onChange={(e) => handleInputChange('specs', e.target.value)}
              rows="4"
              placeholder="Material: Mild Steel&#10;Thickness: 3 mm – 8 mm"
            />
          </div>

          {message && <p style={{ color: '#16a34a', marginTop: '12px', fontWeight: 600 }}>{message}</p>}
          {error && <p className="error-message" style={{ marginTop: '12px' }}>{error}</p>}
          {uploadingImage && <p style={{ color: '#64748b', marginTop: '12px' }}>Preparing image, please wait...</p>}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <button type="button" className="save-btn" onClick={save} disabled={uploadingImage}>
              {editingIndex !== null ? 'Update' : 'Save'}
            </button>
            {editingIndex !== null && <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>}
          </div>
        </div>

        <div className="admin-list">
          <h2 onClick={() => setShowSparePartsList(!showSparePartsList)} className="list-header">
            Current Spare Parts ({spareParts.length})
            <span className={`dropdown-arrow ${showSparePartsList ? 'open' : ''}`}>▼</span>
          </h2>
          {showSparePartsList && (
            <div className="list-items">
              {spareParts.map((part, i) => (
                <div key={part.id || i} className="list-item">
                  <span>{part.name}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => editPart(i)}>Edit</button>
                    <button type="button" onClick={() => deletePart(i)}>Delete</button>
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
