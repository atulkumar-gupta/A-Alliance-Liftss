import { useEffect, useState, useRef } from 'react'

export default function Stats() {
  const [visible, setVisible] = useState(false)
  const statRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    const el = document.getElementById('stats-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (visible) {
      statRefs.current.forEach((ref, i) => {
        if (ref) {
          ref.classList.add('stat-visible')
          ref.style.animationDelay = `${i * 0.1}s`
        }
      })
    }
  }, [visible])

  const stats = [
    { value: '200+', label: 'Projects', suffix: '' },
    { value: '12+', label: 'Years', suffix: '' },
    { value: '24/7', label: 'Support', suffix: '' },
    { value: '100%', label: 'Quality Focus', suffix: '' },
  ]

  return (
    <section id="stats-section" className="stats-section">
      <div className="stats-container">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-box${visible ? ' visible' : ''}`} ref={el => statRefs.current[i] = el} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
