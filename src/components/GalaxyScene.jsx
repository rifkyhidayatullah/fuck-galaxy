import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import SpaceBackground from '../three/SpaceBackground';
import ParticlePlanet from '../three/ParticlePlanet';
import PhotoOrbit from '../three/PhotoOrbit'; 
import CinematicGalaxy from '../three/CinematicGalaxy';
import MeteorEffect from '../three/MeteorEffect'; 
import MilkyWayGalaxy from '../three/MilkyWayGalaxy'; 
import { Orbit, ArrowLeft, Clapperboard } from 'lucide-react';
import * as THREE from 'three';

function CameraController({ triggerIntro, sceneMode }) {
  const angleRef = useRef(0);
  const progressRef = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (sceneMode === 'milkyway') {
      progressRef.current = 0;
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.04);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 18, 0.04);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 22, 0.04);
      state.camera.lookAt(0, 0, 0);
    } 

    else if (sceneMode === 'cinematic') {
      if (progressRef.current < 1) {
        progressRef.current += 0.003;
      }
      const sinProgress = Math.sin(progressRef.current * Math.PI);
      const baseRadius = 15.5 + Math.sin(time * 0.15) * 1.5; 
      const dynamicRadius = THREE.MathUtils.lerp(baseRadius, 0.6, sinProgress);

      angleRef.current += 0.0025; 
      const targetY = 1.8 + Math.cos(time * 0.1) * 2.0;

      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.cos(angleRef.current) * dynamicRadius, 0.025);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.025);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, Math.sin(angleRef.current) * dynamicRadius, 0.025);
      state.camera.lookAt(0, 0, 0);
    } 

    else {
      progressRef.current = 0;
      if (triggerIntro) {
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 14, 0.03);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2, 0.03);
      }
    }
  });
  return null;
}

export default function GalaxyScene() {
  const [startIntro, setStartIntro] = useState(false);
  const [sceneMode, setSceneMode] = useState('normal');

  useEffect(() => {
    setStartIntro(true);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', backgroundColor: '#000000', zIndex: 10 }}>
      
      {/* =========================================================================

         ========================================================================= */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 99, display: 'flex', gap: '12px', alignItems: 'center' }}>
        
        {/* Tombol Back Utama */}
        {sceneMode !== 'normal' && (
          <button
            onClick={() => setSceneMode('normal')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(10, 10, 10, 0.75)',
              border: '1px solid #262626', color: '#e5e5e5', padding: '10px 16px', borderRadius: '12px',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', cursor: 'pointer',
              fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', tracking: '0.1em', transition: 'all 0.3s'
            }}
          >
            <ArrowLeft size={14} /> Back to Orbit
          </button>
        )}

        {/* Tombol Milky Way Mode */}
        {sceneMode === 'normal' && (
          <button
            onClick={() => setSceneMode('milkyway')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'linear-gradient(to right, rgba(48, 9, 117, 0.6), rgba(15, 23, 42, 0.6))',
              border: '1px solid rgba(168, 85, 247, 0.4)', color: '#f3e8ff', padding: '10px 16px', borderRadius: '12px',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', cursor: 'pointer',
              fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', tracking: '0.1em', transition: 'all 0.3s'
            }}
          >
            <Orbit size={14} style={{ animation: 'spin 6s linear infinite' }} /> Milky Way Mode
          </button>
        )}

        {/* Tombol Cinematic Mode */}
        {sceneMode === 'normal' && (
          <button
            onClick={() => setSceneMode('cinematic')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'linear-gradient(to right, rgba(136, 19, 55, 0.6), rgba(83, 8, 46, 0.6))',
              border: '1px solid rgba(244, 63, 94, 0.4)', color: '#ffe4e6', padding: '10px 16px', borderRadius: '12px',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', cursor: 'pointer',
              fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', tracking: '0.1em', transition: 'all 0.3s'
            }}
          >
            <Clapperboard size={14} /> Cinematic Mode
          </button>
        )}
      </div>

      {/* RENDER CANVAS THREE.JS JAMINAN LAYAR PENUH */}
      <Canvas camera={{ position: [0, 10, 40], fov: 60 }}>
        
        <CameraController triggerIntro={startIntro} sceneMode={sceneMode} />

        {/* PENCAHAYAAN OPTIMAL UNTUK TEKSTUR PLANET */}
        <ambientLight intensity={sceneMode === 'cinematic' ? 0.95 : 0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        {/* Tambahan lampu pusat di tengah matahari khusus untuk menyinari sisi dalam planet */}
        <pointLight position={[0, 0, 0]} intensity={2} distance={20} />
        
<group onDoubleClick={() => setSceneMode('cinematic')}>
  <ParticlePlanet />
  <PhotoOrbit isCinematic={sceneMode === 'cinematic'} />
  <CinematicGalaxy isActive={sceneMode === 'cinematic'} />
  <MeteorEffect isActive={sceneMode === 'cinematic'} />
</group>
        <SpaceBackground />
        
        {/* Layer Konten Utama */}
        {sceneMode !== 'milkyway' && (
          <group>
            <ParticlePlanet />
            <PhotoOrbit isCinematic={sceneMode === 'cinematic'} />
            <CinematicGalaxy isActive={sceneMode === 'cinematic'} />
            <MeteorEffect isActive={sceneMode === 'cinematic'} />
          </group>
        )}

        {/* Layer Bima Sakti Mode */}
        <MilkyWayGalaxy visible={sceneMode === 'milkyway'} />

        {/* Teks Judul */}
        <Text
          position={[0, sceneMode === 'milkyway' ? 8 : 4.5, sceneMode === 'milkyway' ? -2 : 0]}
          fontSize={sceneMode !== 'normal' ? 0.45 : 0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {sceneMode === 'milkyway' && " 𝙼𝚒𝚕𝚔𝚢 𝚆𝚊𝚢 𝚗𝚢𝚊 𝚜𝚒 𝙴𝚕"}
          {sceneMode === 'cinematic' && "✨ 𝑀𝓎 𝐿𝑜𝓋𝑒𝓁𝓎 𝐸𝓁  💖"}
          {sceneMode === 'normal' && '𝓞𝓷𝓵𝔂 𝓕𝓸𝓻 𝓨𝓸𝓾 "𝓢𝔂𝓲𝓯𝓪 𝓝𝓾𝓻𝓪𝓷𝓲𝓼𝓪 𝓟𝓾𝓽𝓻𝓲"'}
        </Text>

        {/* ZERO LOCK ZOOM LIMIT - Bebas Deket Banget ke Planet */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          maxDistance={sceneMode === 'milkyway' ? 45 : 25} 
          minDistance={sceneMode === 'milkyway' ? 0.1 : 5}    
        />
      </Canvas>
    </div>
  );
}