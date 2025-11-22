"use client"
import { useState, useEffect } from 'react';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Plug } from 'lucide-react';
import { useTextSize } from '../hooks/useTextSize';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface BatteryAPI extends BatteryManager {
  addEventListener(type: 'chargingchange' | 'chargingtimechange' | 'dischargingtimechange' | 'levelchange', listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

function BatteryIndicator() {
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const { getTextSize } = useTextSize();

  useEffect(() => {
    // Check if Battery API is supported
    if (!('getBattery' in navigator)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // Get battery information
    let cleanup: (() => void) | null = null;

    const getBatteryInfo = async () => {
      try {
        const battery = await (navigator as any).getBattery() as BatteryAPI;
        
        // Set initial values
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        // Update on charging change
        const handleChargingChange = () => {
          setIsCharging(battery.charging);
        };

        // Update on level change
        const handleLevelChange = () => {
          setBatteryLevel(Math.round(battery.level * 100));
        };

        // Add event listeners
        battery.addEventListener('chargingchange', handleChargingChange);
        battery.addEventListener('levelchange', handleLevelChange);

        // Store cleanup function
        cleanup = () => {
          battery.removeEventListener('chargingchange', handleChargingChange);
          battery.removeEventListener('levelchange', handleLevelChange);
        };
      } catch (error) {
        console.error('Error accessing battery API:', error);
        setIsSupported(false);
      }
    };

    getBatteryInfo();

    // Return cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // If not supported, don't show battery indicator
  if (!isSupported) {
    return null;
  }

  // Get battery icon based on level
  const getBatteryIcon = () => {
    if (isCharging) {
      return <Plug className="w-4 h-4" />;
    }

    if (batteryLevel <= 20) {
      return <BatteryLow className="w-4 h-4" />;
    } else if (batteryLevel <= 50) {
      return <BatteryMedium className="w-4 h-4" />;
    } else {
      return <BatteryFull className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors cursor-default">
      <div className="text-gray-800 dark:text-gray-200 opacity-80 flex items-center">
        {getBatteryIcon()}
      </div>
      <span className={`${getTextSize('sm')} font-medium text-gray-800 dark:text-gray-200`}>
        {batteryLevel}%
      </span>
    </div>
  );
}

export default BatteryIndicator;

