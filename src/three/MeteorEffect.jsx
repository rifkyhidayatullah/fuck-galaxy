import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MeteorEffect({ isActive }) {
  const meteorGroupRef = useRef();
  const fireParticlesRef = useRef();
  const rockRef = useRef();
  
  const particleCount = 200; // Jumlah lidah api bergerak dinamis

  // Setup data partikel api penjelajah
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    const colorOptions = [
      new THREE.Color('#ff3700'), // Merah membara
      new THREE.Color('#ff7700'), // Oranye pekat
      new THREE.Color('#ffaa00'), // Kuning pijar
    ];

    for (let i = 0; i < particleCount; i++) {
      // Posisi awal menyebar meruncing ke belakang membentuk ekor komet
      pos[i * 3] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.random() * 5; // Panjang jangkauan ekor api ke belakang

      const pickedColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      cols[i * 3] = pickedColor.r;
      cols[i * 3 + 1] = pickedColor.g;
      cols[i * 3 + 2] = pickedColor.b;
    }
    return [pos, cols];
  }, []);

  // KUNCI UTAMA: Koordinat Z diatur sangat minus (antara -25 sampai -45) 
  // agar meteor bener-bener meluncur di background langit hitam jauh di belakang bulan & foto
  const moveState = useRef({
    x: 45,
    y: 30,
    z: -35, // Jauh di belakang target tengah (0,0,0)
    speed: 0.3,
    active: false,
    timer: 0
  });

  useFrame((state) => {
    if (!isActive) return;

    const time = state.clock.getElapsedTime();
    const data = moveState.current;

    // Trigger pemunculan meteor berkala di background jauh
    if (!data.active) {
      data.timer += 0.01;
      if (data.timer > 2.0) { // Muncul acak tiap beberapa detik
        data.x = 40 + Math.random() * 15; // Start dari kanan atas luar layar jauh
        data.y = 25 + Math.random() * 10;
        data.z = -30 - Math.random() * 15; // Mengunci posisi tetap di background belakang
        data.speed = 0.28 + Math.random() * 0.15;
        data.active = true;
        data.timer = 0;
      }
    }

    if (data.active && meteorGroupRef.current) {
      // Gerakan meluncur diagonal konstan membelah langit hitam latar belakang
      data.x -= data.speed * 1.5;
      data.y -= data.speed * 1.0;
      // Z dibuat stabil mundur agar konsisten berada di layer background paling belakang
      meteorGroupRef.current.position.set(data.x, data.y, data.z);

      // Putar batu meteor hitam tak beraturan
      if (rockRef.current) {
        rockRef.current.rotation.x += 0.05;
        rockRef.current.rotation.y += 0.03;
      }

      // Logika kobaran lidah api dinamis bergerak nyata
      if (fireParticlesRef.current) {
        const posArr = fireParticlesRef.current.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
          // Efek semburan api menjauh ke belakang dari arah laju batu
          posArr[i * 3 + 2] += data.speed * 0.9; 
          
          // Turbulensi kocokan lidah api nyata biar bergerak bergetar liar
          posArr[i * 3] += Math.sin(time * 60 + i) * 0.015;
          posArr[i * 3 + 1] += Math.cos(time * 50 + i) * 0.015;

          // Jika api mencapai batas ekor, reset balik nempel ke kepala batu
          if (posArr[i * 3 + 2] > 5) {
            posArr[i * 3] = (Math.random() - 0.5) * 0.3;
            posArr[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
            posArr[i * 3 + 2] = Math.random() * 0.5;
          }
        }
        fireParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Matikan meteor jika sudah melesat keluar batas layar kiri bawah
      if (data.x < -45 || data.y < -35) {
        data.active = false;
      }
    }
  });

  if (!isActive) return null;

  return (
    <group ref={meteorGroupRef} position={[0, 0, -100]}>
      
      {/* 🌑 1. BATU METEOR ASLI (Abu-Abu Kehitaman Kasar Tanpa Topi) */}
      <mesh ref={rockRef}>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial 
          color="#1c1c1c"       
          roughness={0.95}      
          metalness={0.1}
          flatShading={true}    
        />
      </mesh>
      
      {/* 🔥 2. AURA PIJAR INTI BULAT (Menggantikan silinder topi kemarin) */}
      <mesh>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshBasicMaterial 
          color="#ff3e00" 
          transparent 
          opacity={0.5} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* 🌪️ 3. KOBARAN LIDAH API TURBULENSI DINAMIS */}
      <points ref={fireParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.32}
          vertexColors
          transparent={true}
          opacity={0.9}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

    </group>
  );
}