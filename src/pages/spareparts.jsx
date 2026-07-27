import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadSpareParts } from '../data/sparepartsUtils'
import img1 from '../images/part1.png'
import img2 from '../images/part2.png'
import img3 from '../images/part3.png'
import img4 from '../images/part4.png'
import img5 from '../images/part5.png'
import img6 from '../images/bufferspring.png'
import img7 from '../images/machinebase.png'
import img8 from '../images/ropethimbles.png'
import img9 from '../images/swingdoor.png'
import heroImg from '../images/sparemain.png'
import './spareparts.css'
import Footer from '../components/Footer.jsx'

const ADMIN_PASSWORD = 'Satyam@ab82'

const defaultSpareParts = [
  {
    id: 'bottom-plengths',
    name: 'Bottom Plengths',
    img: 'part1.png',
    description: 'High-quality bottom plengths and top corona bars for elevator assembly.',
    price: '250',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
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
      { label: 'Thickness', value: '6 mm - 8 mm' },
      { label: 'Width', value: '600 mm - 2500 mm' },
      { label: 'Length', value: '800 mm - 3000 mm' },
      { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Paint' },
      { label: 'Load Capacity', value: '320 kg - 2000 kg+' },
      { label: 'Frame Type', value: 'Welded Reinforced Structure' }
    ]
  },
  {
    id: 'full-vision-glass-doors',
    name: 'Full Vision Glass Doors',
    img: 'part2.png',
    description: 'Premium glass doors for modern elevator aesthetics and safety.',
    price: '450',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
    features: [
      'Clear vision for modern cabin feel',
      'Safety-oriented door design',
      'Reliable opening/closing performance',
      'Compatible with elevator door systems',
      'Tempered glass for safety',
      'Available in various tints and thicknesses'
    ],
    specs: [
      { label: 'Glass Thickness', value: '8 mm - 12 mm Tempered Safety Glass' },
      { label: 'Door Opening Type', value: 'Center Opening / Side Opening' },
      { label: 'Opening Width', value: '700 mm - 1400 mm' },
      { label: 'Door Height', value: '2000 mm - 2400 mm' },
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
    price: '380',
    pricing: [
      { thickness: 'Standard', minPrice: 380, maxPrice: 480 },
      { thickness: 'Heavy Duty', minPrice: 420, maxPrice: 550 }
    ],
    features: [
      'Safety governor for overspeed protection',
      'Precision control for elevator operation',
      'Designed for dependable emergency action',
      'High-performance safety component',
      'Mechanical speed sensing',
      'Fail-safe design'
    ],
    specs: [
      { label: 'Governor Speed Range', value: '0.5 m/s - 4.0 m/s' },
      { label: 'Governor Wheel Diameter', value: '200 mm - 600 mm' },
      { label: 'Rope Diameter Compatibility', value: '6 mm - 10 mm Steel Rope' },
      { label: 'Triggering Accuracy', value: '+/-5% of Rated Speed' },
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
    price: '180',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
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
      { label: 'Thickness', value: '6 mm - 12 mm' },
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
    price: '500',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
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
      { label: 'Load Capacity', value: '320 kg - 3000 kg+' },
      { label: 'Frame Thickness', value: '6 mm - 16 mm' },
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
    price: '220',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
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
      { label: 'Load Capacity', value: '320 kg - 3000 kg+' },
      { label: 'Spring Diameter', value: '80 mm - 250 mm' },
      { label: 'Spring Height', value: '100 mm - 500 mm' },
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
    price: '400',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
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
      { label: 'Thickness', value: '8 mm - 20 mm' },
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
    price: '199',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
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
      { label: 'Rope Compatibility', value: '6 mm - 16 mm Steel Wire Ropes' },
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
    price: '320',
    pricing: [
      { thickness: '6 mm', minPrice: 4000, maxPrice: 7000 },
      { thickness: '8 mm', minPrice: 4500, maxPrice: 8000 }
    ],
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
      { label: 'Door Width', value: '700 mm - 1200 mm' },
      { label: 'Door Height', value: '2000 mm - 2400 mm' },
      { label: 'Panel Thickness', value: '1.2 mm - 2.0 mm' },
      { label: 'Finish Options', value: 'Powder Coated, Hairline, Mirror Finish, Gold PVD' },
      { label: 'Opening Type', value: 'Single Leaf / Double Leaf Manual Operation' },
      { label: 'Application', value: 'Home, Passenger, Hospital & Goods Elevators' }
    ]
  }
]

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

const normalizeSpareParts = (data, fallback) => {
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

const features = [
  { icon: '🔧', label: 'Precision Parts' },
  { icon: '🛡️', label: 'Safety Certified' },
  { icon: '⚡', label: 'High Performance' },
  { icon: '🚀', label: 'Fast Delivery' }
]

const WHATSAPP_NUMBER = '919910589059'

export default function SpareParts() {
  const navigate = useNavigate()
  const [spareParts, setSpareParts] = useState(defaultSpareParts)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [enquiryPart, setEnquiryPart] = useState(null)
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [enquirySent, setEnquirySent] = useState(false)

  useEffect(() => {
    loadSpareParts().then(data => {
      setSpareParts(normalizeSpareParts(data, defaultSpareParts))
    })
  }, [])

  const handleEnquiry = () => {

    
    if (!enquiryForm.name || !enquiryForm.phone) {
      setError('Please enter your name and phone number')
      return
    }
    setError('')
    const part = enquiryPart
    let text = `*Spare Part Enquiry*\n`
    text += `Part: ${part.name}\n`
    text += `Description: ${part.description}\n`
    text += `\n*Customer Details*\n`
    text += `Name: ${enquiryForm.name}\n`
    text += `Phone: ${enquiryForm.phone}\n`
    if (enquiryForm.email) text += `Email: ${enquiryForm.email}\n`
    if (enquiryForm.message) text += `Message: ${enquiryForm.message}\n`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
    setEnquirySent(true)
  }

  const openEnquiry = (part) => {
    setEnquiryPart(part)
    setEnquiryForm({ name: '', phone: '', email: '', message: '' })
    setEnquirySent(false)
    setError('')
  }

  const closeEnquiry = () => {
    setEnquiryPart(null)
    setError('')
  }

  const handleAdminClick = () => {
    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false)
      setPassword('')
      setError('')
      navigate('/admin/spareparts')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  const smallRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const heroImageRef = useRef(null)
  const featuredSmallRef = useRef(null)
  const featuredTitleRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (smallRef.current) smallRef.current.classList.add('animate-left')
          if (titleRef.current) titleRef.current.classList.add('animate-left')
          if (textRef.current) textRef.current.classList.add('animate-left')
          if (heroImageRef.current) heroImageRef.current.classList.add('animate-right')
        }
      },
      { threshold: 0.2 }
    )
    const el = document.getElementById('spareparts-hero')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (featuredSmallRef.current) featuredSmallRef.current.classList.add('animate-left')
          if (featuredTitleRef.current) featuredTitleRef.current.classList.add('animate-left')
        }
      },
      { threshold: 0.2 }
    )
    const el = document.getElementById('spareparts-products')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const cards = document.querySelectorAll('.product-card')
          cards.forEach((card, index) => {
            card.classList.add('animate-in')
            card.style.animationDelay = `${index * 0.05}s`
          })
        }
      },
      { threshold: 0.1 }
    )
    const el = document.getElementById('spareparts-products')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [spareParts])

  return (
    <>
      <section id="spareparts-hero" className="spareparts-hero">
        <div className="spareparts-hero-container">
          <div className="spareparts-hero-left">
            <p className="spareparts-hero-small" ref={smallRef}>SPARE PARTS</p>
            <h1 className="spareparts-hero-title" ref={titleRef}><span>Reliable Spare Parts</span> for Smooth Elevator Operations</h1>
            <p className="spareparts-hero-text" ref={textRef}>
              We provide a wide range of high-performance elevator spare parts designed for durability, safety, and seamless operation. From controllers to rollers and traction components, every part is built to meet industry standards.
            </p>
            <div className="spareparts-hero-features">
              {features.map((f, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-icon">{f.icon}</span>
                  <span className="feature-label">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="spareparts-hero-right">
            <img src={heroImg} alt="Elevator Spare Parts" className="hero-elevator-image" ref={heroImageRef} />
          </div>
        </div>
      </section>

      <section id="spareparts-products" className="spareparts-products">
        <div className="spareparts-products-header">
          <p className="spareparts-products-small" ref={featuredSmallRef}>FEATURED SPARE PARTS</p>
          <h2 className="spareparts-products-title" ref={featuredTitleRef}><span>Certified OEM Spare Parts</span></h2>
          <button className="admin-btn" onClick={() => { setShowPasswordModal(true); setError(''); setPassword(''); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8 4-8 11-8 11 8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Admin
          </button>
        </div>
        <div className="spareparts-grid">
          {spareParts.map((part, idx) => {
            const imgSrc = part.img?.startsWith('data:') ? part.img : (imageMap[part.img] || part.img)
            return (
              <div key={part.id || idx} className="product-card">
                <div className="product-card-image">
                  <img src={imgSrc} alt={part.name} />
                </div>
                <div className="product-card-info">
                  <h3 className="product-card-name">{part.name}</h3>
                  <p className="product-card-description">{part.description}</p>
                  <div className="button-group">
                    <button className="enquiry-btn" onClick={() => openEnquiry(part)}>Enquiry</button>
                    <button className="view-details-btn" onClick={() => navigate(`/spareparts/${part.id}`)}>View Details</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h3>Enter Admin Password</h3>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminClick()}
                autoFocus
              />
              <button
                type="button"
                className={`toggle-password ${showPassword ? 'active' : ''}`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ background: '#ffffff', border: '2px solid #9ca3af' }}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" width="18" height="18" style={{ stroke: '#000000', display: 'block' }}>
                  {showPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 2.16M15 12a3 3 0 1 1-4.08-2.58M1 1l22 22" />
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8 4-8 11-8 11 8z" fill="none" />
                      <circle cx="12" cy="12" r="3" fill="none" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button onClick={handleAdminClick}>Submit</button>
              <button onClick={() => { setShowPasswordModal(false); setError(''); setPassword(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {enquiryPart && (
        <div className="password-modal-overlay" onClick={closeEnquiry}>
          <div className="password-modal enquiry-modal" onClick={e => e.stopPropagation()}>
            {!enquirySent ? (
              <>
                <h3>Enquire: {enquiryPart.name}</h3>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={enquiryForm.name}
                    onChange={e => setEnquiryForm(p => ({ ...p, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={enquiryForm.phone}
                    onChange={e => setEnquiryForm(p => ({ ...p, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={enquiryForm.email}
                    onChange={e => setEnquiryForm(p => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <textarea
                    placeholder="Message (optional)"
                    value={enquiryForm.message}
                    onChange={e => setEnquiryForm(p => ({ ...p, message: e.target.value }))}
                    rows="3"
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="modal-buttons">
                  <button onClick={handleEnquiry} style={{ background: '#25D366' }}>Send on WhatsApp</button>
                  <button onClick={closeEnquiry}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ color: '#16a34a' }}>✓ Enquiry Sent!</h3>
                <p style={{ color: '#475569', marginBottom: '20px' }}>Your enquiry for <strong>{enquiryPart.name}</strong> has been sent via WhatsApp. We will get back to you shortly.</p>
                <div className="modal-buttons">
                  <button onClick={closeEnquiry}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
