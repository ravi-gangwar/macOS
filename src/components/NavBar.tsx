"use client"
import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { Wifi, Search, User, Settings } from 'lucide-react'
import { navLinks, WINDOW_CONFIG } from '../constants'
import BatteryIndicator from './BatteryIndicator'
import useWindowStore from '../store/window'
import { useTextSize } from '../hooks/useTextSize'
import AppleMenu from './AppleMenu'

function NavBar() {
  const [currentTime, setCurrentTime] = useState(dayjs().format("ddd MMM D h:mm A"))
  const [showAppleMenu, setShowAppleMenu] = useState(false)
  const appleMenuRef = useRef<HTMLDivElement>(null)
  const { openWindow, windows } = useWindowStore();
  const { getTextSize } = useTextSize();

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("ddd MMM D h:mm A"))
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (appleMenuRef.current && !appleMenuRef.current.contains(event.target as Node)) {
        setShowAppleMenu(false)
      }
    }

    if (showAppleMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAppleMenu])

  const handleSettingsClick = () => {
    const settingsWindow = windows.settings;
    if (settingsWindow.isOpen) {
      // If already open, focus it
      useWindowStore.getState().focusWindow('settings');
    } else {
      openWindow('settings');
    }
  }

  const handleNavLinkClick = (type: string) => {
    const windowKey = type as keyof typeof WINDOW_CONFIG;
    
    if (windowKey in WINDOW_CONFIG) {
      const window = windows[windowKey];
      
      if (window.isMinimized) {
        useWindowStore.getState().restoreWindow(windowKey);
      } else if (window.isOpen) {
        useWindowStore.getState().focusWindow(windowKey);
      } else {
        openWindow(windowKey);
      }
    }
  }

  const navIcons = [
    { id: 1, icon: Wifi, name: 'WiFi', onClick: undefined },
    { id: 2, icon: Search, name: 'Search', onClick: undefined },
    { id: 3, icon: User, name: 'User', onClick: undefined },
    { id: 4, icon: Settings, name: 'Settings', onClick: handleSettingsClick },
  ]

  return (
    <nav className='nav'>
        <div className="nav-left">
            <div 
              className="nav-apple-menu" 
              ref={appleMenuRef}
              onMouseEnter={() => setShowAppleMenu(true)}
              onMouseLeave={() => setShowAppleMenu(false)}
            >
                <button 
                  type="button"
                  className="nav-apple-btn"
                  aria-label="Apple menu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </button>
                <p className={`nav-apple-text ${getTextSize('sm')}`}>Ravi</p>
                <AppleMenu 
                  isOpen={showAppleMenu} 
                  onClose={() => setShowAppleMenu(false)}
                  onRestart={() => {
                    // Clear visited flag to show boot screen
                    localStorage.removeItem('macos-portfolio-visited')
                    // Reload page to show boot screen
                    window.location.reload()
                  }}
                />
            </div>
            <ul className="nav-menu">
                {navLinks.map(({id, name, type}) => (
                  <li 
                    key={id} 
                    className={`nav-menu-item ${getTextSize('sm')}`}
                    onClick={() => handleNavLinkClick(type)}
                  >
                    {name}
                  </li>
                ))}
            </ul>
        </div>
        <div className="nav-right">
            <ul className="nav-icons">
                {navIcons.map(({id, icon: Icon, name, onClick}) => (
                  <li 
                    key={id} 
                    className="nav-icon-item" 
                    title={name}
                    onClick={onClick}
                  >
                    <Icon className="w-4 h-4" />
                  </li>
                ))}
            </ul>
            <BatteryIndicator />
            <time className={`nav-time ${getTextSize('sm')}`}>{currentTime}</time>
        </div>
    </nav>
  )
}

export default NavBar