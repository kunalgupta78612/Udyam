import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Octahedron, Sparkles, Ring } from '@react-three/drei';
import * as THREE from 'three';

function ParallaxRig({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      const { x, y } = state.pointer;
      // Smoothly interpolate group rotation towards pointer coordinates
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.25, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.25, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function FloatingGeometry({ position, color, type = 'octahedron', speed = 1.5, distort = 0.3, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t / 2);
      meshRef.current.rotation.y = Math.cos(t / 3);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1.4} floatIntensity={2.2}>
      <group position={position} scale={scale} ref={meshRef}>
        {type === 'sphere' && (
          <Sphere args={[1, 36, 36]}>
            <MeshDistortMaterial
              color={color}
              attach="material"
              distort={distort}
              speed={2.2}
              roughness={0.18}
              metalness={0.35}
            />
          </Sphere>
        )}
        {type === 'torus' && (
          <Torus args={[0.9, 0.28, 24, 48]}>
            <meshStandardMaterial
              color={color}
              roughness={0.15}
              metalness={0.5}
            />
          </Torus>
        )}
        {type === 'octahedron' && (
          <Octahedron args={[1.1, 0]}>
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              metalness={0.6}
            />
          </Octahedron>
        )}
        {type === 'ring' && (
          <Ring args={[0.9, 1.1, 32]}>
            <meshStandardMaterial
              color={color}
              side={THREE.DoubleSide}
              roughness={0.2}
              metalness={0.4}
            />
          </Ring>
        )}
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        style={{ pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#FFFFFF" />
        <pointLight position={[-10, -5, -5]} intensity={1.5} color="#FF6F00" />
        <pointLight position={[6, -5, 5]} intensity={1.6} color="#4F46E5" />

        <ParallaxRig>
          <FloatingGeometry position={[3.6, 1.2, 0]} color="#4F46E5" type="octahedron" speed={1.2} scale={1.1} />
          <FloatingGeometry position={[-4, -1, -1]} color="#FF9800" type="torus" speed={1.5} scale={1.2} />
          <FloatingGeometry position={[3, -2.2, -0.5]} color="#059669" type="sphere" speed={1.8} distort={0.4} scale={0.9} />
          <FloatingGeometry position={[-3.2, 2.2, -2]} color="#818CF8" type="octahedron" speed={1.1} scale={0.8} />
          <FloatingGeometry position={[0, -3.2, -1.5]} color="#FFB74D" type="ring" speed={0.9} scale={1.4} />

          {/* Saffron & Indigo Sparkles Floating in Atmosphere */}
          <Sparkles count={55} scale={8} size={2.8} speed={0.5} color="#FF9800" />
          <Sparkles count={55} scale={8} size={2.4} speed={0.4} color="#818CF8" />
        </ParallaxRig>
      </Canvas>
    </div>
  );
}
