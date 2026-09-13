import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

function AnimatedSphere() {
  const sphereRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.x = t * 0.2;
      sphereRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
      <Sphere ref={sphereRef} args={[1.5, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color="#4F46E5"
          attach="material"
          distort={0.45}
          speed={2.5}
          roughness={0.15}
          metalness={0.4}
        />
      </Sphere>
    </Float>
  );
}

export default function MeshSphereScene() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#FFFFFF" />
        <pointLight position={[-5, -5, -2]} intensity={2.5} color="#FF6F00" />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}
