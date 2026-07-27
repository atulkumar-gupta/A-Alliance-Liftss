import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import img1 from '../images/part1.png'

import img2 from '../images/part2.png'
import img3 from '../images/part3.png'
import img4 from '../images/part4.png'
import img5 from '../images/part5.png'
import img6 from '../images/bufferspring.png'
import img7 from '../images/machinebase.png'
import img8 from '../images/ropethimbles.png'
import img9 from '../images/swingdoor.png'

import './oem.css'

const oemImages = [
  { src: img1, caption: 'Bottom plengths / top corona bars' },
  { src: img2, caption: 'Full Vision Glass Doors' },
  { src: img3, caption: 'Over Speed governers' },
  { src: img4, caption: 'Combination brackets' },
  { src: img5, caption: 'Car Frames' },
   {src: img6, caption: 'Buffer Springs' },
    {src: img7, caption: 'Machine Bases' },
     {src: img8, caption: 'Rope Thimbles' },
      { src: img9, caption: 'Full Vision Glass Swing Doors' },
]


export default function OEM() {
  const navigate = useNavigate()

  const [page, setPage] = useState(0)

  const [paused, setPaused] = useState(false)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const manufacturerRef = useRef(null)
  const [headingVisible, setHeadingVisible] = useState(false)

  const cardW   = 280
  const gap     = 28
  const visible = 3
  const total   = oemImages.length

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeadingVisible(true)
      },
      { threshold: 0.3 }
    )
    const el = document.getElementById('oem-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (headingVisible) {
      if (titleRef.current) titleRef.current.classList.add('animate-left')
      if (subtitleRef.current) subtitleRef.current.classList.add('animate-left')
      if (manufacturerRef.current) manufacturerRef.current.classList.add('animate-left')
    }
  }, [headingVisible])

  /** Cycle pages automatically every 2.2 s */
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % total)
    }, 2200)
    return () => clearInterval(timer)
  }, [paused, total])

  /** Expanded array so scrolling 0-cardWidth shows the second batch seamlessly */
  const extended = useMemo(() => [...oemImages, ...oemImages, ...oemImages], [])
  const extendedLen = extended.length

  const goTo = useCallback(
    (idx) => {
      // Normalise idx so clicking first elem of 2nd batch lands on original index
      const clamped = ((idx % total) + total) % total
      setPage(clamped)
    },
    [total]
  )


  const prev = useCallback(() => {
    setPage((p) => (p - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    setPage((p) => (p + 1) % total)
  }, [total])

  /* ─ scroll offset: the *middle* item of the 3-visible window is always centred ─ */
  const slotW = cardW + gap
  const headerOffset = total * slotW          // skip first batch
  const scrollX = headerOffset + page * slotW - (Math.floor(visible / 2) * slotW)

  return (
    <section id="oem-section" className="oem-section">
      <div className="oem-heading">
        <h2 className="oem-title" ref={titleRef}>Original Equipment <span className="oem-sub" ref={manufacturerRef}>Manufacturer</span></h2>
        <p className="oem-subtitle" ref={subtitleRef}>India's Trusted OEM Partner for Safe and Advanced Elevators</p>
      </div>

      <div className="oem-scroll-container"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
        <button className="oem-arrow prev" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        <div className="oem-scroll-wrapper">
          <div className="oem-scroll-track" style={{ width: `${extendedLen * slotW}px`, transform: `translateX(${-scrollX}px)` }}>
            {extended.map((img, i) => {

              return (
                <div
                  key={i}
                  className="oem-card"
                  onClick={() => navigate('/spareparts')}
                  role="button"

                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate('/spareparts')
                  }}
                >

                  <div className="oem-card-image">
                    <img src={img.src} alt={img.caption} />
                  </div>
                  <p className="oem-card-caption">{img.caption}</p>
                </div>
              )
            })}
          </div>

          {/* dots */}
          <div className="oem-dots" role="tablist" aria-label="OEM carousel">
            {oemImages.map((_, i) => (
              <button
                key={i}
                className={`oem-dot${i === page ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                aria-selected={i === page}
                role="tab"
              />
            ))}
          </div>
        </div>

        <button className="oem-arrow next" onClick={next} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </section>
  )
}
