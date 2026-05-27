import React, { useState } from 'react';
import { X, Move, MousePointer, Menu, Clapperboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Instructions() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div 
            key="large-card"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.85 }}
            transition={{ type: "spring", duration: 0.6 }}
            style={{
              width: '90vw',
              maxWidth: '380px',
              backgroundColor: 'rgba(10, 10, 10, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 0 40px rgba(168, 85, 247, 0.25)',
              color: '#ffffff',
              fontFamily: 'sans-serif'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', height: '8px', width: '8px', position: 'relative' }}>
                  <span style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7', opacity: 0.75 }}></span>
                </span>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#c084fc', letterSpacing: '0.1em', margin: 0 }}>🌌 GALAKSI KONTROL</h3>
              </div>
              <motion.button 
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)} 
                style={{
                  color: '#a3a3a3',
                  padding: '4px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(23, 23, 23, 0.6)',
                  border: '1px solid #262626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </motion.button>
            </div>
            
            {/* Isi Instruksi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Cinematic Mode Hint (BARU) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(168, 85, 247, 0.15)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                <div style={{ padding: '6px', backgroundColor: 'rgba(219, 39, 119, 0.2)', borderRadius: '8px', color: '#f472b6', display: 'flex' }}>
                  <Clapperboard size={16} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#f472b6' }}>✨ Mode Cinematic</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#e5e5e5' }}>Klik 2x (Double Click) layar untuk memutar otomatis momen indah.</p>
                </div>
              </div>

              {/* Mobile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(23, 23, 23, 0.4)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(38, 38, 38, 0.6)' }}>
                <div style={{ padding: '6px', backgroundColor: 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', display: 'flex' }}>
                  <Move size={16} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>Mode Mobile / HP</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#a3a3a3' }}>Geser layar untuk memutar • Cubit untuk zoom.</p>
                </div>
              </div>

              {/* PC */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(23, 23, 23, 0.4)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(38, 38, 38, 0.6)' }}>
                <div style={{ padding: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', display: 'flex' }}>
                  <MousePointer size={16} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>Mode PC / Laptop</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#a3a3a3' }}>Klik & drag mouse untuk memutar • Scroll untuk zoom.</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="mini-trigger"
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(10, 10, 10, 0.75)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(168, 85, 247, 0.5)',
              borderRadius: '30px', padding: '10px 18px', color: '#ffffff', cursor: 'pointer',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)', fontSize: '12px', fontWeight: '600', fontFamily: 'sans-serif'
            }}
          >
            <Menu size={16} style={{ color: '#c084fc' }} />
            <span>Petunjuk Kontrol</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}