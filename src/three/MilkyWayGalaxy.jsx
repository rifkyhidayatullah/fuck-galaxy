import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// HELPER FUNCTION: Tekstur permukaan planet organik
function createPlanetTexture(type, baseColor, detailColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; // Dioptimasi dari 512 ke 256 agar memory load jauh lebih ringan saat start awal
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const size = Math.random() * (type === 'jupiter' || type === 'sun' ? 12 : 3) + 1;
    
    ctx.fillStyle = detailColor;
    ctx.globalAlpha = Math.random() * 0.3;
    
    if (type === 'jupiter' || type === 'saturn' || type === 'sun') {
      ctx.fillRect(x, y, size * 4, size * 0.3);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function MilkyWayGalaxy({ visible }) {
  const coreRef = useRef();
  const spiralRef = useRef();
  const cloudsRef = useRef();
  const planetsGroupRef = useRef();
  
  // Ref untuk mengontrol animasi pudar transisi secara berkala (Smooth Fade Factor)
  const fadeFactorRef = useRef(0);

  const particleCount = 12500; 

  // Inisialisasi batuan meteor (Hanya dipicu sekali saat web pertama dimuat)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const colorOptions = [
      new THREE.Color('#1d4ed8'), new THREE.Color('#3b82f6'), 
      new THREE.Color('#60a5fa'), new THREE.Color('#f472b6'), 
      new THREE.Color('#ffffff'), new THREE.Color('#fcd34d')  
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 2.2) * 18; 
      const arms = (i % 2) * Math.PI;
      const theta = r * 0.42 + arms + (Math.random() - 0.5) * 0.45;

      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * (1.8 - r * 0.08); 
      pos[i * 3 + 2] = Math.sin(theta) * r;

      let clr = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      if (r < 3.5) clr = new THREE.Color('#f97316'); 

      cols[i * 3] = clr.r;
      cols[i * 3 + 1] = clr.g;
      cols[i * 3 + 2] = clr.b;
    }
    return [pos, cols];
  }, []);

  // Inisialisasi tumpukan awan asap kabut nebula
  const cloudData = useMemo(() => {
    const clouds = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2 * 1.5;
      const r = 2.5 + Math.random() * 9;
      clouds.push({
        position: [Math.cos(angle) * r, (Math.random() - 0.5) * 0.5, Math.sin(angle) * r],
        size: 3.5 + Math.random() * 3.5,
        color: i % 2 === 0 ? '#1e40af' : '#be185d', 
        baseOpacity: 0.12 + Math.random() * 0.08
      });
    }
    return clouds;
  }, []);

  const textures = useMemo(() => {
    return {
      sun: createPlanetTexture('sun', '#ffcc00', '#ff3300'),
      mercury: createPlanetTexture('rock', '#6b7280', '#374151'),
      venus: createPlanetTexture('gas', '#ea580c', '#f97316'),
      earth: createPlanetTexture('earth', '#1d4ed8', '#22c55e'),
      mars: createPlanetTexture('rock', '#b91c1c', '#7f1d1d'),
      jupiter: createPlanetTexture('jupiter', '#d97706', '#fef08a'),
      saturn: createPlanetTexture('saturn', '#eab308', '#ca8a04')
    };
  }, []);

  const planetData = useMemo(() => [
    { name: "Mercury", size: 0.16, dist: 2.6, speed: 0.025, texture: textures.mercury },
    { name: "Venus", size: 0.26, dist: 3.7, speed: 0.018, texture: textures.venus },
    { name: "Earth", size: 0.30, dist: 5.0, speed: 0.014, texture: textures.earth },
    { name: "Mars", size: 0.23, dist: 6.3, speed: 0.011, texture: textures.mars },
    { name: "Jupiter", size: 0.65, dist: 8.5, speed: 0.007, texture: textures.jupiter },
    { name: "Saturn", size: 0.53, dist: 11.0, speed: 0.005, texture: textures.saturn, hasRing: true }
  ], [textures]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // ⚡ INTERPOLASI FADE INPUT: Menghitung nilai alpha pudar (0 ke 1 atau 1 ke 0 secara smooth)
    fadeFactorRef.current = THREE.MathUtils.lerp(fadeFactorRef.current, visible ? 1 : 0, 0.04);

    // Sembunyikan objek dari kalkulasi render matrix jika benar-benar tidak terlihat (Efisiensi Baterai Laptop)
    if (fadeFactorRef.current < 0.001) {
      if (planetsGroupRef.current) planetsGroupRef.current.visible = false;
      if (spiralRef.current) spiralRef.current.visible = false;
      if (cloudsRef.current) cloudsRef.current.visible = false;
      if (coreRef.current) coreRef.current.parent.visible = false; 
      return;
    } else {
      if (planetsGroupRef.current) planetsGroupRef.current.visible = true;
      if (spiralRef.current) spiralRef.current.visible = true;
      if (cloudsRef.current) cloudsRef.current.visible = true;
      if (coreRef.current) coreRef.current.parent.visible = true;
    }

    const currentFade = fadeFactorRef.current;

    // Animasi rotasi core matahari
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.1;
      const pulse = 1.6 + Math.sin(time * 1.5) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.material.opacity = currentFade;
      coreRef.current.nextSibling?.material && (coreRef.current.nextSibling.material.opacity = currentFade * 0.3);
    }

    // Perputaran sabuk meteor & update intensitas pudar materialnya
    if (spiralRef.current) {
      spiralRef.current.rotation.y = time * 0.025; 
      spiralRef.current.material.opacity = currentFade * 0.9;
    }

    // Perputaran asap nebula & update kelembutan cahayanya
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.018;
      cloudsRef.current.children.forEach((mesh, idx) => {
        if (mesh.material) {
          mesh.material.opacity = cloudData[idx].baseOpacity * currentFade;
        }
      });
    }

    // Rotasi, Revolusi, dan Opacity planet tata surya
    if (planetsGroupRef.current) {
      planetsGroupRef.current.children.forEach((group, index) => {
        const p = planetData[index];
        if (group && p) {
          group.rotation.y += p.speed;
          
          const planetMesh = group.children[0];
          if (planetMesh && planetMesh.material) {
            planetMesh.rotation.y = time * 0.3;
            planetMesh.material.opacity = currentFade;
            // Teks nama planet ikut memudar selaras
            const textMesh = group.children[0].nextSibling;
            if (textMesh) textMesh.color = `rgba(229, 229, 229, ${currentFade})`;
          }
          // Cincin Saturnus ikut memudar
          if (p.hasRing && group.children[1] && group.children[1].material) {
            group.children[1].material.opacity = currentFade * 0.8;
          }
        }
      });
    }
  });

  return (
    <group>
      {/* ☀️ CORE MATAHARI PUSAT */}
      <group>
        <mesh ref={coreRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial map={textures.sun} transparent opacity={0} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color="#ff7700" transparent opacity={0} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* 🌬️ ASAP NEBULA MEMUDAR */}
      <group ref={cloudsRef}>
        {cloudData.map((cloud, idx) => (
          <mesh key={idx} position={cloud.position}>
            <sphereGeometry args={[cloud.size, 16, 16]} />
            <meshBasicMaterial 
              color={cloud.color} 
              transparent 
              opacity={0} 
              blending={THREE.AdditiveBlending}
              depthWrite={false} 
            />
          </mesh>
        ))}
      </group>

      {/* 🌌 12.500 SABUK METEOR MEMUDAR */}
      <points ref={spiralRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18} 
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 🪐 SYSTEM TATA SURYA MEMUDAR */}
      <group ref={planetsGroupRef}>
        {planetData.map((p, idx) => (
          <group key={idx}>
            <mesh position={[p.dist, 0, 0]}>
              <sphereGeometry args={[p.size, 32, 32]} />
              <meshLambertMaterial map={p.texture} transparent opacity={0} />
              <Text position={[0, p.size + 0.35, 0]} fontSize={0.16} color="rgba(229, 229, 229, 0)" anchorX="center">
                {p.name}
              </Text>
            </mesh>
            
            {p.hasRing && (
              <mesh position={[p.dist, 0, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
                <ringGeometry args={[p.size + 0.15, p.size + 0.5, 64]} />
                <meshLambertMaterial map={p.texture} side={THREE.DoubleSide} transparent opacity={0} />
              </mesh>
            )}
            
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[p.dist - 0.015, p.dist + 0.015, 64]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.01} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}