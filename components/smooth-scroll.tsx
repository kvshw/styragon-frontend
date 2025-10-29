"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function SmoothScroll() {
  const router = useRouter()

  useEffect(() => {
    // Handle smooth scrolling when navigating with hash
    const handleHashScroll = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          // Get the element's position
          const elementRect = element.getBoundingClientRect()
          const elementTop = elementRect.top + window.pageYOffset
          
          // Calculate offset for better positioning (account for sticky header)
          const offset = 100
          const targetPosition = elementTop - offset
          
          // Smooth scroll with custom timing
          const startPosition = window.pageYOffset
          const distance = targetPosition - startPosition
          const duration = Math.min(Math.abs(distance) / 2, 800) // Max 800ms, scale with distance
          let startTime = null

          const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime
            const timeElapsed = currentTime - startTime
            const progress = Math.min(timeElapsed / duration, 1)
            
            // Easing function for smoother animation
            const ease = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2
            
            window.scrollTo(0, startPosition + distance * ease)
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animation)
            }
          }
          
          requestAnimationFrame(animation)
        }
      }
    }

    // Run on mount with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(handleHashScroll, 100)

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('hashchange', handleHashScroll)
    }
  }, [])

  return null
}
