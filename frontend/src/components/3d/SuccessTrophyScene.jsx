import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Cylinder, Cone, Torus, Sparkles, OrbitControls, Octahedron } from '@react-three/drei';

function TrophyMesh() {
  const trophyRef = useRef();
  const starRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (trophyRef.current) {
      trophyRef.current.rotation.y = t * 0.4;
    }
    if (starRef.current) {
      starRef.current.rotation.y = t * 1.2;
      starRef.current.rotation.z = Math.sin(t) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <group ref={trophyRef}>
        {/* Base Pedestal */}
        <Cylinder args={[1.1, 1.3, 0.4, 32]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#1E1B4B" metalness={0.6} roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.9, 1.1, 0.2, 32]} position={[0, -1.2, 0]}>
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </Cylinder>

        {/* Stem */}
        <Cylinder args={[0.2, 0.35, 0.8, 32]} position={[0, -0.7, 0]}>
          <meshStandardMaterial color="#D97706" metalness={0.95} roughness={0.15} />
        </Cylinder>

        {/* Cup Body */}
        <Cone args={[0.9, 1.2, 32]} position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]}>
          <meshStandardMaterial
            color="#FBBF24"
            metalness={0.9}
            roughness={0.2}
            emissive="#B45309"
            emissiveIntensity={0.15}
          />
        </Cone>

        {/* Cup Rim */}
        <Torus args={[0.92, 0.08, 16, 32]} position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.2} />
        </Torus>

        {/* Side Handles */}
        <Torus args={[0.45, 0.07, 16, 32]} position={[-0.9, 0.25, 0]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#D97706" metalness={0.95} roughness={0.2} />
        </Torus>
        <Torus args={[0.45, 0.07, 16, 32]} position={[0.9, 0.25, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <meshStandardMaterial color="#D97706" metalness={0.95} roughness={0.2} />
        </Torus>

        {/* Floating Glowing Diamond / Star above trophy */}
        <group ref={starRef} position={[0, 1.35, 0]}>
          <Octahedron args={[0.4, 0]}>
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.5}
            />
          </Octahedron>
        </group>

        {/* Celebration Particles */}
        <Sparkles count={40} scale={3} size={3} speed={0.9} color="#FEF08A" />
      </group>
    </Float>
  );
}

export default function SuccessTrophyScene({ height = '300px' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[4, 6, 4]} intensity={2.5} color="#FFFFFF" />
        <pointLight position={[-4, -2, -2]} intensity={2} color="#FF6F00" />
        <pointLight position={[3, -3, 3]} intensity={2} color="#4F46E5" />

        <TrophyMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
