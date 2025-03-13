"use client"

import { useState, useEffect } from "react"

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down")
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      // Determine scroll direction
      const direction = scrollY > lastScrollY ? "down" : "up"

      // Only update state if direction has changed and there's a significant scroll
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction)
        // Set data attribute on document for GSAP to observe
        document.documentElement.setAttribute("data-scroll-direction", direction)
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0)
    }

    window.addEventListener("scroll", updateScrollDirection)

    return () => {
      window.removeEventListener("scroll", updateScrollDirection)
    }
  }, [scrollDirection, lastScrollY])

  return scrollDirection
}

