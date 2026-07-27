import { useEffect, useState } from 'react'
import { loadAnnouncements } from '../data/announcementsUtils'
import './announcement.css'

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([])
  const [current, setCurrent] = useState(0)
  const [dismissed, setDismissed] = useState([])
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    loadAnnouncements().then(data => {
      if (data && data.length > 0) {
        setAnnouncements(data)
      }
    }).catch(() => {
      console.warn('Failed to load announcements')
    })
  }, [])

  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id))

  useEffect(() => {
    if (visibleAnnouncements.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % visibleAnnouncements.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [visibleAnnouncements.length])

  const dismiss = (id) => {
    setDismissed(prev => [...prev, id])
  }

  if (!visibleAnnouncements.length) return null

  const safeCurrent = Math.min(current, Math.max(visibleAnnouncements.length - 1, 0))
  const announcement = visibleAnnouncements[safeCurrent]

  return (
    <div className="announcement-overlay">
      <div className="announcement-card">
        <div className="announcement-image-wrapper">
          {announcement.img && !imgError ? (
            <img
                key={announcement.id}
                src={announcement.img}
              alt={announcement.title || 'Announcement'}
              className="announcement-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="announcement-image-fallback">
              <span className="announcement-fallback-icon">📢</span>
              <span>Announcement</span>
            </div>
          )}
          <div className="announcement-image-gradient" />
        </div>
        <div className="announcement-body">
          <h3 className="announcement-tag">Latest Update</h3>
          <h2 className="announcement-title">{announcement.title}</h2>
          <p className="announcement-description">{announcement.description}</p>
          <button
            className="announcement-close-btn"
            onClick={() => dismiss(announcement.id)}
            aria-label="Close"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
