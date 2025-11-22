"use client"
import { useState, useRef, useEffect } from 'react'
import { Power, Lock, RotateCcw } from 'lucide-react'
import { useTextSize } from '../hooks/useTextSize'
import useSettingsStore from '../store/settings'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface AppleMenuProps {
  isOpen: boolean
  onClose: () => void
  onRestart: () => void
  onLock: () => void
}

export default function AppleMenu({ isOpen, onClose, onRestart, onLock }: AppleMenuProps) {
  const { getTextSize } = useTextSize()
  const menuRef = useRef<HTMLDivElement>(null)
  const { setTextSize, setDarkTheme, setBrightness } = useSettingsStore()

  useGSAP(() => {
    if (!menuRef.current) return

    if (isOpen) {
      gsap.fromTo(menuRef.current, 
        { opacity: 0, scale: 0.95, y: -5 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }
      )
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in'
      })
    }
  }, [isOpen])

  const handleRestart = () => {
    // Reset all settings to defaults
    setTextSize('sm')
    setDarkTheme(false)
    setBrightness(100)
    
    // Clear localStorage settings
    localStorage.removeItem('macos-portfolio-settings')
    
    // Clear visited flag to show boot screen
    localStorage.removeItem('macos-portfolio-visited')
    
    // Close menu
    onClose()
    
    // Trigger restart (show boot screen)
    onRestart()
  }

  const handleShutdown = () => {
    // Close menu
    onClose()
    // Trigger shutdown animation
    window.dispatchEvent(new CustomEvent('macos-shutdown'))
  }

  const handleLock = () => {
    // Close menu
    onClose()
    // Trigger lock screen
    onLock()
  }

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-1 z-[10003] min-w-[200px] py-2 rounded-xl overflow-hidden bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 shadow-2xl"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), 0 1px 0 0 rgba(255, 255, 255, 0.3) inset'
      }}
    >
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-blue-500/90 hover:text-white dark:hover:bg-blue-600/90 border-0 bg-transparent rounded-md mx-1 active:scale-[0.98]"
          onClick={handleRestart}
        >
          <RotateCcw className="w-4 h-4 flex-shrink-0" />
          <span className={getTextSize('sm')}>Restart</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-blue-500/90 hover:text-white dark:hover:bg-blue-600/90 border-0 bg-transparent rounded-md mx-1 active:scale-[0.98]"
          onClick={handleShutdown}
        >
          <Power className="w-4 h-4 flex-shrink-0" />
          <span className={getTextSize('sm')}>Shut Down</span>
        </button>
        <div className="h-px my-1 mx-2 bg-gray-300/50 dark:bg-gray-600/50 border-0" />
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-blue-500/90 hover:text-white dark:hover:bg-blue-600/90 border-0 bg-transparent rounded-md mx-1 active:scale-[0.98]"
          onClick={handleLock}
        >
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span className={getTextSize('sm')}>Lock Screen</span>
        </button>
    </div>
  )
}

