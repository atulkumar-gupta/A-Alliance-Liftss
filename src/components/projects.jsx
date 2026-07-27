import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllProjects } from '../lib/firebaseDB'
import './projects.css'
import pr1 from '../images/pr1.png'
import pr2 from '../images/pr2.jpg'
import pr3 from '../images/pr3.jpg'
import pr4 from '../images/pr4.jpg'
import pr5 from '../images/pr5.png'
import pr6 from '../images/pr6.jpg'
import pr7 from '../images/pr7.png'
import pr9 from '../images/pr9.png'
import pr10 from '../images/pr10.png'
import pr11 from '../images/pr11.jpg'
import pr12 from '../images/pr12.png'
import pr13 from '../images/pr13.jpg'
import pr14 from '../images/pr14.png'
import pr15 from '../images/pr15.png'

const normalizeImgUrl = (value) => {
  if (!value) return ''
  if (typeof value !== 'string') return ''
  return value.trim()
}

const fallbackImg = pr1

const defaultProjects = [
  { id: 'p1',  name: 'HTC Haryana Tourism',          tag: 'Tourism',       img: pr1  },
  { id: 'p2',  name: 'Phaphamau Railway Station',     tag: 'Railways',      img: pr2  },
  { id: 'p3',  name: 'Ambala Railway Station',        tag: 'Railways',      img: pr3  },
  { id: 'p4',  name: 'Saharanpur Railway Station',    tag: 'Railways',      img: pr4  },
  { id: 'p5',  name: 'WCR Guna Railway Station',      tag: 'Railways',      img: pr5  },
  { id: 'p6',  name: 'Varanasi Railway Station',      tag: 'Railways',      img: pr6  },
  { id: 'p7',  name: 'Sultanpur Railway Station',     tag: 'Railways',      img: pr7  },
  { id: 'p8',  name: 'Ayodhya DRM Office',            tag: 'Railways',      img: pr9  },
  { id: 'p9',  name: 'Supreme Court of India',        tag: 'Government',    img: pr10 },
  { id: 'p10', name: 'Kapurthala Railcoach Factory',  tag: 'Manufacturing', img: pr11 },
  { id: 'p11', name: 'DMRC',                          tag: 'Metro',         img: pr12 },
  { id: 'p12', name: 'MMRC',                          tag: 'Metro',         img: pr13 },
  { id: 'p13', name: 'NDLS',                          tag: 'Railways',      img: pr14 },
  { id: 'p14', name: 'Chandigarh Railway Station',    tag: 'Railways',      img: pr15 },
  { id: 'p15', name: 'Bikaner-Hisar Railway Station', tag: 'Railways',      img: pr2  },
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

export default function Projects() {
  const [page,    setPage]   = useState(0)
  const [paused,  setPaused] = useState(false)
  const [projects, setProjects] = useState(defaultProjects)
  const trackRef = useRef(null)
  const gap      = 20
  const visibleCount = 3

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getAllProjects()
        if (data && data.length > 0) {
          const withImages = normalizeProjectList(data, defaultProjects).map(p => {
            const imgUrl = normalizeImgUrl(p.img || p.image || p.imageUrl || p.url)
            return {
              ...p,
              img: imgUrl || fallbackImg
            }
          })
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


  const total = projects.length
  const pageCount = Math.ceil(total / visibleCount)

  const getCardWidth = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const trackW = track.clientWidth
    return (trackW - gap * (visibleCount - 1)) / visibleCount
  }, [gap, visibleCount])

  const advanceOne = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cardW = getCardWidth()
    const pageW = (cardW + gap) * visibleCount
    const nearEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
    if (nearEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      track.scrollBy({ left: pageW, behavior: 'smooth' })
    }
  }, [getCardWidth, gap, visibleCount])

  const prev = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cardW = getCardWidth()
    const pageW = (cardW + gap) * visibleCount
    track.scrollTo({ left: Math.max(0, track.scrollLeft - pageW), behavior: 'smooth' })
  }, [getCardWidth, gap, visibleCount])

  const next = useCallback(() => {
    advanceOne()
  }, [advanceOne])

  const syncPage = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cardW = getCardWidth()
    const pageW = (cardW + gap) * visibleCount
    const idx = Math.round(track.scrollLeft / pageW)
    setPage(Math.max(0, Math.min(idx, pageCount - 1)))
  }, [getCardWidth, gap, visibleCount, pageCount])

  const goTo = useCallback((i) => {
    const track = trackRef.current
    if (!track) return
    const cardW = getCardWidth()
    const pageW = (cardW + gap) * visibleCount
    track.scrollTo({ left: pageW * i, behavior: 'smooth' })
  }, [getCardWidth, gap, visibleCount])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(advanceOne, 2500)
    return () => clearInterval(timer)
  }, [paused, advanceOne])

  return (
    <section id="projects-section" className="projects-section">
      <div className="projects-header">
        <span className="completed-badge">Completed</span>
        <h2 className="projects-title">Our <span className="proj-sub">Projects</span></h2>
        <p className="projects-subtitle">
          Trusted across railways, government, metro, and industrial sectors across India.
        </p>
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
             <polyline points="15 18 9 12 15 6"/>
           </svg>
         </button>


        <div className="projects-scroll-wrap">
          <div className="projects-track" ref={trackRef} onScroll={syncPage}>
            {projects.length > 0 && projects.map((p, i) => (
              <div key={p.id || i} className={`project-card${i === page ? ' active' : ''}`}>
                <div className="project-card-scroll-body">
                  <div className="project-card-image">
                    <img
                      src={normalizeImgUrl(p.img || p.image || p.imageUrl || p.url) || fallbackImg}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => {
                        const imgEl = e?.currentTarget
                        if (imgEl) imgEl.src = fallbackImg
                      }}
                    />

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
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <div className="projects-dots" role="tablist" aria-label="Project pages">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            className={`projects-dot${i === page ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Page ${i + 1}`}
            role="tab"
            aria-selected={i === page}
          />
        ))}
      </div>

    </section>
  )
}