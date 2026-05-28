import React, { useState, useEffect } from 'react';
import WelcomeModal from './components/WelcomeModal';
import Instructions from './components/Instructions';
import GalaxyScene from './components/GalaxyScene';
import LoveQRCode from './components/LoveQRCode';

export default function App() {
  // State untuk mengontrol halaman: 'welcome' atau 'galaxy'
  const [gameState, setGameState] = useState('welcome');
  // State untuk memunculkan petunjuk kontrol setelah masuk galaksi
  const [showInstructions, setShowInstructions] = useState(false);
  
  // 🔐 STATE RAHASIA: Untuk memunculkan QR Code khusus buat lu (developer)
  const [showDevQR, setShowDevQR] = useState(false);

  // ⌨️ EFFECT RAHASIA: Ketik "qr" di halaman awal buat memunculkan/menyembunyikan QR Code
  useEffect(() => {
    let keysPressed = "";
    const handleKeyDown = (e) => {
      keysPressed += e.key.toLowerCase();
      if (keysPressed.length > 5) keysPressed = keysPressed.slice(-2);
      
      // Jika lu ketik huruf "q" lalu "r" secara berurutan di keyboard... BOOM! QR muncul
      if (keysPressed.includes("qr")) {
        setShowDevQR(prev => !prev);
        keysPressed = ""; // Reset
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAccept = () => {
    setGameState('galaxy');
    setShowInstructions(true);
  };

  return (
    <div className="relative w-full h-screen select-none text-white overflow-hidden bg-[#040108]">
      
      {/* =========================================================================
         🎯 1. STATE WELCOME: Tampilan Awal (Welcome Modal Bersih Murni Buat Si Ayu)
         ========================================================================= */}
      {gameState === 'welcome' && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            background: 'radial-gradient(circle at center, #0c051a 0%, #030106 100%)',
            padding: '24px',
            overflowY: 'auto'
          }}
          className="md:flex-row" // Biar di laptop otomatis berjejer kiri-kanan rapi wir
        >
          {/* Hanya ada Modal Pertanyaan Romantis (QR Code aslinya gaib / disembunyikan) */}
          <WelcomeModal onAccept={handleAccept} />
          
          {/* 🕵️‍♂️ MODE DEVELOPER: QR Code ini HANYA muncul kalau LU ketik tombol "q" lalu "r" di keyboard laptop */}
          {showDevQR && (
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '12px',
                animation: 'fadeIn 0.5s ease-in-out',
                position: 'relative',
                zIndex: 10000
              }}
            >
              {/* MASUKKIN LINK VERCEL LU YANG SUDAH JADI DI SINI WIR! */}
              <LoveQRCode url="https://fuck-galaxy.vercel.app/" size={260} />
              <p style={{ color: '#f472b6', fontSize: '12px', fontWeight: '500', textAlign: 'center' }}>
                Mode Developer Aktif! <br />📸 Klik Kanan QR & Save Image!
              </p>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
         🌌 2. STATE GALAXY: Canvas 3D Semesta Utama (Hanya dipanggil SEKALI)
         ========================================================================= */}
      {gameState === 'galaxy' && (
        <GalaxyScene />
      )}

      {/* =========================================================================
         🎬 OVERLAY: Petunjuk Kontrol Kamera Galaksi
         ========================================================================= */}
      {showInstructions && (
        <Instructions onClose={() => setShowInstructions(false)} />
      )}

    </div>
  );
}
