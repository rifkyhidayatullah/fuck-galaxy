import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function LoveQRCode({ url = "https://fuck-galaxy.vercel.app/", size = 280 }) {
  return (
    <div 
    className="w-full max-w-[260px] sm:max-w-[300px] p-4 sm:p-6"
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#ffffff', 
      padding: '24px 24px 28px 24px', 
      borderRadius: '24px', 
      boxShadow: '0 20px 40px rgba(236, 72, 153, 0.15)', 
      border: '2px solid #fbcfe8' 
    }}>
      
      {/* 🎯 GENERATOR QR CODE UTAMA: Menggunakan SVG asli yang tajam, anti-pecah, dan super responsif */}
      <div className="w-full aspect-square max-w-[210px] sm:max-w-[250px]">
      <QRCodeSVG
        value={url}
        size={undefined}
        style={{ width: '100%', height: '100%' }}
        bgColor={"#ffffff"}
        fgColor={"#ec4899"} // Warna Hot Pink pilihan lu, Wir!
        level={"H"}         // Tingkat akurasi tinggi (High), biar kalau ditimpa logo tengah tetep bisa di-scan
        includeMargin={true}
        imageSettings={{
          src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f43f5e'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>",
          x: null,
          y: null,
          height: size * 0.2, // Ukuran ikon hati di tengah-tengah QR
          width: size * 0.2,
          excavate: true,     // Memotong kotak QR di belakang ikon hati biar gak bentrok datanya
        }}
      />
</div>
      <p style={{ color: '#db2777', fontSize: '11px', marginTop: '12px', fontWeight: '700', letterSpacing: '0.03em' }}>
        SCAN ME TO OPEN YOUR GALAXY 💖
      </p>
      
      <p style={{ color: '#9ca3af', fontSize: '9px', marginTop: '4px', fontWeight: '500' }}>
        Target: {url}
      </p>
    </div>
  );
}