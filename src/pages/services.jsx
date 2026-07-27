import { useEffect, useRef, useState } from 'react'
import serviceImg from '../images/servicemain.png'
import './services.css'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'

const Services = () => {
  const smallRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const heroImageRef = useRef(null)
  const buttonsRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const services = [
    {
      id: 1,
      name: 'Elevator Manufacturing',
      icon: '🏭',
      color: '#3b82f6',
      description: 'Precision-engineered elevator systems built with cutting-edge technology and uncompromising quality standards.'
    },
    {
      id: 2,
      name: 'Lift Modification / Modernization',
      icon: '🔧',
      color: '#10b981',
      description: 'Upgrade existing elevators with modern components for improved performance, safety, and aesthetics.'
    },
    {
      id: 3,
      name: 'Export Solutions',
      icon: '🚢',
      color: '#8b5cf6',
      description: 'Global export services with secure packaging, compliant logistics, and reliable worldwide delivery.'
    },
    {
      id: 4,
      name: 'Customer Support',
      icon: '🎧',
      color: '#f59e0b',
      description: 'Dedicated 24/7 support team ensuring rapid response and effective solutions for all customer needs.'
    },
    {
      id: 5,
      name: 'Maintenance Services',
      icon: '🔧',
      color: '#ef4444',
      description: 'Comprehensive maintenance programs with preventive care, emergency repairs, and performance optimization.'
    },
    {
      id: 6,
      name: 'Installation Services',
      icon: '📦',
      color: '#06b6d4',
      description: 'Professional elevator installation with safety compliance, quality assurance, and expert setup.'
    }
  ];

  const whyChoose = [
    'Experienced Engineers with 20+ years expertise',
    'OEM Quality Components from trusted manufacturers',
    'Fast Response Times with 24/7 emergency support',
    'Advanced Safety Standards exceeding industry requirements',
    'Customized Solutions tailored to specific building needs',
    'Reliable Support throughout the product lifecycle'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    const el = document.getElementById('services-hero')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

   useEffect(() => {
     if (visible && heroImageRef.current) {
       heroImageRef.current.classList.add('animate-right')
     }
     if (visible && smallRef.current) {
       smallRef.current.classList.add('animate-left')
     }
     if (visible && titleRef.current) {
       titleRef.current.classList.add('animate-left')
     }
     if (visible && subtitleRef.current) {
       subtitleRef.current.classList.add('animate-left')
     }
     if (visible && buttonsRef.current) {
       buttonsRef.current.classList.add('fade-up-delayed')
     }
   }, [visible])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = document.querySelectorAll('.service-card')
    const whyItems = document.querySelectorAll('.why-choose-item')
    cards.forEach((card) => {
      observer.observe(card)
    })
    whyItems.forEach((item) => {
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section id="services-hero" className="services-hero">
        <div className="services-hero-container">
          <div className="services-hero-left">
            <p className="services-hero-small" ref={smallRef}>OUR SERVICES</p>
            <h1 className="services-hero-title" ref={titleRef}><span className="engineered-text">Complete Elevator Solutions</span> Under One Roof</h1>
            <p className="services-hero-text" ref={subtitleRef}>
              We combine modern engineering, quality components, and expert service support to deliver complete elevator solutions for every infrastructure need.
            </p>
             <div className="services-hero-buttons" ref={buttonsRef}>
               <Link to="/contactus" className="btn-primary">Request a Quote</Link>
               <Link to="/contactus" className="btn-secondary">Contact Us</Link>
             </div>
          </div>
          <div className="services-hero-right">
            <img src={serviceImg} alt="Elevator Services" className="hero-elevator-image" ref={heroImageRef} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2 className="section-title">Our <span className="servicesubhead">Services</span></h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            Comprehensive solutions tailored to every aspect of elevator lifecycle management
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card"
              style={{ animationDelay: `${service.id * 0.1}s` }}
            >
              <div className="service-icon">
                <span className="service-emoji" style={{ color: service.color }}>{service.icon}</span>
              </div>
              <h3 className="service-title">{service.name}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Our Services Section */}
      <section id="why-choose" className="why-choose-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose <span className="whychoose-subhead">Our Services</span></h2>
          <div className="title-underline"></div>
        </div>
        <div className="why-choose-grid">
{whyChoose.map((point, index) => (
              <div
                key={index}
                className="why-choose-item"
                style={{ animationDelay: `${(index + 1) * 0.05}s` }}
              >
              <i className="fa-solid fa-star"></i>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Section */}
      <section id="cta" className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Need Reliable Elevator Services?</h2>
          <p className="cta-text">
            Contact us today for expert consultation and customized solutions for your elevator needs.
          </p>
           <div className="cta-buttons">
             <Link to="/contactus" className="btn-primary">Request a Quote</Link>
             <Link to="/contactus" className="btn-secondary">Contact Us</Link>
           </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Services