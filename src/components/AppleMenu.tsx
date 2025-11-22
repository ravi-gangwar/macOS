"use client"
import { useRef } from 'react'
import { Power, Lock, RotateCcw, LucideIcon } from 'lucide-react'
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

interface MenuItemProps {
  icon: LucideIcon
  label: string
  onClick: () => void
}

function MenuItem({ icon: Icon, label, onClick }: MenuItemProps) {
  const { getTextSize } = useTextSize()

  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-3 py-1.5 text-left transition-colors duration-150 cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border-0 bg-transparent rounded-sm mx-1 group"
      onClick={onClick}
    >
      <Icon className="w-4 h-4 shrink-0 text-gray-600 dark:text-gray-300 transition-colors" />
      <span className={`${getTextSize('sm')} font-normal`}>{label}</span>
    </button>
  )
}

function MenuSeparator() {
  return <div className="h-px my-1 mx-2 bg-gray-300/50 dark:bg-gray-600/50 border-0" />
}

export default function AppleMenu({ isOpen, onClose, onRestart, onLock }: AppleMenuProps) {
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
    
    // Trigger restart animation
    window.dispatchEvent(new CustomEvent('macos-restart'))
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
      className="absolute top-full left-0 mt-2 z-[10003] min-w-[200px] py-1 rounded-lg overflow-hidden pointer-events-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl backdrop-saturate-150 border border-black/10 dark:border-white/10 shadow-lg shadow-black/15 ring-1 ring-white/50 dark:ring-white/10"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem icon={RotateCcw} label="Restart" onClick={handleRestart} />
      <MenuItem icon={Power} label="Shut Down" onClick={handleShutdown} />
      <MenuSeparator />
      <MenuItem icon={Lock} label="Lock Screen" onClick={handleLock} />
    </div>
  )
}

