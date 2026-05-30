import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WelcomeModal({ onAccept }) {
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });

  const moveButton = () => {
    // Jangkauan tombol No kabur disesuaikan agar tidak nembus nabrak QR Code di sebelah
    const randomX = Math.floor(Math.random() * 140) - 70; 
    const randomY = Math.floor(Math.random() * 100) - 50; 
    setNoBtnPos({ x: randomX, y: randomY });
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '8px',
        boxSizing: 'border-box'
      }}
    >
      {/* Background Glow Dekorasi Galaksi Tambahan */}
      <div style={{ position: 'absolute', width: '250px', height: '250px', backgroundColor: 'rgba(168, 85, 247, 0.2)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', top: '-40px' }}></div>
      <div style={{ position: 'absolute', width: '250px', height: '250px', backgroundColor: 'rgba(219, 39, 119, 0.15)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', bottom: '-40px' }}></div>

      {/* Container Utama Modal (Premium Glassmorphism Style) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-[340px] sm:max-w-[380px] p-6 sm:p-10 text-center relative"
        style={{
          backgroundColor: 'rgba(12, 12, 12, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          padding: '40px 32px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.7), inset 0 0 20px rgba(255, 255, 255, 0.02)',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {/* Hiasan Garis Atas Gradasi */}
        <div style={{ width: '80px', height: '3px', background: 'linear-gradient(to right, #a855f7, #db2777)', borderRadius: '999px', margin: '0 auto 28px auto' }} />

        {/* Teks Pertanyaan */}
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          letterSpacing: '0.03em', 
          lineHeight: '1.4',
          background: 'linear-gradient(to bottom, #ffffff 40%, #a3a3a3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'sans-serif',
          margin: '0 0 36px 0'
        }}>
          Do you want to see my favorite person?
        </h2>
        
        {/* Container Tombol */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', position: 'relative', height: '56px' }}>
          
          {/* TOMBOL YES (Of course 🥰) */}
          <motion.button
            whileHover={{ 
              scale: 1.08, 
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.7)",
              background: 'linear-gradient(135deg, #b55fe6, #e63986)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccept}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #db2777)',
              color: '#ffffff',
              fontWeight: '600',
              padding: '12px 28px',
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
              transition: 'box-shadow 0.3s ease, background 0.3s ease',
              fontFamily: 'sans-serif',
              zIndex: 10
            }}
          >
            Of course 🥰
          </motion.button>

          {/* TOMBOL NO (No way 😢) - RESPONSIVE KABUR */}
          <motion.button
            onMouseEnter={moveButton}
            onTouchStart={moveButton}
            animate={{ x: noBtnPos.x, y: noBtnPos.y }}
            transition={{ type: "spring", stiffness: 320, damping: 14 }}
            style={{
              backgroundColor: 'rgba(23, 23, 23, 0.8)',
              color: '#737373',
              fontWeight: '500',
              padding: '12px 24px',
              borderRadius: '14px',
              border: '1px solid rgba(64, 64, 64, 0.5)',
              fontSize: '14px',
              cursor: 'default',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              fontFamily: 'sans-serif',
              transition: 'color 0.2s, border 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#e5e5e5';
              e.currentTarget.style.borderColor = '#888888';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#737373';
              e.currentTarget.style.borderColor = 'rgba(64, 64, 64, 0.5)';
            }}
          >
            No way 😢
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}