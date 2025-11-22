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
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer"
      onClick={handleUnlock}
      style={{
        background: 'linear-gradient(180deg, #a8d5e2 0%, #d4a5c7 25%, #e88a8a 50%, #4a7c59 75%, #8bc34a 100%)',
      }}
    >
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-2 text-white/90">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs">U.S.</span>
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
      <div className="flex flex-col items-center gap-8">
        {/* Time */}
        <div className="text-center">
          <div className="text-8xl font-light text-white mb-2">{currentTime}</div>
          <div className="text-xl text-white/80 font-normal">{currentDate}</div>
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-white/30">
              <span className="text-3xl font-normal text-white">RG</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>
          <div className="w-64 h-12 bg-white/20 backdrop-blur-xl rounded-lg border border-white/30 flex items-center justify-center">
            <span className="text-white/70 text-sm">Click anywhere to unlock</span>
          </div>
        </div>
      </div>
    </div>
  )
}

