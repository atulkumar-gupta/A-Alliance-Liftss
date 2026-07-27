import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useScrollToTopOnRouteChange() {
  const location = useLocation()

  useEffect(() => {
    // Force scroll-to-top on every route change (nav links + programmatic navigation)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname, location.search, location.hash])
}

