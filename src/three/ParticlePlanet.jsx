import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticlePlanet() {
  const pointsRef = useRef();
  const particleCount = 6000; // Jumlah partikel pembentuk planet

  // Matematika untuk menyebar partikel secara merata membentuk Bola (Sphere)
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const radius = 3.5; // Ukuran bola planetnya

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      arr[i] = radius * Math.sin(phi) * Math.cos(theta);     // Koordinat X
      arr[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // Koordinat Y
      arr[i + 2] = radius * Math.cos(phi);                  // Koordinat Z
    }
    return arr;
  }, []);

  // Animasi rotasi planet ungu dan efek bernafas (pulsing)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.15; // Berputar pada sumbu Y
      
      // Efek partikel sedikit membesar-mengecil (pulsing effect)
      pointsRef.current.material.size = 0.04 + Math.sin(time * 2) * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#a855f7" // Warna ungu khas galaksi
        size={0.04} 
        sizeAttenuation={true} // Partikel mengecil jika kamera menjauh
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending} // Efek neon/menyala saat menumpuk
      />
    </points>
  );
}