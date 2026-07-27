import { useState, useEffect, useCallback } from 'react'
import img1 from '../images/export.png'
import img2 from '../images/maintenance.png'
import img3 from '../images/modify.png'
import img4 from '../images/new.jpeg'
import './home.css'
import About from '../components/about.jsx'
import OEM from '../components/oem.jsx'
import WhyChooseUs from '../components/whyChooseUs.jsx'
import Projects from '../components/projects.jsx'
import OngoingProjects from '../components/ongoing.jsx'
import Stats from '../components/stats.jsx'
import Footer from '../components/Footer.jsx'


const slides = [
{
  src: img4,
  alt: 'Image 1',
title: (
  <>
    <span className="original-equipment">Original</span><br />
    <span className="original-equipment">Equipment</span><br />
    <span className="manufacturer-text">Manufacturer</span>
  </>
),
  bullets: [
    <>
      <strong>Premium Quality Manufacturing</strong> — <br />
      Built with advanced technology and precision engineering.
    </>,
    <>
      <strong>Customized Lift Components</strong> — <br />
      Tailored solutions for residential, commercial & industrial needs.
    </>,
    <>
      <strong>Global Standards Compliance</strong> — <br />
      Designed to meet international quality and safety standards.
    </>,
    <>
      <strong>End-to-End Support</strong> — <br />
      From manufacturing to installation and maintenance services.
    </>
  ]
},
  { src: img1, alt: 'Image 2', title: 'Global Lift Export Solutions', dark: true, blue: true, bullets: [
    'Worldwide Export Services',
    'Premium Quality Assurance',
    'International Compliance Standards',
    'Secure Packaging Solutions',
    'Fast Global Shipping',
    'End-to-End Logistics Support',
    'Customized Export Orders',
    'Reliable Delivery Network',
  ] },
  { src: img3, alt: 'Image 3' },
  { src: img2, alt: 'Image 4', title: 'Reliable Maintenance Services', dark: true, bullets: [
    '24/7 Emergency Support',
    'Preventive Maintenance Plans',
    'Fast Breakdown Resolution',
    'Certified Expert Technicians',
    'Regular Safety Inspections',
    'Spare Parts Replacement',
    'Performance Optimization',
    'Annual Maintenance Contracts (AMC)',
  ] },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])
  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next])

return (
    <>
      <div className="slider-wrapper" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="slide">
              <img src={slide.src} alt={slide.alt} />
              {slide.title && (
                <div
                  key={`${i}-${current}`}
                  className={`slide-content ${i === 0 ? 'first-slide-content' : ''}${slide.dark ? ' dark' : ''}${slide.blue ? ' blue' : ''}${i === current ? ' active' : ''}`}
                >
                  <h2 className="slide-title">{slide.title}</h2>
                  <ul className="slide-bullets">
                    {slide.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="slider-arrow prev" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button className="slider-arrow next" onClick={next} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>

        <div className="slider-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot${current === i ? ' active' : ''}`} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>
      <Stats />
      <About />
      <OEM />
      <WhyChooseUs />
      <Projects />
      <OngoingProjects />
      <Footer />
    </>
  )
}