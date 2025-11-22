import { useState, useRef, useEffect } from 'react'
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
  const animationStartedRef = useRef(false)

  // Reset animation state when isActive changes
  useEffect(() => {
    if (isActive) {
      animationStartedRef.current = false
      setProgress(direction === 'boot' ? 0 : 100)
    }
  }, [isActive, direction])

  useGSAP(() => {
    if (!isActive) {
      animationStartedRef.current = false
      return
    }
    
    if (!containerRef.current || !logoRef.current || !progressBarRef.current) {
      return
    }

    // Prevent multiple animations
    if (animationStartedRef.current) {
      return
    }
    
    animationStartedRef.current = true

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

      // Progress bar animation: 0% -> 10% -> 30% -> 40% -> 60% -> 70% -> 100% (5 seconds total)
      const progressObj = { value: 0 }
      const progressTimeline = gsap.timeline()
      
      // Total duration: 5 seconds
      // Chunks: 10, 30, 40, 60, 70, 100
      progressTimeline
        .to(progressObj, {
          value: 10,
          duration: 0.5, // 0.5s
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 30,
          duration: 0.8, // 0.8s (total: 1.3s)
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 40,
          duration: 0.4, // 0.4s (total: 1.7s)
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 60,
          duration: 0.8, // 0.8s (total: 2.5s)
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 70,
          duration: 0.5, // 0.5s (total: 3.0s)
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          }
        })
        .to(progressObj, {
          value: 100,
          duration: 2.0, // 2.0s (total: 5.0s)
          ease: 'power1.out',
          onUpdate: function() {
            setProgress(progressObj.value)
          },
          onComplete: () => {
            if (autoFadeOut && containerRef.current) {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                delay: fadeOutDelay,
                ease: 'power2.in',
                onComplete: () => {
                  animationStartedRef.current = false
                  onComplete?.()
                }
              })
            } else {
              animationStartedRef.current = false
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
            animationStartedRef.current = false
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

