import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, OrbitControls, Sparkles, Line } from '@react-three/drei';
import * as THREE from 'three';

// Coordinates around a sphere for Indian cities simulation
const NODES = [
  { name: 'Delhi', pos: [0.3, 1.2, 1.4], color: '#FF6F00' },
  { name: 'Mumbai', pos: [-0.6, 0.4, 1.8], color: '#4F46E5' },
  { name: 'Bengaluru', pos: [-0.4, -0.6, 1.7], color: '#059669' },
  { name: 'Hyderabad', pos: [-0.1, -0.1, 1.8], color: '#D97706' },
  { name: 'Chennai', pos: [-0.1, -0.9, 1.6], color: '#7C3AED' },
  { name: 'Kolkata', pos: [1.1, 0.5, 1.4], color: '#2563EB' },
  { name: 'Ahmedabad', pos: [-0.9, 0.8, 1.5], color: '#EA580C' },
  { name: 'Guwahati', pos: [1.6, 0.9, 0.9], color: '#059669' },
  { name: 'Lucknow', pos: [0.6, 1.0, 1.5], color: '#E11D48' },
];

function ConnectionArcs() {
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i + 1; j < NODES.length; j++) {
        if (Math.random() > 0.4) {
          const start = new THREE.Vector3(...NODES[i].pos);
          const end = new THREE.Vector3(...NODES[j].pos);
          // Curve upwards slightly
          const mid = new THREE.Vector3()
            .addVectors(start, end)
            .multiplyScalar(0.5)
            .normalize()
            .multiplyScalar(2.2);

          const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
          const points = curve.getPoints(20);
          result.push({ points, color: NODES[i].color });
        }
      }
    }
    return result;
  }, []);

  return (
    <group>
      {lines.map((arc, idx) => (
        <Line
          key={idx}
          points={arc.points}
          color={arc.color}
          lineWidth={1.5}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  );
}

function NetworkMesh() {
  const globeRef = useRef();

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.004;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={globeRef}>
        {/* Core Translucent Hologram Globe */}
        <Sphere args={[1.9, 36, 36]}>
          <meshStandardMaterial
            color="#EEF2FF"
            roughness={0.4}
            metalness={0.2}
            transparent
            opacity={0.5}
            wireframe
          />
        </Sphere>

        {/* Inner glow core */}
        <Sphere args={[1.75, 24, 24]}>
          <meshBasicMaterial
            color="#C7D2FE"
            transparent
            opacity={0.2}
          />
        </Sphere>

        {/* City Nodes */}
        {NODES.map((node, i) => (
          <group key={i} position={node.pos}>
            <Sphere args={[0.08, 16, 16]}>
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={1.5}
              />
            </Sphere>
            {/* Outer halo ring around node */}
            <Sphere args={[0.13, 16, 16]}>
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.3}
                wireframe
              />
            </Sphere>
          </group>
        ))}

        {/* Arcs connecting nodes */}
        <ConnectionArcs />

        {/* Floating Subsidy Data Packets */}
        <Sparkles count={45} scale={3.5} size={2.5} speed={0.8} color="#818CF8" />
      </group>
    </Float>
  );
}

export default function NetworkGlobeScene({ height = '380px' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#FFFFFF" />
        <pointLight position={[-5, -4, -2]} intensity={2.5} color="#FF6F00" />
        <pointLight position={[5, -4, 4]} intensity={2} color="#4F46E5" />

        <NetworkMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
