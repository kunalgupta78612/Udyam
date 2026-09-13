import React, { useEffect, useState } from 'react';

export default function AudioVisualizer({ isListening = false, barCount = 24 }) {
  const [heights, setHeights] = useState(() => Array(barCount).fill(20));

  useEffect(() => {
    if (!isListening) {
      setHeights(Array(barCount).fill(15));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array(barCount)
          .fill(0)
          .map(() => Math.floor(Math.random() * 65) + 15)
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isListening, barCount]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        height: '80px',
        padding: '0 1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.04)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      {heights.map((h, i) => {
        const isCenter = Math.abs(i - barCount / 2) < barCount / 4;
        const color = isListening
          ? isCenter
            ? 'linear-gradient(180deg, #FF6F00 0%, #FF9800 100%)'
            : 'linear-gradient(180deg, #4F46E5 0%, #818CF8 100%)'
          : 'var(--color-border)';

        return (
          <div
            key={i}
            style={{
              width: '5px',
              height: `${isListening ? h : 10}px`,
              borderRadius: '999px',
              background: color,
              transition: 'height 0.08s ease, background 0.3s ease',
              boxShadow: isListening ? '0 0 8px rgba(255, 111, 0, 0.3)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
