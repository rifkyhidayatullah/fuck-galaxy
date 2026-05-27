import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function PhotoOrbit({ isCinematic }) {
  const groupRef = useRef();

  // 1. Jalur 10 foto asli kamu di folder public/images
  const originalPhotos = [
    '/images/photo1.jpg', '/images/photo2.jpg', '/images/photo3.jpg', '/images/photo4.jpg', '/images/photo5.jpg',
    '/images/photo6.jpg', '/images/photo7.jpg', '/images/photo8.jpg', '/images/photo9.jpg', '/images/photo10.jpg'
  ];

  // Load texture gambar
  const textures = useLoader(THREE.TextureLoader, originalPhotos);
  const totalSlots = isCinematic ? 100 : 10;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Putar seluruh formasi foto secara lembut agar tetap hidup
      groupRef.current.rotation.y = time * 0.15;
    }

    // Ambil semua anak (mesh foto) di dalam grup untuk dianimasikan posisinya satu per satu
    groupRef.current.children.forEach((mesh, index) => {
      if (isCinematic) {
        /* =========================================================================
           ✨ MODE CINEMATIC: EFEK KOMET MELUNCUR DAN MEMBENTUK FORMASI LOVE (💖)
           ========================================================================= */
        
        // Guna Matematika Kardioid / Rumus Hati murni untuk koordinat X dan Y
        const t = (index / totalSlots) * Math.PI * 2; 
        
        // Rumus sakti membentuk lambang HATI (Love)
        const targetX = 6 * Math.pow(Math.sin(t), 3);
        const targetY = 5 * Math.cos(t) - 2 * Math.cos(2*t) - 1 * Math.cos(3*t) - 0.5 * Math.cos(4*t);
        const targetZ = 0; // Sejajar di sumbu datar agar bentuk love terlihat jelas dari depan

        // EFEK KOMET JATUH DARI JAUH: 
        // Kita gunakan waktu (time) dan index sebagai offset agar foto-foto datang berjejer memanjang dari kejauhan
        const delay = index * 0.1;
        const progress = Math.min(Math.max((time * 0.8) - delay, 0), 1); // interpolasi 0 sampai 1

        // Posisi awal komet di kejauhan langit atas (seolah komet jatuh)
        const startX = targetX + 30;
        const startY = targetY + 40;
        const startZ = targetZ - 50;

        // Satukan posisi memakai Lerp (Linear Interpolation) agar meluncur sangat mulus
        mesh.position.x = THREE.MathUtils.lerp(startX, targetX, progress);
        mesh.position.y = THREE.MathUtils.lerp(startY, targetY, progress);
        mesh.position.z = THREE.MathUtils.lerp(startX, targetZ, progress);

        // Bikin foto selalu menghadap ke arah kamera roket kita
        mesh.lookAt(state.camera.position);

      } else {
        /* =========================================================================
           🌐 MODE NORMAL: Foto membentuk cincin orbit biasa melingkar flat
           ========================================================================= */
        const angle = (index / totalSlots) * Math.PI * 2;
        const radius = 6;
        const targetX = Math.cos(angle) * radius;
        const targetZ = Math.sin(angle) * radius;

        // Kembalikan posisi ke bentuk lingkaran biasa secara smooth
        mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, 0.05);
        mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, 0, 0.05);
        mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, 0.05);
        
        // Hadapkan foto ke pusat planet tengah
        mesh.lookAt(0, 0, 0);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: totalSlots }).map((_, index) => {
        const textureIndex = index % textures.length;
        return (
          <mesh key={index} position={[0, 0, -100]}>
            <boxGeometry args={[1.1, 1.1, 0.01]} />
            <meshStandardMaterial 
              map={textures[textureIndex]} 
              side={THREE.DoubleSide}
              transparent={true}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}