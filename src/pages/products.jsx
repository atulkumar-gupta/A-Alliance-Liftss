import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProjects } from '../lib/firebaseDB'
import productmainImg from '../images/productmain.png'
import fb1 from '../images/fb1.jpg'
import fb2 from '../images/fb2.png'
import fb3 from '../images/fb3.jpg'
import fb4 from '../images/fb4.png'
import fb5 from '../images/fb5.jpg'
import fb6 from '../images/fb6.jpg'
import fb7 from '../images/fb7.jpg'
import fb8 from '../images/fb8.jpg'
import fb9 from '../images/fb9.png'
import './products.css'
import Footer from '../components/Footer.jsx'

const fallbackProjects = [
  { id: 'p1', name: 'Passenger Lift', tag: 'General', img: fb1, description: 'Smooth, efficient passenger elevators for residential and commercial buildings.' },
  { id: 'p2', name: 'Hospital Lift', tag: 'Healthcare', img: fb2, description: 'Specialized medical elevators with precision control and safety.' },
  { id: 'p3', name: 'Home Elevator', tag: 'Residential', img: fb3, description: 'Compact home elevators for residential comfort and accessibility.' },
  { id: 'p4', name: 'Goods Lift', tag: 'Industrial', img: fb4, description: 'Industrial goods lifts for warehouse and factory use.' },
  { id: 'p5', name: 'Travelator', tag: 'Commercial', img: fb5, description: 'Moving walkways for efficient pedestrian transport in commercial spaces.' },
  { id: 'p6', name: 'Escalator', tag: 'Commercial', img: fb6, description: 'Continuous moving staircases for high-traffic building areas.' },
  { id: 'p7', name: 'Rotary Car Parking', tag: 'Parking', img: fb7, description: 'Automated rotary parking systems for efficient vehicle storage.' },
  { id: 'p8', name: 'Car Stackers', tag: 'Parking', img: fb8, description: 'Vertical car stacking solutions for multi-level parking efficiency.' },
  { id: 'p9', name: 'Car Scissor Lift', tag: 'Industrial', img: fb9, description: 'Hydraulic scissor lifts for vehicle maintenance and storage.' }
]

export default function Products() {
  const navigate = useNavigate()
  const smallRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const heroImageRef = useRef(null)
  const featuredSmallRef = useRef(null)
  const featuredTitleRef = useRef(null)
  const productsGridRef = useRef(null)

  const [featuredProducts, setFeaturedProducts] = useState(fallbackProjects)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProjects()
        if (data && data.length > 0) {
          setFeaturedProducts(data)
        }
      } catch (err) {
        console.error('Failed to load projects:', err)
      }
    }
    loadProducts()
  }, [])

  const features = [
    { icon: '🔧', label: 'Precision Engineering' },
    { icon: '🛡️', label: 'International Standards' },
    { icon: '⚡', label: 'Reliable Performance' },
    { icon: '🚀', label: 'Global Exports' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (smallRef.current) smallRef.current.classList.add('animate-left')
        if (titleRef.current) titleRef.current.classList.add('animate-left')
        if (subtitleRef.current) subtitleRef.current.classList.add('animate-left')
        if (heroImageRef.current) heroImageRef.current.classList.add('animate-right')
      }
    }, { threshold: 0.3 })
    const el = document.getElementById('products-hero')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (featuredSmallRef.current) featuredSmallRef.current.classList.add('animate-left')
        if (featuredTitleRef.current) featuredTitleRef.current.classList.add('animate-left')
        if (productsGridRef.current) productsGridRef.current.classList.add('specs-revealed')
      }
    }, { threshold: 0.2 })
    const el = document.getElementById('featured-products')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section id="products-hero" className="products-hero">
        <div className="products-hero-container">
          <div className="products-hero-left">
            <p className="products-hero-small" ref={smallRef}>OUR PRODUCTS</p>
            <h1 className="products-hero-title" ref={titleRef}><span>Quality Elevator Solutions</span> for Every Need</h1>
            <p className="products-hero-text" ref={subtitleRef}>
              Explore our wide range of elevator and lift products designed with precision, safety, and reliability in mind.
            </p>
            <div className="products-hero-features">
              {features.map((f, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-icon">{f.icon}</span>
                  <span className="feature-label">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="products-hero-right">
            <img src={productmainImg} alt="Elevator Products" className="hero-elevator-image" ref={heroImageRef} />
          </div>
        </div>
      </section>

      <section id="featured-products" className="featured-products">
        <div className="featured-products-header">
          <p className="products-hero-small" ref={featuredSmallRef}>FEATURED PRODUCTS</p>
          <h2 className="featured-products-title" ref={featuredTitleRef}><span>Our Products</span></h2>
        </div>
        <div className="products-grid" ref={productsGridRef}>
          {featuredProducts.map((product, index) => (
            <div key={product.id || index} className="product-card spec-reveal-item">
              <div className="product-card-image">
                <img src={product.img || ''} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description || ''}</p>

                <button className="view-details-btn" onClick={() => navigate(`/products/${product.id || index}`)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
