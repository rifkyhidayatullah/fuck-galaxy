import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export default function SpaceBackground() {
  const starsRef = useRef();

  // Memutar latar belakang bintang super pelan biar sinematik
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={100}   // Radius lingkaran sebaran bintang
        depth={50}     // Kedalaman area bintang
        count={7000}   // Jumlah total bintang
        factor={4}     // Ukuran bintang
        saturation={0.5} 
        fade           // Efek memudar di kejauhan
        speed={1.5}    // Kecepatan kedipan bintang
      />
    </group>
  );
}