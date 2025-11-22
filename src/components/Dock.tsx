"use client"
import { useRef, useEffect } from 'react'
import { dockApps } from '../constants';
import { Tooltip } from 'react-tooltip';
import useDockAnim from '../animations/useDockAnim';
import useWindowStore from '../store/window';

function Dock() {
    const dockRef = useRef<HTMLDivElement>(null);
    const dockSectionRef = useRef<HTMLElement>(null);
    const {startClosing, openWindow, restoreWindow, windows, nextZindex} = useWindowStore();

    useDockAnim(dockRef);

    // Update dock z-index to always be higher than all windows
    useEffect(() => {
        if (dockSectionRef.current) {
            // Calculate max z-index from all windows
            const windowZIndices = Object.values(windows).map(win => win.zIndex);
            const maxZIndex = Math.max(...windowZIndices, nextZindex - 1);
            // Set dock z-index to be higher than the highest window z-index
            dockSectionRef.current.style.zIndex = `${maxZIndex + 1000}`;
        }
    }, [windows, nextZindex]);

    const toggleApp = (id: string, canOpen: boolean) => {
        if(!canOpen) return;
        const window = windows[id as keyof typeof windows];

        if(window.isMinimized) {
            restoreWindow(id as keyof typeof windows);
        } else if(window.isOpen) {
            startClosing(id as keyof typeof windows);
        } else {
            openWindow(id as keyof typeof windows);
        }
    }

    return (
        <section id="dock" ref={dockSectionRef}>
            <div ref={dockRef} className='dock-container'>
                {dockApps.map(({id, icon, name, canOpen}) => (
                    <div key={id} className='relative flex justify-center'>
                        <button 
                            type='button' 
                            className='dock-icon' 
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp(id, canOpen)}
                        >
                            <img 
                                src={`/images/${icon}`} 
                                alt={name}
                                loading='lazy'
                                className={canOpen ? "" : "opacity-60"} 
                            />
                        </button>
                    </div>
                ))}
                <Tooltip id="dock-tooltip" place='top' className='tooltip'/>
            </div>
        </section>
    )
}

export default Dock