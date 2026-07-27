import { useEffect, useState } from 'react'
import './ongoing.css'
import { getAllOngoingProjects } from '../lib/firebaseDB'
import pr2Img from '../images/pr2.jpg'
import pr3Img from '../images/pr3.jpg'
import pr4Img from '../images/pr4.jpg'
import pr7Img from '../images/pr7.png'
import assoImg from '../images/assonew.png'

const fallbackImg = pr2Img

const normalizeImgUrl = (value) => {
  if (!value) return ''
  if (typeof value !== 'string') return ''
  return value.trim()
}

const tagTheme = {
  Railways: { color: '#1e3a5f', bg: '#dce8ff' },
  Metro: { color: '#5b21b6', bg: '#ede9fe' },
  Hospital: { color: '#be123c', bg: '#ffe4e6' },
  Office: { color: '#0f766e', bg: '#ccfbf1' },
  Society: { color: '#b45309', bg: '#ffedd5' },
}

const defaultTheme = { color: '#1e3a5f', bg: '#dce8ff' }

const defaultProjects = [
  { id: 'o1', name: 'Prayagraj Division',        tag: 'Railways', img: pr2Img },
  { id: 'o2', name: 'Fatehpur Railway Station',  tag: 'Railways', img: pr3Img },
  { id: 'o3', name: 'Manikpur Railway Station',  tag: 'Railways', img: pr4Img },
  { id: 'o4', name: 'Prayagraj Central Hospital',tag: 'Hospital', img: pr2Img },
  { id: 'o5', name: 'GM Office',                 tag: 'Office',   img: pr7Img },
  { id: 'o6', name: 'Assotech The Nest',         tag: 'Society',  img: assoImg },
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

export default function OngoingProjects() {
  const [projects, setProjects] = useState(defaultProjects)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getAllOngoingProjects()
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
        console.error('Error loading ongoing projects:', err)
        setProjects(defaultProjects)
      }
    }
    loadProjects()
  }, [])

  const displayProjects = projects

  return (
    <section id="ongoing-section" className="ongoing-section">
      <div className="ongoing-header">
        <span className="ongoing-badge">Live</span>
        <h2 className="ongoing-title">Ongoing <span className="ongoing-sub">Projects</span></h2>
        <p className="ongoing-subtitle">
          Currently under execution - watch our active sites.
        </p>
      </div>

      <div className="ongoing-grid">
        {displayProjects.map((p, i) => {
          const theme = tagTheme[p.tag] || defaultTheme
          return (
            <div
              key={p.id || i}
              className="ongoing-card"
              style={{ '--op-icon-color': theme.color, '--op-icon-bg': theme.bg }}
            >
              <div className="ongoing-card-icon">
                <img
                  src={normalizeImgUrl(p.img || p.image || p.imageUrl || p.url) || fallbackImg}
                  alt={p.name}
                  className="ongoing-project-image"
                  loading="lazy"
                  onError={(e) => {
                    const imgEl = e?.currentTarget
                    if (imgEl) imgEl.src = fallbackImg
                  }}
                />

                <span className="ongoing-tag">{p.tag}</span>
              </div>

              <div className="ongoing-card-body">
                <h3 className="ongoing-card-name">{p.name}</h3>
                <p className="ongoing-card-note">{p.note || 'In progress'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
