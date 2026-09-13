import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 99999,
        padding: '0.5rem 1rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        backgroundColor: isOnline ? 'var(--color-success)' : 'var(--color-danger)',
        color: '#FFFFFF',
        transition: 'all 0.3s ease',
      }}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span>Back online. Your connection has been restored.</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>You are currently offline. Viewing cached scheme data.</span>
        </>
      )}
    </div>
  );
}
