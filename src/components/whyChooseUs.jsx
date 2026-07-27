import { useEffect, useState, useRef } from 'react'
import './whyChooseUs.css'
import whychooseImg from '../images/wc.png'

export default function WhyChooseUs() {
  const [visible, setVisible] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    const el = document.getElementById('why-choose-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (visible) {
      if (titleRef.current) titleRef.current.classList.add('animate-left')
    }
  }, [visible])

  return (
    <section id="why-choose-section" className="why-section">
      <div className="why-header">
        <h2 className="why-title" ref={titleRef}>Why <span className="whysub">Cho😊se Us </span>?</h2>
      </div>

      <div className="why-image-wrap">
        <img src={whychooseImg} alt="Why Choose Alliance Lifts" className="why-image" />
      </div>
    </section>
  )
}
