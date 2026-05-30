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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // State untuk mendeteksi hover tombol secara manual tanpa CSS file
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // Kunci pendeteksi Ukuran Layar HP vs Laptop otomatis
  useEffect(() => {
    setStartIntro(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 📝 DESIGN STYLES OBJECT (PREMIUM DEEP SPACE GLASSMORPHISM)
  const styles = {
    container: {
      position: 'absolute',
      top: '24px',
      left: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    hamburgerBtn: {
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'rgba(10, 10, 10, 0.85)',
      color: '#c084fc',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      padding: '10px 18px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      cursor: 'pointer',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(168, 85, 247, 0.15)',
      transition: 'all 0.3s ease'
    },
    menuWrapper: {
      display: !isMobile || menuOpen ? 'flex' : 'none',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'flex-start',
      gap: '12px',
      backgroundColor: isMobile ? 'rgba(5, 5, 5, 0.9)' : 'transparent',
      padding: isMobile ? '16px' : '0px',
      borderRadius: '16px',
      border: isMobile ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      backdropFilter: isMobile ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isMobile ? 'blur(20px)' : 'none',
      transition: 'all 0.4s ease',
      transform: isMobile && menuOpen ? 'scale(1)' : isMobile ? 'scale(0.95)' : 'none',
      opacity: isMobile && !menuOpen ? 0 : 1
    },
    baseBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      cursor: 'pointer',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      whiteSpace: 'nowrap',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' // Efek animasi mantul murni
    },
    backBtn: {
      backgroundColor: 'rgba(20, 20, 20, 0.75)',
      color: '#e5e5e5',
      border: '1px solid #262626',
      boxShadow: hoveredBtn === 'back' ? '0 0 25px rgba(255, 255, 255, 0.25)' : '0 4px 15px rgba(0,0,0,0.3)',
      transform: hoveredBtn === 'back' ? 'translateY(-2px) scale(1.03)' : 'scale(1)'
    },
    milkyBtn: {
      background: 'linear-gradient(to right, rgba(48, 9, 117, 0.45), rgba(15, 23, 42, 0.45))',
      color: '#e9d5ff',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      boxShadow: hoveredBtn === 'milky' ? '0 0 30px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(168, 85, 247, 0.3)' : '0 4px 15px rgba(0,0,0,0.3)',
      transform: hoveredBtn === 'milky' ? 'translateY(-2px) scale(1.03)' : 'scale(1)'
    },
    cinemaBtn: {
      background: 'linear-gradient(to right, rgba(136, 19, 55, 0.45), rgba(83, 8, 46, 0.45))',
      color: '#ffe4e6',
      border: '1px solid rgba(244, 63, 94, 0.4)',
      boxShadow: hoveredBtn === 'cinema' ? '0 0 30px rgba(244, 63, 94, 0.6), inset 0 0 10px rgba(244, 63, 94, 0.3)' : '0 4px 15px rgba(0,0,0,0.3)',
      transform: hoveredBtn === 'cinema' ? 'translateY(-2px) scale(1.03)' : 'scale(1)'
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', backgroundColor: '#000000', zIndex: 10 }}>
      
      {/* 🎛️ LAYER INTERFACE NAVIGASI EXCLUSIVE (PURE CSS INLINE INJECTED) */}
      <div style={styles.container}>
        
        {/* 📱 BUTTON MENU HP (Otomatis Sembunyi Pas di Laptop) */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={styles.hamburgerBtn}
          onMouseEnter={() => setHoveredBtn('burger')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* ⚙️ CONTAINER TOMBOL GROUP UTAMA */}
        <div style={styles.menuWrapper}>
          
          {/* Tombol Back Utama */}
          {sceneMode !== 'normal' && (
            <button
              onClick={() => { setSceneMode('normal'); setMenuOpen(false); }}
              style={{ ...styles.baseBtn, ...styles.backBtn }}
              onMouseEnter={() => setHoveredBtn('back')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <ArrowLeft size={14} style={{ transform: hoveredBtn === 'back' ? 'translateX(-3px)' : 'none', transition: 'all 0.3s' }} /> 
              Back to Orbit
            </button>
          )}

          {/* Tombol Milky Way Mode */}
          {sceneMode === 'normal' && (
            <button
              onClick={() => { setSceneMode('milkyway'); setMenuOpen(false); }}
              style={{ ...styles.baseBtn, ...styles.milkyBtn }}
              onMouseEnter={() => setHoveredBtn('milky')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <Orbit size={14} style={{ transform: 'rotate(' + (hoveredBtn === 'milky' ? '180deg' : '0deg') + ')', transition: 'all 0.8s ease' }} /> 
              Milky Way Mode
            </button>
          )}

          {/* Tombol Cinematic Mode */}
          {sceneMode === 'normal' && (
            <button
              onClick={() => { setSceneMode('cinematic'); setMenuOpen(false); }}
              style={{ ...styles.baseBtn, ...styles.cinemaBtn }}
              onMouseEnter={() => setHoveredBtn('cinema')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <Clapperboard size={14} style={{ transform: hoveredBtn === 'cinema' ? 'scale(1.2) rotate(12deg)' : 'none', transition: 'all 0.3s' }} /> 
              Cinematic Mode
            </button>
          )}
        </div>
      </div>

      {/* RENDER CANVAS THREE.JS JAMINAN LAYAR PENUH */}
      <Canvas camera={{ position: [0, 10, 40], fov: 60 }}>
        <CameraController triggerIntro={startIntro} sceneMode={sceneMode} />
        <ambientLight intensity={sceneMode === 'cinematic' ? 0.95 : 0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[0, 0, 0]} intensity={2} distance={20} />
        
        <group onDoubleClick={() => setSceneMode('cinematic')}>
          <ParticlePlanet />
          <PhotoOrbit isCinematic={sceneMode === 'cinematic'} />
          <CinematicGalaxy isActive={sceneMode === 'cinematic'} />
          <MeteorEffect isActive={sceneMode === 'cinematic'} />
        </group>
        <SpaceBackground />
        
        {sceneMode !== 'milkyway' && (
          <group>
            <ParticlePlanet />
            <PhotoOrbit isCinematic={sceneMode === 'cinematic'} />
            <CinematicGalaxy isActive={sceneMode === 'cinematic'} />
            <MeteorEffect isActive={sceneMode === 'cinematic'} />
          </group>
        )}

        <MilkyWayGalaxy visible={sceneMode === 'milkyway'} />

        <Text
          position={[0, sceneMode === 'milkyway' ? 8 : 4.5, sceneMode === 'milkyway' ? -2 : 0]}
          fontSize={sceneMode !== 'normal' ? 0.45 : 0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {sceneMode === 'milkyway' && " 𝙼𝚒𝚕𝚔𝚢 𝚆𝚊𝚢 𝚗𝚢𝚊 𝚜𝚒 𝙴𝚕"}
          {sceneMode === 'cinematic' && "✨ 𝑀𝓎 𝐿𝑜𝓋𝑒𝓁𝓎 𝐸𝓁  💖"}
          {sceneMode === 'normal' && '"𝓢𝔂𝓲𝓯𝓪 𝓝𝓾𝓻𝓪𝓷𝓲𝓼𝓪 𝓟𝓾𝓽𝓻𝓲"'}
        </Text>

        <OrbitControls enableZoom={true} enablePan={false} maxDistance={sceneMode === 'milkyway' ? 45 : 25} minDistance={sceneMode === 'milkyway' ? 0.1 : 5} />
      </Canvas>
    </div>
  );
}