import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects } from '../lib/firebaseDB'
import './projects.css'

const fallbackImg = 'https://placehold.co/300x200/png'

const defaultProjects = [
  { id: 'p1', name: 'HTC Haryana Tourism', tag: 'Tourism', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p2', name: 'Phaphamau Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p3', name: 'Ambala Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p4', name: 'Saharanpur Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p5', name: 'WCR Guna Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p6', name: 'Varanasi Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p7', name: 'Sultanpur Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p8', name: 'Ayodhya DRM Office', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p9', name: 'Supreme Court of India', tag: 'Government', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p10', name: 'Kapurthala Railcoach Factory', tag: 'Manufacturing', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p11', name: 'DMRC', tag: 'Metro', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p12', name: 'MMRC', tag: 'Metro', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p13', name: 'NDLS', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p14', name: 'Chandigarh Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
  { id: 'p15', name: 'Bikaner–Hisar Railway Station', tag: 'Railways', img: 'https://placehold.co/300x200/png', image: 'https://placehold.co/300x200/png' },
]

const normalizeProjectList = (data, fallback) => {
  if (!data || data.length === 0) return fallback
  if (data.length >= fallback.length) return data
  const fallbackIds = new Set(fallback.map(item => String(item.id)))
  return [
    ...fallback,
    ...data.filter(item => !fallbackIds.has(String(item.id)))
  ]
}

export default function CompletedProjects() {
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const [projects, setProjects] = useState([])
  const trackRef = useRef(null)
  const gap = 20

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getAllProjects()
        if (data && data.length > 0) {
          const withImages = normalizeProjectList(data, defaultProjects).map(p => ({
            ...p,
            img: p.img || p.image || fallbackImg
          }))
          setProjects(withImages)
        } else {
          setProjects(defaultProjects)
        }
      } catch (err) {
        console.error('Error loading projects:', err)
        setProjects(defaultProjects)
      }
    }
    loadProjects()
  }, [])

  const displayProjects = projects.length > 0 ? projects : defaultProjects
  const total = displayProjects.length

  const getCardData = useCallback(() => {
    const track = trackRef.current
    if (!track) return { cardW: 0 }
    const hw = track.clientWidth
    const cnt = total
    const gapPx = 20
    const pad = 40
    const cw = (hw - pad * 2 - gapPx * (cnt - 1)) / cnt
    return { cardW: cw }
  }, [total])

  const advanceOne = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const nearEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
    if (nearEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      const { cardW } = getCardData()
      track.scrollBy({ left: cardW + gap, behavior: 'smooth' })
    }
  }, [getCardData, gap])

  const prev = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { cardW } = getCardData()
    track.scrollTo({ left: Math.max(0, track.scrollLeft - cardW - gap), behavior: 'smooth' })
  }, [getCardData, gap])

  const next = useCallback(() => {
    advanceOne()
  }, [advanceOne])

  const syncPage = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { cardW } = getCardData()
    const idx = Math.floor(track.scrollLeft / (cardW + gap) + 0.5)
    setPage(Math.max(0, Math.min(idx, total - 1)))
  }, [getCardData, gap, total])

  const goTo = useCallback((i) => {
    const track = trackRef.current
    if (!track) return
    const { cardW } = getCardData()
    track.scrollTo({
      left: (cardW + gap) * i,
      behavior: 'smooth'
    })
  }, [getCardData, gap])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(advanceOne, 2500)
    return () => clearInterval(timer)
  }, [paused, advanceOne])

  return (
    <section id="projects-section" className="projects-section">
      <div className="projects-header">
        <span className="completed-badge">Completed</span>
        <h2 className="projects-title">Our <span className="proj-sub">Completed Projects</span></h2>
        <p className="projects-subtitle">Successfully delivered projects - our track record of excellence.</p>
      </div>

      <div
        className="projects-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          className="projects-project-arrow prev"
          onClick={prev}
          aria-label="Previous projects"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="projects-scroll-wrap">
          <div className="projects-track" ref={trackRef} onScroll={syncPage}>
            {displayProjects.map((p, i) => (
              <div key={p.id || i} className={`project-card${i === page ? ' active' : ''}`}>
                <div className="project-card-scroll-body">
                  <div className="project-card-image">
                    <img src={p.img || p.image || fallbackImg} alt={p.name} onError={(e) => { e.target.src = fallbackImg }} />
                  </div>
                  <div className="project-card-info">
                    <h3 className="project-card-name">{p.name}</h3>
                    <span className="project-card-tag">{p.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="projects-project-arrow next"
          onClick={next}
          aria-label="Next projects"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="projects-dots" role="tablist" aria-label="Project pages">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            className={`projects-dot${i === page ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={displayProjects[i].name}
            role="tab"
            aria-selected={i === page}
          />
        ))}
      </div>

      <Link to="/admin/projects" className="floating-admin-btn" title="Projects Admin">
        <span className="floating-admin-label">Projects Admin</span>
      </Link>
    </section>
  )
}