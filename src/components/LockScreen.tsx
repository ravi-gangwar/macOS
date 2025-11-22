"use client"
import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import dayjs from 'dayjs'

interface LockScreenProps {
  isLocked: boolean
  onUnlock: () => void
}

export default function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(dayjs().format('h:mm'))
  const [currentDate, setCurrentDate] = useState(dayjs().format('dddd, MMMM D'))
  const lockScreenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('h:mm'))
      setCurrentDate(dayjs().format('dddd, MMMM D'))
    }, 60000)

    // Initial update
    setCurrentTime(dayjs().format('h:mm'))
    setCurrentDate(dayjs().format('dddd, MMMM D'))

    return () => clearInterval(interval)
  }, [])

  useGSAP(() => {
    if (!lockScreenRef.current) return

    if (isLocked) {
      gsap.fromTo(lockScreenRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
    } else {
      gsap.to(lockScreenRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Component will be unmounted
        }
      })
    }
  }, [isLocked])

  const handleUnlock = () => {
    onUnlock()
  }

  if (!isLocked) return null

  return (
    <div
      ref={lockScreenRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleUnlock}
    >
      {/* Abstract Background - Dark Color Scheme */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #0a0a0a 100%)',
        }}
      >
        {/* Wave-like shapes for depth */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path d="M0,200 Q300,100 600,200 T1200,200 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.03)" />
          <path d="M0,400 Q300,300 600,400 T1200,400 L1200,200 L0,200 Z" fill="rgba(255,255,255,0.02)" />
          <path d="M0,600 Q300,500 600,600 T1200,600 L1200,400 L0,400 Z" fill="rgba(0,0,0,0.2)" />
          <path d="M0,800 Q300,700 600,800 T1200,800 L1200,600 L0,600 Z" fill="rgba(0,0,0,0.3)" />
        </svg>
      </div>
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-2 text-white/90 z-10">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-normal">U.S.</span>
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.67 4H14V2c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.67 4H14V2c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-between h-full w-full relative z-10 py-12">
        {/* Time - Top */}
        <div className="text-center mt-12">
          <div className="text-8xl font-light text-white mb-2 drop-shadow-lg">{currentTime}</div>
          <div className="text-xl text-white/90 font-normal drop-shadow-md">{currentDate}</div>
        </div>

        {/* User Profile - Bottom */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-xl border-2 border-white/20">
              <span className="text-xl font-normal text-white">RG</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>
          <div className="w-64 h-12 bg-black/30 backdrop-blur-xl rounded-lg border border-white/20 flex items-center justify-center shadow-lg">
            <span className="text-white/80 text-sm font-normal">Click anywhere to unlock</span>
          </div>
        </div>
      </div>
    </div>
  )
}

