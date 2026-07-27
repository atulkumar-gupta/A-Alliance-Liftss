import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ProductDetails.css'
import Footer from '../components/Footer.jsx'

import fb1 from '../images/fb1.jpg'
import fb2 from '../images/fb2.png'
import fb3 from '../images/fb3.jpg'
import fb4 from '../images/fb4.png'
import fb5 from '../images/fb5.jpg'
import fb6 from '../images/fb6.jpg'
import fb7 from '../images/fb7.jpg'
import fb8 from '../images/fb8.jpg'
import fb9 from '../images/fb9.png'

export default function ProductDetails() {
  const { productId } = useParams()

  const normalizedProductId = (productId || '')
    .toString()
    .trim()
    .toLowerCase()

  // Product data
  const featuredProducts = [
    {
      id: 'passenger-lifts',
      name: 'Passenger Lifts',
      img: fb1,
      description:
        'A Alliance Lifts manufactures advanced passenger lifts designed for smooth transportation in residential, commercial, and industrial buildings. Our elevators combine modern technology, superior comfort, and maximum safety to deliver efficient vertical mobility solutions.',
      features: [
        'High-speed smooth performance',
        'Energy-efficient operation',
        'Premium cabin interiors',
        'Smart control system',
        'Heavy-duty performance',
        'Modern automatic doors'
      ],
      specs: [
        { label: 'Capacity', value: '4–20 Persons' },
        { label: 'Speed', value: '1 – 2.5 m/s' },
        { label: 'Floors Supported', value: 'Up to 30 Floors' },
        { label: 'Drive Type', value: 'Gearless / Traction' },
        { label: 'Door Type', value: 'Automatic Center Opening' }
      ]
    },
    {
      id: 'hospital-lifts',
      name: 'Hospital Lifts',
      img: fb2,
      description: 'Specialized medical elevators with precision control and safety.',
      features: [
        'Spacious cabin for stretcher and wheelchair access',
        'Smooth and silent operation',
        'Automatic center opening doors',
        'Emergency rescue and alarm system',
        'Accurate floor leveling for patient safety',
        'Energy-efficient and reliable performance'
      ],
      specs: [
        { label: 'Capacity', value: '10–26 Persons' },
        { label: 'Speed', value: '1 – 2.5 m/s' },
        { label: 'Drive Type', value: 'Gearless / Hydraulic' },
        { label: 'Door Type', value: 'Automatic Center Opening' },
        { label: 'Cabin Finish', value: 'Stainless Steel Finish' },
        { label: 'Safety System', value: 'ARD & Overload Protection' }
      ]
    },
    {
      id: 'home-elevators',
      name: 'Home Elevators',
      img: fb3,
      description: 'A Alliance Lifts offers modern home elevators designed to provide comfort, convenience, and luxury for residential spaces. Our home lifts are built with advanced technology, smooth operation, and enhanced safety features to ensure effortless movement between floors. Designed for villas, duplexes, and private homes, these elevators combine elegant aesthetics with reliable performance while requiring minimal space and maintenance.',
      features: [
        'Compact and space-saving design',
        'Smooth and silent operation',
        'Modern and elegant cabin interiors',
        'Low power consumption',
        'Advanced safety protection system',
        'Easy maintenance and reliable performance'
      ],
      specs: [
        { label: 'Capacity', value: '2–6 Persons' },
        { label: 'Speed', value: '0.3 – 1 m/s' },
        { label: 'Drive Type', value: 'Hydraulic / Traction' },
        { label: 'Door Type', value: 'Automatic / Manual' },
        { label: 'Cabin Finish', value: 'Stainless Steel / Glass' },
        { label: 'Safety System', value: 'ARD & Emergency Alarm' }
      ]
    },
    {
      id: 'goods-lifts',
      name: 'Goods Lifts',
      img: fb4,
      description:
        'Heavy-duty goods lifts for industrial material handling—built for smooth, stable lifting and durable, low-maintenance operation with advanced safety locking and emergency stopping.',
      features: [
        'Heavy-duty industrial structure for long service life',
        'High load carrying capacity (500–5000 KG)',
        'Smooth and stable lifting operation for reliable material movement',
        'Durable, low-maintenance components and robust guide systems',
        'Advanced safety locking system for secure door-to-cab positioning',
        'Energy-efficient hydraulic/traction drive options',
        'Overload Protection and Emergency Stop integrated for operator safety',
        'Door interlocks to prevent unsafe operation'
      ],
      specs: [
        { label: 'Capacity', value: '500 – 5000 KG' },
        { label: 'Speed', value: '0.3 – 1 m/s' },
        { label: 'Drive Type', value: 'Hydraulic / Traction' },
        { label: 'Door Type', value: 'Manual / Automatic' },
        { label: 'Cabin Finish', value: 'Mild Steel / Stainless Steel' },
        { label: 'Safety System', value: 'Overload Protection & Emergency Stop' }
      ]
    },
    {
      id: 'travelators',
      name: 'Travelators',
      img: fb5,
      description: 'A Alliance Lifts manufactures advanced travelators designed to provide smooth and efficient horizontal passenger movement in commercial and public spaces. Built with modern technology, durable construction, and enhanced safety systems, our travelators are ideal for shopping malls, airports, metro stations, hotels, and large commercial complexes. They ensure reliable performance, energy efficiency, and comfortable transportation for high pedestrian traffic areas.',
      features: [
        'Smooth and silent operation',
        'Heavy-duty and durable structure',
        'Anti-slip moving surface',
        'Energy-efficient performance',
        'Advanced passenger safety features',
        'Suitable for high foot traffic areas'
      ],
      specs: [
        { label: 'Capacity', value: 'Continuous Passenger Movement' },
        { label: 'Speed', value: '0.5 m/s' },
        { label: 'Inclination', value: '0° – 12°' },
        { label: 'Drive Type', value: 'Electric Motor Drive' },
        { label: 'Step/Surface Material', value: 'Stainless Steel / Aluminum' },
        { label: 'Safety System', value: 'Emergency Stop & Safety Sensors' }
      ]
    },
    {
      id: 'escalators',
      name: 'Escalators',
      img: fb6,
      description: 'A Alliance Lifts manufactures high-performance escalators designed for safe, smooth, and continuous passenger transportation in commercial and public environments. Built with advanced engineering and modern safety systems, our escalators are ideal for shopping malls, airports, metro stations, hotels, and commercial buildings. These escalators offer reliable operation, energy efficiency, and durability for handling heavy daily foot traffic.',
      features: [
        'Safe, smooth continuous operation',
        'Energy-efficient performance',
        'Durable construction for heavy usage',
        'Modern safety systems including emergency stop',
        'Low maintenance requirements',
        'Suitable for high foot traffic areas',
        'Quiet operation',
        'Weather-resistant options available'
      ],
      specs: [
        { label: 'Width', value: '600-1000 mm' },
        { label: 'Speed', value: '0.5-0.75 m/s' },
        { label: 'Power Supply', value: '3-phase AC' },
        { label: 'Control System', value: 'PLC-based' },
        { label: 'Safety Features', value: 'Step chain protection, comb plate safety, emergency stop' },
        { label: 'Applications', value: 'Metro stations, shopping malls, office buildings' }
      ]
    },
    {
      id: 'rotary-car-parking',
      name: 'Rotary Car Parking',
      img: fb7,
      description: 'A Alliance Lifts provides advanced rotary car parking systems designed to maximize parking capacity in limited spaces. Engineered with modern automation technology and high safety standards, our rotary parking solutions offer smooth, secure, and efficient vehicle parking for residential, commercial, and industrial applications. These systems help optimize space utilization while ensuring quick vehicle access and reliable performance.',
      features: [
        'Fully automated parking and retrieval',
        'Space-efficient design (up to 50% space saving)',
        'User-friendly interface with minimal wait times',
        'Safe and secure vehicle storage',
        'Low noise and vibration operation',
        'Energy-efficient operation',
        '24/7 availability with minimal supervision',
        'Weatherproof construction for indoor/outdoor use'
      ],
      specs: [
        { label: 'Capacity', value: '10-20 cars' },
        { label: 'Cycle Time', value: '45-60 seconds' },
        { label: 'Power Supply', value: '3-phase AC' },
        { label: 'Control System', value: 'PLC with HMI' },
        { label: 'Safety Features', value: 'Vehicle presence detection, overload protection, emergency stop' },
        { label: 'Applications', value: 'Residential complexes, hospitals, hotels' }
      ]
    },
    {
      id: 'car-stackers',
      name: 'Car Stackers',
      img: fb8,
      description: 'A Alliance Lifts manufactures high-quality car stackers designed to provide efficient and space-saving vehicle parking solutions for residential, commercial, and industrial areas. Built with robust engineering and advanced hydraulic technology, our car stackers ensure safe, smooth, and reliable vehicle lifting and parking operations. These systems are ideal for maximizing parking capacity in limited spaces while maintaining convenience and safety.',
      features: [
        'Vertical space optimization for parking',
        'Independent car access without moving others',
        'Quick and efficient vehicle retrieval',
        'Safe and secure vehicle storage',
        'Low maintenance requirements',
        'Customizable for different vehicle sizes',
        'Energy-efficient operation',
        'Suitable for commercial and residential buildings'
      ],
      specs: [
        { label: 'Capacity', value: '2-8 cars per stack' },
        { label: 'Lifting Height', value: '3-12 meters' },
        { label: 'Power Supply', value: '3-phase AC' },
        { label: 'Control System', value: 'PLC-based' },
        { label: 'Safety Features', value: 'Vehicle positioning sensors, mechanical locks, emergency stop' },
        { label: 'Applications', value: 'Parking garages, car dealerships, residential buildings' }
      ]
    },
    {
      id: 'car-scissor-lifts',
      name: 'Car Scissor Lifts',
      img: fb9,
      description: 'A Alliance Lifts offers advanced car scissor lifts designed for efficient vehicle lifting and maintenance applications. Engineered with high-strength materials and modern hydraulic technology, our scissor lifts provide smooth operation, stability, and maximum safety. These lifts are ideal for automobile workshops, service centers, parking systems, and industrial applications requiring reliable vehicle handling solutions.',
      features: [
        'Stable and level lifting platform',
        'Smooth hydraulic operation',
        'High weight capacity for heavy vehicles',
        'Low maintenance requirements',
        'Multiple safety mechanisms',
        'Easy to operate controls',
        'Weather-resistant options',
        'Customizable platform sizes'
      ],
      specs: [
        { label: 'Load Capacity', value: '3000-5000 kg' },
        { label: 'Lifting Height', value: '1-2 meters' },
        { label: 'Power Supply', value: '3-phase AC or hydraulic' },
        { label: 'Control System', value: 'Manual or electric' },
        { label: 'Safety Features', value: 'Mechanical safety locks, overload protection, emergency lowering' },
        { label: 'Applications', value: 'Garages, service stations, car wash facilities' }
      ]
    }
  ]

  const product = featuredProducts.find(p => p.id === normalizedProductId) || featuredProducts[0]

  const navigate = useNavigate()

  const smallRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const heroImageRef = useRef(null)
  const detailsRef = useRef(null)
  const featuresBounceRef = useRef(null)
  const specsScrollRef = useRef(null)
  const specsHeadingRef = useRef(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Ensure the page opens from the top when navigated to
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    const el = document.getElementById('product-details-hero')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (visible && smallRef.current) smallRef.current.classList.add('animate-left')
    if (visible && titleRef.current) titleRef.current.classList.add('animate-left')
    if (visible && subtitleRef.current) subtitleRef.current.classList.add('animate-left')
    if (visible && heroImageRef.current) heroImageRef.current.classList.add('animate-right')
  }, [visible])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDetailsVisible(true)
      },
      { threshold: 0.15 }
    )
    const el = document.getElementById('product-details-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (detailsVisible && featuresBounceRef.current) {
      featuresBounceRef.current.classList.add('visible')
    }
  }, [detailsVisible])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (specsScrollRef.current) {
            specsScrollRef.current.classList.add('specs-revealed')
          }
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    const el = specsScrollRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [product.specs])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (specsHeadingRef.current) {
            specsHeadingRef.current.classList.add('visible')
          }
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    const el = specsHeadingRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section id="product-details-hero" className="product-details-hero">
        <div className="product-details-hero-container">
          <div className="product-details-hero-left">
            <p className="product-details-hero-small" ref={smallRef}>PRODUCT DETAILS</p>
            <h1 className="product-details-hero-title" ref={titleRef}><span className="engineered-text">{product.name}</span></h1>
            <p className="product-details-hero-text" ref={subtitleRef}>
              {product.description}
            </p>
          </div>
          <div className="product-details-hero-right">
            <img src={product.img} alt={product.name} className="hero-product-image" ref={heroImageRef} />
          </div>
        </div>
      </section>

      <section id="product-details-section" className="product-details-section" ref={detailsRef}>
        <div className="product-details-container">
          <div className={`details-header details-animate${detailsVisible ? ' visible' : ''}`}>
            <h2 className="details-title"><span className="details-title-first">Specifications</span><span className="details-title-rest"> & Features</span></h2>
          </div>

          {/* Features heading + bullets */}
          <div className="details-features-wrapper" ref={featuresBounceRef}>
            <h3 className="details-subtitle">Features</h3>
            <div className="bounce-features-grid">
              <ul className="bounce-features-left">
                {(product.features || []).slice(0, Math.ceil((product.features || []).length / 2)).map((feature, index) => (
                  <li key={index} className="details-item">
                    <span className="details-icon">•</span>
                    <span className="details-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <ul className="bounce-features-right">
                {(product.features || []).slice(Math.ceil((product.features || []).length / 2)).map((feature, index) => (
                  <li key={index} className="details-item">
                    <span className="details-icon">•</span>
                    <span className="details-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

{/* Technical Specifications heading + table-like rows */}
              <div className="details-specs-wrapper" ref={specsScrollRef}>
                <h3 className="details-subtitle spec-heading" ref={specsHeadingRef}>Technical Specifications</h3>
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
                  Back to Products
                </button>
                <button className="buy-now-btn" onClick={() => navigate('/contactus')}>
                  Enquire Now
                </button>
              </div>
            </div>
          </section>

      <Footer />
    </>
  )
}