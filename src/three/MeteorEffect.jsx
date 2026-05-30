import React, { useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Komponen untuk menghandle animasi floating & rotasi masing-masing foto secara mandiri
function FloatingMoon({ moon, index }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // 🌊 ANGGUN DAN HIDUP: Efek mengambang naik turun halus berdasarkan posisi acak awalnya
    meshRef.current.position.y = moon.baseY + Math.sin(time * 0.6 + index) * 0.5;
    
    // 🔄 ROTASI MANJA: Membuat piringan foto berputar menggeleng tipis biar dinamis pas dilewati kamera
    meshRef.current.rotation.z = Math.sin(time * 0.2 + index) * 0.05;

    // 🔥 KUNCI UTAMA: Bikin foto selalu menghadap ke arah kamera (Billboard Effect)
    // Jadi pas kamera lu berputar 360 derajat mengelilingi orbit, fotonya gak bakal keliatan gepeng dari samping!
    meshRef.current.lookAt(state.camera.position);
  });

  return (
    <mesh ref={meshRef} position={[moon.baseX, moon.baseY, moon.z]}>
      {/* 🟢 WADAH BULAT: Foto dibungkus bulat rata sempurna (Anti Fish-Eye) */}
      <circleGeometry args={[moon.scale, 64]} /> 
      <meshBasicMaterial 
        map={moon.texture}
        side={THREE.DoubleSide} 
        transparent={true}
        opacity={0.9} // Ketajaman premium 90% biar menyatu dengan indahnya galaksi
      />
    </mesh>
  );
}

export default function MeteorEffect({ isActive }) {
  if (!isActive) return null;

  // 📸 DAFTAR STOK FOTO SI AYU (Bisa lu tambah terus kebawah sampai puluhan foto, Wir!)
  const textures = useTexture([
    '/images/photo11.jpeg',
    '/images/photo12.jpeg',
    '/images/photo13.jpeg',
    '/images/photo14.jpeg',
    '/images/photo15.jpeg',
    '/images/photo16.jpeg',
    '/images/photo17.jpeg',
    '/images/photo18.jpeg',
    '/images/photo19.jpeg',
    '/images/photo20.jpeg',
    '/images/photo21.jpeg',
    '/images/photo22.jpeg',
    '/images/photo23.jpeg',
    '/images/photo24.jpeg',
  ]);

  // 🪄 ALGORITMA PENYEBARAN ACAK 3D KOSMIK (ANTI BERTUMPUK)
  const moonPlanets = useMemo(() => {
    return textures.map((texture, index) => {
      
      // 🎲 1. PENGACAKAN KOORDINAT HORIZONTAL (X) & VERTIKAL (Y)
      // Foto disebar acak dalam jangkauan luas dari rentang -35 sampai +35
      const baseX = (Math.random() - 0.5) * 70;
      const baseY = (Math.random() - 0.5) * 50;

      // 🎲 2. PENGACAKAN KEDALAMAN KOSMIK (Z)
      // Foto disebar acak dari posisi depan kamera sampai ke background paling belakang (-45)
      // Diberi pembatas acak agar tidak terlalu dekat dengan inti planet tengah (0,0,0)
      let z = (Math.random() - 0.5) * 60 - 15;
      if (Math.abs(z) < 10) z += z > 0 ? 12 : -12; // Proteksi menjauh dari orbit tengah biar gak nabrak

      // 📏 3. UKURAN BINGKAI BULAT ACAK
      // Biar ada efek depth of field alami (ada foto yang besar, ada yang mini di kejauhan)
      const scale = 1.6 + Math.random() * 0.9;

      return {
        baseX,
        baseY,
        z,
        scale,
        texture
      };
    });
  }, [textures]);

  return (
    <group>
      {moonPlanets.map((moon, index) => (
        <FloatingMoon key={index} moon={moon} index={index} />
      ))}
    </group>
  );
}