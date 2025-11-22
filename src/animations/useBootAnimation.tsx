import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

type AnimationDirection = 'boot' | 'shutdown'

interface UseBootAnimationProps {
  isActive: boolean
  direction?: AnimationDirection
  onComplete?: () => void
  autoFadeOut?: boolean
  fadeOutDelay?: number
}

export default function useBootAnimation({
  isActive,
  direction = 'boot',
  onComplete,
  autoFadeOut = false,
  fadeOutDelay = 0,
}: UseBootAnimationProps) {
  const [progress, setProgress] = useState(direction === 'boot' ? 0 : 100)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!isActive || !containerRef.current || !logoRef.current || !progressBarRef.current) return

    if (direction === 'boot') {
      // Boot animation: 0% -> 10% -> 30% -> 40% -> 70% -> 100%
      setProgress(0)

      // Fade in logo
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 })
      gsap.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      })

      // Progress bar animation
      const progressObj = { value: 0 }
      const progressTimeline = gsap.timeline()
      
      progressTimeline
        .to(progressObj, {
          value: 10,
          duration: 0.6,
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 30,
          duration: 0.8,
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 40,
          duration: 0.4,
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 70,
          duration: 1.0,
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 100,
          duration: 0.7,
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          },
          onComplete: () => {
            if (autoFadeOut) {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                delay: fadeOutDelay,
                ease: 'power2.in',
                onComplete: () => {
                  onComplete?.()
                }
              })
            } else {
              onComplete?.()
            }
          }
        })
    } else {
      // Shutdown animation: 100% -> 70% -> 40% -> 30% -> 10% -> 0%
      setProgress(100)

      // Fade out logo
      gsap.to(logoRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'power2.in',
      })

      // Progress bar animation (reverse)
      const progressObj = { value: 100 }
      const progressTimeline = gsap.timeline()
      
      progressTimeline
        .to(progressObj, {
          value: 70,
          duration: 0.7,
          ease: 'power1.in',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 40,
          duration: 1.0,
          ease: 'power1.in',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 30,
          duration: 0.4,
          ease: 'power1.in',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 10,
          duration: 0.8,
          ease: 'power1.in',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 0,
          duration: 0.6,
          ease: 'power1.in',
          onUpdate: function() {
            setProgress(progressObj.value)
          },
          onComplete: () => {
            onComplete?.()
          }
        })
    }
  }, [isActive, direction, onComplete, autoFadeOut, fadeOutDelay])

  return {
    progress,
    containerRef,
    logoRef,
    progressBarRef,
  }
}

