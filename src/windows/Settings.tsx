"use client"
import { useState } from 'react'
import WindowWrapper from '../hoc/WindowWrapper'
import useSettingsStore, { TextSize } from '../store/settings'
import { Check, Monitor, Moon, Sun, Minus, Plus } from 'lucide-react'
import { useTextSize } from '../hooks/useTextSize'
type SettingsSection = 'display';

function Settings() {
  const { textSize, setTextSize, darkTheme, setDarkTheme, brightness, setBrightness } = useSettingsStore();
  const { getTextSize } = useTextSize();
  const [activeSection, setActiveSection] = useState<SettingsSection>('display');

  const textSizes: { value: TextSize; label: string }[] = [
    { value: "sm", label: "sm" },
    { value: "md", label: "md" },
    { value: "lg", label: "lg" },
    { value: "xl", label: "xl" },
  ];

  const sections = [
    { id: 'display' as SettingsSection, label: 'Display', icon: Monitor },
  ];

  return (
    <div className="settings-window">
      <div className="settings-layout">
        {/* Sidebar Navigation */}
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`settings-nav-item ${activeSection === section.id ? 'settings-nav-item-active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon className="settings-nav-icon" />
                  <span className={getTextSize('sm')}>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="settings-content">
          {activeSection === 'display' && (
            <div className="settings-section">
              {/* Appearance Section */}
              <div className="settings-group">
                <div className="settings-group-header">
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600 dark:text-gray-400">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <h3 className={`settings-group-title ${getTextSize('lg')} font-normal text-gray-900 dark:text-gray-100`}>Appearance</h3>
                  </div>
                </div>
                
                <div className="settings-options">
                  <button
                    type="button"
                    className={`settings-option ${!darkTheme ? 'settings-option-active' : ''}`}
                    onClick={() => setDarkTheme(false)}
                  >
                    <div className="settings-option-content">
                      <div className="flex items-center gap-3">
                        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className={`settings-option-label ${getTextSize('md')} font-normal text-gray-900 dark:text-gray-100`}>Light</span>
                      </div>
                    </div>
                    {!darkTheme && (
                      <Check className="settings-option-check" />
                    )}
                  </button>

                  <button
                    type="button"
                    className={`settings-option ${darkTheme ? 'settings-option-active' : ''}`}
                    onClick={() => setDarkTheme(true)}
                  >
                    <div className="settings-option-content">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className={`settings-option-label ${getTextSize('md')} font-normal text-gray-900 dark:text-gray-100`}>Dark</span>
                      </div>
                    </div>
                    {darkTheme && (
                      <Check className="settings-option-check" />
                    )}
                  </button>
                </div>
              </div>

              {/* Brightness Settings */}
              <div className="settings-group">
                <div className="settings-group-header">
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600 dark:text-gray-400">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                    </svg>
                    <h3 className={`settings-group-title ${getTextSize('lg')} font-normal text-gray-900 dark:text-gray-100`}>Brightness</h3>
                  </div>
                </div>
                
                <div className="settings-brightness-control">
                  <button
                    type="button"
                    className="settings-brightness-btn"
                    onClick={() => setBrightness(Math.max(0, brightness - 10))}
                    disabled={brightness <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="settings-brightness-slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="settings-brightness-slider"
                    />
                  </div>
                  <button
                    type="button"
                    className="settings-brightness-btn"
                    onClick={() => setBrightness(Math.min(100, brightness + 10))}
                    disabled={brightness >= 100}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className={`settings-brightness-value ${getTextSize('sm')} font-normal text-gray-700 dark:text-gray-300 min-w-12 text-right`}>
                    {brightness}%
                  </span>
                </div>
              </div>

              {/* Text Size Settings */}
              <div className="settings-group">
                <div className="settings-group-header">
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600 dark:text-gray-400">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <h3 className={`settings-group-title ${getTextSize('lg')} font-normal text-gray-900 dark:text-gray-100`}>Text Size</h3>
                  </div>
                </div>
                
                <div className="settings-options">
                  {textSizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      className={`settings-option ${textSize === size.value ? 'settings-option-active' : ''}`}
                      onClick={() => setTextSize(size.value)}
                    >
                      <div className="settings-option-content">
                        <span className={`settings-option-label ${getTextSize('md')} font-normal text-gray-900 dark:text-gray-100`}>{size.label}</span>
                      </div>
                      {textSize === size.value && (
                        <Check className="settings-option-check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SettingsWindow = WindowWrapper(Settings, "settings");
export default SettingsWindow

