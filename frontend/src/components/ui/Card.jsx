import React, { useRef, useState } from 'react';

export default function Card({
  children,
  variant = 'default', // 'default' | 'elevated' | 'glass' | 'interactive' | 'flat'
  interactive = false,
  tiltEffect = false,
  glare = true,
  className = '',
  onClick,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!tiltEffect || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; // max 8deg
    const rotateY = ((x - centerX) / centerX) * 8;  // max 8deg

    setTransformStyle(`perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`);
    
    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.18 });
    }
  };

  const handleMouseLeave = () => {
    if (!tiltEffect) return;
    setTransformStyle('');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  let cardClasses = `card card-${variant} ${interactive ? 'card-interactive' : ''} ${className}`;

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        ...style,
        transform: transformStyle || style.transform,
        transition: transformStyle
          ? 'transform 0.08s ease-out'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {/* 3D Specular Glare Reflection Layer */}
      {tiltEffect && glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 10,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)`,
            opacity: glarePos.opacity,
            transition: 'opacity 0.25s ease',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {children}
    </div>
  );
}
