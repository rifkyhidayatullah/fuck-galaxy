import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CinematicGalaxy({ isActive }) {
  const pointsRef = useRef();
  const count = 1500; 
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 12; 
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4; 
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  const colors = React.useMemo(() => {
    const cols = new Float32Array(count * 3);
    const colorOptions = [
      new THREE.Color('#db2777'), 
      new THREE.Color('#a855f7'), 
      new THREE.Color('#f472b6'), 
    ];
    for (let i = 0; i < count; i++) {
      const pickedColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      cols[i * 3] = pickedColor.r;
      cols[i * 3 + 1] = pickedColor.g;
      cols[i * 3 + 2] = pickedColor.b;
    }
    return cols;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
    }
  });

  if (!isActive) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}