import { useEffect, useRef, useState } from 'react'
import aboutHeroImg from '../images/aboutmain.png'
import '../about.css'
import Footer from '../components/Footer.jsx'

export default function AboutPage() {
  const detailRefs = useRef([null, null, null, null])
  const whyChooseItems = [
    { id: 1, icon: '🏭', title: 'OEM Quality Manufacturing', desc: 'Precision-engineered elevator systems built with cutting-edge technology and uncompromising quality standards.' },
    { id: 2, icon: '👨‍🔧', title: 'Experienced Engineers', desc: 'Team of certified engineers with 20+ years of expertise in vertical transportation systems.' },
    { id: 3, icon: '🚢', title: 'Global Export Solutions', desc: 'International export services with secure packaging and compliant logistics worldwide.' },
    { id: 4, icon: '🎧', title: '24/7 Customer Support', desc: 'Round-the-clock dedicated support team for rapid response and effective solutions.' },
    { id: 5, icon: '⚙️', title: 'Modern Technology', desc: 'Advanced control systems, IoT integration, and energy-efficient drive technologies.' },
    { id: 6, icon: '🛡️', title: 'Advanced Safety Standards', desc: 'Exceeding industry requirements with multi-layered safety protocols and certifications.' }
  ]

const stats = [
    { id: 1, value: '100', label: 'Certified Components', suffix: '%' },
    { id: 2, value: '12', label: 'Years Exp', suffix: '+' },
    { id: 3, value: '24', label: 'Support', secondValue: '7' },
    { id: 4, value: '100', label: 'Quality', suffix: '%' }
  ]

  const services = [
    { id: 1, icon: '🏭', title: 'Manufacturing', desc: 'Custom elevator systems built to exact specifications.' },
    { id: 2, icon: '🔧', title: 'Modification', desc: 'Upgrade existing elevators with modern components.' },
    { id: 3, icon: '🚢', title: 'Export', desc: 'Global delivery with secure packaging and logistics.' },
    { id: 4, icon: '📦', title: 'Installation', desc: 'Professional installation with safety compliance.' },
    { id: 5, icon: '🔧', title: 'Maintenance', desc: 'Preventive care and emergency repair services.' },
    { id: 6, icon: '🎧', title: 'Support', desc: 'Dedicated 24/7 customer support team ready to help.' }
  ]

  const industries = [
    { id: 1, icon: '🏢', title: 'Residential' },
    { id: 2, icon: '🏙️', title: 'Commercial' },
    { id: 3, icon: '🏥', title: 'Hospitals' },
    { id: 4, icon: '🏭', title: 'Warehouses' },
    { id: 5, icon: '🏨', title: 'Hotels' },
    { id: 6, icon: '🏗️', title: 'Industrial' }
  ]

  const companyDetails = [
    { label: 'Headquarter', value: 'Khasra No.-875, Kheda Dharampura, G.T Road, Chapraula, GB Nagar, Ghaziabad, UP - 201001' },
    { label: 'Established', value: '2012' },
    { label: 'Company Type', value: 'Private Limited Company' },
    { label: 'Core Services', value: 'Elevator Manufacturing, Modernization, Maintenance, Export' }
  ]

  const [statsAnimated, setStatsAnimated] = useState([0, 0, 0, 0])
  const [showSeven, setShowSeven] = useState(false)

  const animateStats = () => {
    const targets = [100, 12, 24, 100]
    const durations = [2000, 2000, 1500, 2000]
    targets.forEach((target, index) => {
      const startTime = performance.now()
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / durations[index], 1)
        const value = Math.floor(progress * target)
        setStatsAnimated(prev => {
          const newVals = [...prev]
          newVals[index] = value
          return newVals
        })
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else if (index === 2) {
          setTimeout(() => setShowSeven(true), 300)
        }
      }
      requestAnimationFrame(animate)
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            if (entry.target.id === 'stats') {
               animateStats()
             }
            if (entry.target.id === 'about-hero') {
        detailRefs.current.forEach((ref, idx) => {
          if (ref) {
            ref.classList.add('animate-left')
            ref.style.animationDelay = `${idx * 0.1}s`
          }
        })
      }
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = ['about-hero', 'why-choose', 'stats', 'services-preview', 'industries']
    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section id="about-hero" className="about-hero-section">
        <div className="about-hero-bg"></div>
        <div className="about-hero-content">
          <div className="about-hero-left">
            <h1 className="about-hero-title">
              <span className="about-text">About</span>  <span className="highlight-text">A Alliance Lifts Pvt . Ltd .</span>
            </h1>
            <p className="about-hero-text">
              At AAlliance Lifts is a trusted elevator solutions company specializing in manufacturing, installation, modernization, maintenance, export, and customer support services. With a strong focus on quality engineering, safety, and innovation, we deliver reliable vertical mobility solutions designed for residential, commercial, and industrial projects. Our commitment to precision, performance, and customer satisfaction helps us create smarter and safer elevator systems built for long-term reliability.
            </p>
            <div className="company-details-inline">
              {companyDetails.map((detail, idx) => (
                <div key={idx} className="detail-inline-item" ref={el => detailRefs.current[idx] = el}>
                  <span className="detail-inline-label">{detail.label}</span>
                  <span className="detail-inline-value">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about-hero-right">
            <div className="hero-image-wrapper">
              <img src={aboutHeroImg} alt="Industrial Elevator" className="hero-elevator-img" />
            </div>
          </div>
        </div>
      </section>

      <section id="why-choose" className="why-choose-premium">
        <div className="section-header">
          <h2 className="section-title">Why <span className="highlight-text">Choose Us ?</span></h2>
          <div className="title-underline"></div>
        </div>
        <div className="why-choose-grid">
          {whyChooseItems.map((item) => (
            <div key={item.id} className="choose-card">
              <div className="choose-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stats" className="about-stats-section">
        <div className="about-stats-overlay"></div>
        <div className="about-stats-container">
          {stats.map((stat, index) => (
            <div key={stat.id} className="about-stat-card">
              <div className="stat-number">
                {index === 2 ? (
                  <>
                    {statsAnimated[index]}
                    {showSeven ? <span className="seven-animated">/7</span> : ''}
                  </>
                ) : (
                  <>
                    {statsAnimated[index]}{stat.suffix}
                  </>
                )}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="services-preview" className="services-preview-section">
        <div className="section-header">
          <h2 className="section-title">Our <span className="highlight-text">Services</span></h2>
          <div className="title-underline"></div>
        </div>
        <div className="services-preview-grid">
          {services.map((service) => (
            <div key={service.id} className="service-preview-card">
              <div className="service-preview-icon">{service.icon}</div>
              <h4>{service.title}</h4>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="industries" className="industries-section">
        <div className="section-header">
          <h2 className="section-title">Industries <span className="highlight-text">We Serve</span></h2>
          <div className="title-underline"></div>
        </div>
        <div className="industries-grid">
          {industries.map((industry) => (
            <div key={industry.id} className="industry-card">
              <span className="industry-icon">{industry.icon}</span>
              <span className="industry-title">{industry.title}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
