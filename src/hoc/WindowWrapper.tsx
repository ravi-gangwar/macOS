"use client"
import React from 'react'
import useWindowStore from '../store/window'
import { WINDOW_CONFIG, dockApps } from '../constants'
import useWindowAnim from '../animations/useWindowAnim'
import useWindowDrag from '../animations/useWindowDrag'
import WindowControls from '../components/WindowControls'
import { useTextSize } from '../hooks/useTextSize'
import { Download } from 'lucide-react'

const WindowWrapper = (Component: React.ComponentType<any>, windowKey: keyof typeof WINDOW_CONFIG) => {
    const Wrapped = (props: any) => {
        const {windows, finishClosing} = useWindowStore();
        const {isOpen, isClosing, isMinimized, data, zIndex, x, y} = windows[windowKey];
        const { getTextSize } = useTextSize();
        
        const windowRef = useWindowAnim({
            windowKey: windowKey as string,
            isOpen: isOpen && !isClosing && !isMinimized,
            isClosing: isClosing,
            storedX: x,
            storedY: y,
            onCloseComplete: () => {
                finishClosing(windowKey);
            }
        });
        
        // Enable dragging on the window header
        useWindowDrag({
            windowKey,
            windowRef: windowRef as React.RefObject<HTMLElement | null>,
            isOpen: isOpen && !isClosing && !isMinimized,
        });

        // Keep rendering during closing animation
        if(!isOpen && !isClosing) return null;
        
        // Hide if minimized
        if(isMinimized) return null;

        const windowTitle = dockApps.find(app => app.id === windowKey)?.name || windowKey;

        // Download resume handler
        const handleDownloadResume = (e: React.MouseEvent) => {
            e.stopPropagation();
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Ravi_Gangwar_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return <section 
            id={windowKey} 
            ref={windowRef} 
            style={{zIndex}} 
            className='absolute macos-window'>
                    <div id="window-header" className="macos-window-header">
                        <WindowControls windowKey={windowKey} />
                        <div className="flex-1 flex justify-center">
                            <span className={`${getTextSize('sm')} font-medium text-gray-600 dark:text-gray-300`}>{windowTitle}</span>
                        </div>
                        <div className="flex-1 flex justify-end pr-3">
                            {windowKey === 'resume' && (
                                <button
                                    type="button"
                                    onClick={handleDownloadResume}
                                    className="window-download-btn"
                                    aria-label="Download Resume"
                                    title="Download Resume"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                <div className="macos-window-content">
                    <Component {...props}/>
                </div>
            </section>
    }
    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
    return Wrapped;
}

export default WindowWrapper