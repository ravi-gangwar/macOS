"use client"
import { useState, useEffect, useRef } from 'react'
import useBootAnimation from '../animations/useBootAnimation'
import LockScreen from './LockScreen'

type ShutdownState = 'idle' | 'shutting-down' | 'black-screen' | 'booting-up'

interface ShutdownManagerProps {
  onShutdown: () => void
  children: React.ReactNode
}

export function useShutdown() {
  const [shutdownState, setShutdownState] = useState<ShutdownState>('idle')
  
  const startShutdown = () => {
    setShutdownState('shutting-down')
  }

  return { shutdownState, startShutdown, setShutdownState }
}

export default function ShutdownManager({ onShutdown, children }: ShutdownManagerProps) {
  const [shutdownState, setShutdownState] = useState<ShutdownState>('idle')
  const [isLocked, setIsLocked] = useState(false)
  const blackScreenRef = useRef<HTMLDivElement>(null)

  // Listen for lock trigger
  useEffect(() => {
    const handleLock = () => {
      setIsLocked(true)
    }
    
    window.addEventListener('macos-lock', handleLock)
    return () => window.removeEventListener('macos-lock', handleLock)
  }, [])

  // Listen for restart trigger
  useEffect(() => {
    const handleRestart = () => {
      setShutdownState('booting-up')
    }
    
    window.addEventListener('macos-restart', handleRestart)
    return () => window.removeEventListener('macos-restart', handleRestart)
  }, [])

  // Listen for shutdown trigger from parent
  useEffect(() => {
    const handleShutdown = () => {
      setShutdownState('shutting-down')
    }
    
    // Custom event listener for shutdown
    window.addEventListener('macos-shutdown', handleShutdown)
    return () => window.removeEventListener('macos-shutdown', handleShutdown)
  }, [])

  // Shutdown animation using hook
  const shutdownAnimation = useBootAnimation({
    isActive: shutdownState === 'shutting-down',
    direction: 'shutdown',
    onComplete: () => {
      setShutdownState('black-screen')
      onShutdown()
    }
  })

  // Black screen with key listener
  useEffect(() => {
    if (shutdownState !== 'black-screen') return

    const handleKeyPress = () => {
      setShutdownState('booting-up')
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('click', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('click', handleKeyPress)
    }
  }, [shutdownState])

  // Boot up animation using hook
  const bootAnimation = useBootAnimation({
    isActive: shutdownState === 'booting-up',
    direction: 'boot',
    autoFadeOut: true,
    fadeOutDelay: 0.5,
    onComplete: () => {
      setShutdownState('idle')
    }
  })

  return (
    <>
      <div className={shutdownState !== 'idle' || isLocked ? 'hidden' : ''}>
        {children}
      </div>
      {shutdownState === 'black-screen' && (
        <div
          ref={blackScreenRef}
          className="fixed inset-0 z-[99999] bg-black flex items-center justify-center cursor-pointer"
        >
          <div className="text-white/20 text-sm select-none">Press any key to boot up</div>
        </div>
      )}
      {shutdownState === 'shutting-down' && (
        <div
          ref={shutdownAnimation.containerRef}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center"
        >
          <div ref={shutdownAnimation.logoRef} className="mb-12 flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
          <div className="w-64">
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                ref={shutdownAnimation.progressBarRef}
                className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                style={{ width: `${shutdownAnimation.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      {shutdownState === 'booting-up' && (
        <div
          ref={bootAnimation.containerRef}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center opacity-100"
          style={{ display: 'flex' }}
        >
          <div ref={bootAnimation.logoRef} className="mb-12 flex items-center justify-center opacity-0">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
          <div className="w-64">
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                ref={bootAnimation.progressBarRef}
                className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                style={{ width: `${bootAnimation.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      <LockScreen 
        isLocked={isLocked} 
        onUnlock={() => setIsLocked(false)} 
      />
    </>
  )
}

