import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Cylinder, Text, Sparkles, OrbitControls } from '@react-three/drei';

function RupeeCoinMesh({ isInteractive = true }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <group ref={meshRef}>
        {/* Main Coin Cylinder */}
        <Cylinder args={[2, 2, 0.28, 64]}>
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.85}
            roughness={0.2}
            emissive="#B45309"
            emissiveIntensity={0.2}
          />
        </Cylinder>

        {/* Outer Rim Ring */}
        <Cylinder args={[2.08, 2.08, 0.24, 64]}>
          <meshStandardMaterial
            color="#D97706"
            metalness={0.9}
            roughness={0.25}
          />
        </Cylinder>

        {/* Inner Circle Inset Front */}
        <Cylinder args={[1.75, 1.75, 0.3, 48]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#FBBF24"
            metalness={0.8}
            roughness={0.3}
          />
        </Cylinder>

        {/* Front Rupee Symbol */}
        <Text
          position={[0, 0, 0.16]}
          fontSize={1.7}
          color="#78350F"
          font="https://fonts.gstatic.com/s/outfit/v11/Q1t7T7K73s3064zN_pC9.woff"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          ₹
        </Text>

        {/* Back Rupee Symbol */}
        <Text
          position={[0, 0, -0.16]}
          rotation={[0, Math.PI, 0]}
          fontSize={1.7}
          color="#78350F"
          font="https://fonts.gstatic.com/s/outfit/v11/Q1t7T7K73s3064zN_pC9.woff"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          ₹
        </Text>

        {/* Floating golden sparkles around coin */}
        <Sparkles count={30} scale={4} size={3} speed={0.6} color="#FDE68A" />
      </group>
    </Float>
  );
}

export default function RupeeCoinScene({ height = '320px', interactive = true }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        cursor: interactive ? 'grab' : 'default',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} color="#FFFBEB" />
        <pointLight position={[-5, -3, -2]} intensity={2} color="#FF6F00" />
        <pointLight position={[4, -4, 4]} intensity={1.8} color="#4F46E5" />

        <RupeeCoinMesh />

        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        )}
      </Canvas>
    </div>
  );
}
