import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Cylinder, Torus, Box, Sphere, Sparkles, OrbitControls, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

function SecurityVaultMesh() {
  const vaultRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const keyRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (vaultRef.current) {
      vaultRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.6;
      ring1Ref.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.8;
      ring2Ref.current.rotation.y = Math.cos(t * 0.5) * 0.3;
    }
    if (keyRef.current) {
      keyRef.current.position.x = Math.cos(t * 0.9) * 2.2;
      keyRef.current.position.z = Math.sin(t * 0.9) * 2.2;
      keyRef.current.rotation.y = -t * 0.9;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <group ref={vaultRef}>
        {/* Core Security Shield Body */}
        <Cylinder args={[1.5, 1.3, 0.35, 32]}>
          <meshStandardMaterial
            color="#312E81"
            metalness={0.8}
            roughness={0.2}
            emissive="#1E1B4B"
            emissiveIntensity={0.4}
          />
        </Cylinder>

        {/* Golden Front Bezel */}
        <Cylinder args={[1.35, 1.35, 0.4, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.9}
            roughness={0.15}
          />
        </Cylinder>

        {/* Center Padlock Chamber / Keyhole */}
        <Cylinder args={[0.75, 0.75, 0.45, 24]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#1E1B4B"
            metalness={0.6}
            roughness={0.3}
          />
        </Cylinder>

        {/* Glowing Keyhole Center */}
        <Box args={[0.18, 0.45, 0.5]} position={[0, -0.05, 0]}>
          <meshStandardMaterial
            color="#FF6F00"
            emissive="#FF9800"
            emissiveIntensity={2}
          />
        </Box>
        <Sphere args={[0.18, 16, 16]} position={[0, 0.15, 0.05]}>
          <meshStandardMaterial
            color="#FF6F00"
            emissive="#FF9800"
            emissiveIntensity={2}
          />
        </Sphere>

        {/* Outer Counter-Rotating Cryptographic Rings */}
        <group ref={ring1Ref}>
          <Torus args={[2.0, 0.06, 16, 64]}>
            <meshStandardMaterial
              color="#818CF8"
              emissive="#4F46E5"
              emissiveIntensity={0.8}
              metalness={0.7}
              roughness={0.2}
            />
          </Torus>
        </group>

        <group ref={ring2Ref}>
          <Torus args={[2.3, 0.05, 16, 64]}>
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#D97706"
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </Torus>
        </group>

        {/* Orbiting 3D Golden Security Key */}
        <group ref={keyRef} position={[2.2, 0, 0]}>
          {/* Key Bow (Round handle) */}
          <Torus args={[0.3, 0.06, 16, 32]}>
            <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.15} />
          </Torus>
          {/* Key Shaft */}
          <Cylinder args={[0.06, 0.06, 0.7, 16]} position={[0, -0.45, 0]}>
            <meshStandardMaterial color="#D97706" metalness={0.95} roughness={0.15} />
          </Cylinder>
          {/* Key Bit (Teeth) */}
          <Box args={[0.2, 0.08, 0.06]} position={[0.1, -0.65, 0]}>
            <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.15} />
          </Box>
          <Box args={[0.15, 0.08, 0.06]} position={[0.08, -0.5, 0]}>
            <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.15} />
          </Box>
        </group>

        {/* Floating Verified Check Nodes */}
        <group position={[-1.6, 1.3, 0.5]}>
          <Octahedron args={[0.22, 0]}>
            <meshStandardMaterial color="#059669" emissive="#10B981" emissiveIntensity={1.5} />
          </Octahedron>
        </group>
        <group position={[1.6, -1.3, -0.5]}>
          <Octahedron args={[0.22, 0]}>
            <meshStandardMaterial color="#4F46E5" emissive="#6366F1" emissiveIntensity={1.5} />
          </Octahedron>
        </group>

        {/* Sparkles around security perimeter */}
        <Sparkles count={45} scale={4.5} size={2.5} speed={0.8} color="#C7D2FE" />
      </group>
    </Float>
  );
}

export default function AuthSecurity3DScene({ height = '380px' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} color="#FFFFFF" />
        <pointLight position={[-5, -4, -3]} intensity={2.5} color="#FF6F00" />
        <pointLight position={[5, -4, 4]} intensity={2} color="#4F46E5" />

        <SecurityVaultMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
