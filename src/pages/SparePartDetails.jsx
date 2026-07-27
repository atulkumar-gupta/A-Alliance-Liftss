import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { loadSpareParts } from '../data/sparepartsUtils'
import part1Img from '../images/part1.png'
import part2Img from '../images/part2.png'
import part3Img from '../images/part3.png'
import part4Img from '../images/part4.png'
import part5Img from '../images/part5.png'
import bufferSpringImg from '../images/bufferspring.png'
import machineBaseImg from '../images/machinebase.png'
import ropeThimblesImg from '../images/ropethimbles.png'
import swingDoorImg from '../images/swingdoor.png'
import './ProductDetails.css'
import Footer from '../components/Footer.jsx'

const imageMap = {
  'part1.png': part1Img,
  'part2.png': part2Img,
  'part3.png': part3Img,
  'part4.png': part4Img,
  'part5.png': part5Img,
  'bufferspring.png': bufferSpringImg,
  'machinebase.png': machineBaseImg,
  'ropethimbles.png': ropeThimblesImg,
  'swingdoor.png': swingDoorImg
}

const defaultSpareParts = [
  {
    id: 'bottom-plengths',
    name: 'Bottom Plengths',
    img: 'part1.png',
    description: 'High-quality bottom plengths and top corona bars for elevator assembly.',
    price: '250',
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
    price: '450',
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
    price: '380',
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
    price: '180',
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
    price: '500',
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
    price: '400',
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
    price: '320',
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

const WHATSAPP_NUMBER = '919910589059'

export default function SparePartDetails() {
  const { sparePartId } = useParams()
  const [spareParts, setSpareParts] = useState(defaultSpareParts)
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [enquirySent, setEnquirySent] = useState(false)
  const [enquiryError, setEnquiryError] = useState('')

  const product = useMemo(() => spareParts.find(part => part.id === sparePartId) || {}, [spareParts, sparePartId])
  const productImg = useMemo(() => product.img?.startsWith('data:') ? product.img : (imageMap[product.img] || product.img), [product.img])

  useEffect(() => {
    loadSpareParts().then(data => {
      if (data && data.length > 0) {
        const merged = data.map(fbPart => {
          const def = defaultSpareParts.find(d => d.id === fbPart.id)
          return {
            ...fbPart,
            features: fbPart.features?.length ? fbPart.features : def?.features || [],
            specs:    fbPart.specs?.length    ? fbPart.specs    : def?.specs    || []
          }
        })
        setSpareParts(merged)
      }
    }).catch((e) => {
      console.error('Failed to load spare parts:', e)
    })
  }, [sparePartId])

  const handleEnquiry = () => {
    if (!enquiryForm.name || !enquiryForm.phone) {
      setEnquiryError('Please enter your name and phone number')
      return
    }
    setEnquiryError('')
    let text = `*Spare Part Enquiry*\n`
    text += `Part: ${product.name}\n`
    text += `Description: ${product.description}\n`
    text += `\n*Customer Details*\n`
    text += `Name: ${enquiryForm.name}\n`
    text += `Phone: ${enquiryForm.phone}\n`
    if (enquiryForm.email) text += `Email: ${enquiryForm.email}\n`
    if (enquiryForm.message) text += `Message: ${enquiryForm.message}\n`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
    setEnquirySent(true)
  }

  const openEnquiry = () => {
    setEnquiryForm({ name: '', phone: '', email: '', message: '' })
    setEnquirySent(false)
    setEnquiryError('')
    setShowEnquiry(true)
  }
  const smallRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const heroImageRef = useRef(null)
  const detailsHeaderRef = useRef(null)
  const featuresBounceRef = useRef(null)
  const specsScrollRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (smallRef.current) smallRef.current.classList.add('animate-left')
          if (titleRef.current) titleRef.current.classList.add('animate-left')
          if (subtitleRef.current) subtitleRef.current.classList.add('animate-left')
          if (heroImageRef.current) heroImageRef.current.classList.add('animate-right')
        }
      },
      { threshold: 0.3 }
    )
    const el = document.getElementById('product-details-hero')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { detailsHeaderRef.current?.classList.add('visible'); observer.disconnect() }
      },
      { threshold: 0.05 }
    )
    const el = detailsHeaderRef.current
    if (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible')
      else observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { featuresBounceRef.current?.classList.add('visible'); observer.disconnect() }
      },
      { threshold: 0.05 }
    )
    const el = featuresBounceRef.current
    if (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible')
      else observer.observe(el)
    }
    return () => observer.disconnect()
  }, [spareParts])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { specsScrollRef.current?.classList.add('specs-revealed'); observer.disconnect() }
      },
      { threshold: 0.05 }
    )
    const el = specsScrollRef.current
    if (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('specs-revealed')
      else observer.observe(el)
    }
    return () => observer.disconnect()
  }, [spareParts])

  return (
    <>
      <section id="product-details-hero" className="product-details-hero">
        <div className="product-details-hero-container">
          <div className="product-details-hero-left">
            <p className="product-details-hero-small" ref={smallRef}>SPARE PART DETAILS</p>
            <h1 className="product-details-hero-title" ref={titleRef}>
              <span className="engineered-text">{product.name}</span>
            </h1>
            <p className="product-details-hero-text" ref={subtitleRef}>
              {product.description}
            </p>
          </div>
          <div className="product-details-hero-right">
            <img
              src={productImg}
              alt={product.name}
              className="sparepart-hero-image"
              ref={heroImageRef}
            />
          </div>
        </div>
      </section>

      <section className="product-details-section">
        <div className="product-details-container">
          <div className="details-header" ref={detailsHeaderRef}>
            <h2 className="details-title">
              <span className="details-title-first">Specifications</span>
              <span className="details-title-rest"> &amp; Features</span>
            </h2>
          </div>

          <div className="details-features-wrapper" ref={featuresBounceRef}>
            <h3 className="details-subtitle">Features</h3>
            <ul className="details-list features-reveal-items">
              {(product.features || []).map((feature, index) => (
                <li key={index} className="details-item feature-animate-item">
                  <span className="details-icon">•</span>
                  <span className="details-text">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="details-specs-wrapper" ref={specsScrollRef}>
            <h3 className="details-subtitle spec-heading">Technical Specifications</h3>
            <div className="details-specs">
              {(product.specs || []).map((row, index) => (
                <div key={index} className="details-spec-row spec-reveal-item">
                  <span className="details-spec-label">{row.label}</span>
                  <span className="details-spec-value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="details-actions">
            <button className="back-to-products-btn" onClick={() => window.history.back()}>
              Back to Spare Parts
            </button>
            <button className="buy-now-btn" onClick={openEnquiry}>
              Enquiry
            </button>
          </div>
        </div>
      </section>

      {showEnquiry && (
        <div className="password-modal-overlay" onClick={() => setShowEnquiry(false)}>
          <div className="password-modal enquiry-modal" onClick={e => e.stopPropagation()}>
            {!enquirySent ? (
              <>
                <h3>Enquire: {product.name}</h3>
                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={enquiryForm.name}
                    onChange={e => setEnquiryForm(p => ({ ...p, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={enquiryForm.phone}
                    onChange={e => setEnquiryForm(p => ({ ...p, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={enquiryForm.email}
                    onChange={e => setEnquiryForm(p => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <textarea
                    placeholder="Message (optional)"
                    value={enquiryForm.message}
                    onChange={e => setEnquiryForm(p => ({ ...p, message: e.target.value }))}
                    rows="3"
                    style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Poppins, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
                {enquiryError && <p className="error-message">{enquiryError}</p>}
                <div className="modal-buttons">
                  <button onClick={handleEnquiry} style={{ background: '#25D366' }}>Send on WhatsApp</button>
                  <button onClick={() => setShowEnquiry(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ color: '#16a34a' }}>✓ Enquiry Sent!</h3>
                <p style={{ color: '#475569', marginBottom: '20px' }}>Your enquiry for <strong>{product.name}</strong> has been sent via WhatsApp. We will get back to you shortly.</p>
                <div className="modal-buttons">
                  <button onClick={() => setShowEnquiry(false)}>Close</button>
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
