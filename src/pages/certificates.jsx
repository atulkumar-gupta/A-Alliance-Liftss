import { useEffect, useRef, useState } from 'react'
import c1 from '../images/c-1.jpg'
import c2 from '../images/c-2.jpg'
import c3 from '../images/c-3.jpg'
import c4 from '../images/c-4.jpg'
import c5 from '../images/c-5.jpg'
import c6 from '../images/c-6.jpg'
import c7 from '../images/c-7.jpg'
import c8 from '../images/c-8.jpg'
import c9 from '../images/c-9.jpg'
import './certificates.css'
import Footer from '../components/Footer.jsx'

const certificates = [
  { id: 1, name: 'ISO 9001: Quality Management Certificate', img: c1, file: '/c1.pdf' },
  { id: 2, name: 'LICENCE TO ELECTRICAL CONTRACTORS', img: c2, file: '/c2.pdf' },
  { id: 3, name: 'ETHIOPACIFIC', img: c3, file: '/c3.pdf' },
  { id: 4, name: 'Import & Export License from Govt. of India', img: c4, file: '/c4.pdf' },
  { id: 5, name: 'INTERNATIONAL CERTIFICATION & INSPECTION UK LTD.', img: c5, file: '/c5.pdf' },
  { id: 6, name: 'CERTIFICATE OF RECOGNITION', img: c6, file: '/c6.pdf' },
  { id: 7, name: 'Trade Marks Registry', img: c7, file: '/c7.pdf' },
  { id: 8, name: 'UDYAM REGISTRATION CERTIFICATE', img: c8, file: '/c8.pdf' },
  { id: 9, name: 'ZED Bronze Certificate', img: c9, file: '/c9.pdf' }
]

export default function Certificates() {
  const cardRefs = useRef([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )

    const el = document.querySelector('.certificates-section')

    if (el) observer.observe(el)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (visible) {
      cardRefs.current.forEach((card, idx) => {
        if (card) {
          card.classList.add('cert-visible')
          card.style.animationDelay = `${idx * 0.1}s`
        }
      })
    }
  }, [visible])

  const handleDownload = (file) => {
    window.open(file, '_blank')
  }

  return (
    <>
      <section id="certificates-hero" className="certificates-hero">
        <div className="certificates-hero-container">
          <div className="certificates-hero-left">
            <p className="certificates-hero-small slide-in-left">CERTIFICATES</p>
            <h1 className="certificates-hero-title slide-in-left">
              <span>Company Certifications</span> & Quality Standards
            </h1>
            <p className="certificates-hero-text slide-in-left">
              We maintain the highest standards of quality and safety. Our certifications demonstrate
              our commitment to excellence in elevator manufacturing and service.
            </p>
          </div>
        </div>
      </section>

      <section className="certificates-section">
        <div className="certificates-container">
          <div className="certificates-grid">
            {certificates.map((cert, idx) => (
              <div key={cert.id} className="certificate-card" ref={el => cardRefs.current[idx] = el}>
                <div className="certificate-image">
                  <img src={cert.img} alt={cert.name} />
                </div>
                <h3 className="certificate-name">{cert.name}</h3>
                <button
                  className="download-btn"
                  onClick={() => handleDownload(cert.file)}
                >
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}