import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Cone, Cylinder, Torus, Sparkles, OrbitControls, Box, Text } from '@react-three/drei';
import * as THREE from 'three';

function MiniCoin({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <Cylinder args={[0.35, 0.35, 0.08, 32]}>
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
      </Cylinder>
      <Text position={[0, 0, 0.05]} fontSize={0.28} color="#78350F" fontWeight={800}>
        ₹
      </Text>
    </group>
  );
}

function EnterpriseGrowthMesh({ strengthLevel = 50 }) {
  const groupRef = useRef();
  const rocketRef = useRef();
  const spiralRef = useRef();

  // Glow color changes depending on password strength / registration readiness
  const glowColor = strengthLevel >= 75 ? '#059669' : strengthLevel >= 50 ? '#FF6F00' : '#DC2626';

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rocketRef.current) {
      rocketRef.current.position.y = Math.sin(t * 1.5) * 0.15;
      rocketRef.current.rotation.y = t * 0.5;
    }
    if (spiralRef.current) {
      spiralRef.current.rotation.y = -t * 0.7;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <group ref={groupRef}>
        {/* Central Enterprise Launch Rocket */}
        <group ref={rocketRef} position={[0, 0.2, 0]}>
          {/* Nose Cone */}
          <Cone args={[0.6, 1.2, 32]} position={[0, 1.2, 0]}>
            <meshStandardMaterial color="#4F46E5" metalness={0.8} roughness={0.2} />
          </Cone>

          {/* Main Fuselage Cylinder */}
          <Cylinder args={[0.6, 0.6, 1.4, 32]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#FFFFFF" metalness={0.3} roughness={0.2} />
          </Cylinder>

          {/* Porthole Window */}
          <Torus args={[0.22, 0.05, 16, 32]} position={[0, 0.3, 0.55]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
          </Torus>
          <Cylinder args={[0.2, 0.2, 0.05, 32]} position={[0, 0.3, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.5} />
          </Cylinder>

          {/* Side Fins */}
          <Box args={[0.1, 0.6, 0.5]} position={[-0.65, -0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
            <meshStandardMaterial color="#FF6F00" metalness={0.7} roughness={0.3} />
          </Box>
          <Box args={[0.1, 0.6, 0.5]} position={[0.65, -0.4, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <meshStandardMaterial color="#FF6F00" metalness={0.7} roughness={0.3} />
          </Box>

          {/* Thruster Engine Nozzle */}
          <Cylinder args={[0.4, 0.5, 0.3, 32]} position={[0, -0.7, 0]}>
            <meshStandardMaterial color="#1E1B4B" metalness={0.8} roughness={0.3} />
          </Cylinder>

          {/* Glowing Thruster Exhaust Flame */}
          <Cone args={[0.35, 0.8, 32]} position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
            <meshStandardMaterial
              color={glowColor}
              emissive={glowColor}
              emissiveIntensity={2}
              transparent
              opacity={0.85}
            />
          </Cone>
        </group>

        {/* Upward Spiral with Orbiting Subsidy Coins */}
        <group ref={spiralRef}>
          <MiniCoin position={[1.6, -0.5, 0]} rotation={[0.4, 0, 0]} />
          <MiniCoin position={[-1.4, 0.4, 0.8]} rotation={[-0.3, 0.5, 0]} />
          <MiniCoin position={[0.6, 1.3, -1.3]} rotation={[0.2, -0.4, 0]} />

          {/* Orbiting Golden Ring */}
          <Torus args={[2.1, 0.04, 16, 64]} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
            <meshStandardMaterial
              color="#F59E0B"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={0.7}
            />
          </Torus>
        </group>

        {/* Sparkles / Launch Particles */}
        <Sparkles count={50} scale={4} size={3} speed={1.2} color="#FEF08A" />
        <Sparkles count={30} scale={3} size={2.5} speed={0.8} color="#818CF8" />
      </group>
    </Float>
  );
}

export default function SignupGrowth3DScene({ height = '380px', strengthLevel = 50 }) {
  return (
    <div style={{ width: '100%', height, position: 'relative', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 8, 5]} intensity={2.2} color="#FFFFFF" />
        <pointLight position={[-5, -4, -3]} intensity={2.5} color="#FF6F00" />
        <pointLight position={[5, -4, 4]} intensity={2} color="#4F46E5" />

        <EnterpriseGrowthMesh strengthLevel={strengthLevel} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
