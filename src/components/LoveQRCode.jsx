<<<<<<< HEAD
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
=======
import React, { useEffect, useRef } from 'react';

export default function LoveQRCode({ url = "https://fuck-galaxy.vercel.app/", size = 280 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Gunakan Google Chart API untuk men-generate QR Code asli yang VALID & BISA DI-SCAN
    // Chs = Size, Chl = URL Target, Choe = Encoding
    const qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(url)}&chld=H|1`;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Anti-error CORS pas diklik kanan save image
    img.src = qrImageUrl;

    img.onload = () => {
      // 1. Bersihkan canvas lama
      ctx.clearRect(0, 0, size, size);

      // 2. Gambar QR asli dari Google API sebagai fondasi data biner valid
      ctx.drawImage(img, 0, 0, size, size);

      // 3. Ambil data pixel untuk kita manipulasi warnanya dari hitam ke Hot Pink estetik
      const imgData = ctx.getImageData(0, 0, size, size);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Jika pixel berwarna hitam atau mendekati hitam (R, G, B < 120)
        if (data[i] < 120 && data[i+1] < 120 && data[i+2] < 120) {
          data[i] = 236;     // Ubah Merah (R) ke #ec4899 (Hot Pink)
          data[i+1] = 72;    // Ubah Hijau (G)
          data[i+2] = 153;   // Ubah Biru (B)
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // 4. OVERLAY DEKORASI: Gambar Ikon Hati Pink Solid di tengah-tengah QR Code
      const center = size / 2;
      const heartSize = size * 0.18; // Ukuran proporsional biar gak nutupin data QR

      // Bikin background kotak putih kecil dulu di tengah biar hatinya kontras
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(center, center, heartSize * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Gambar Hati Pink Solid di tengah
      ctx.fillStyle = "#f43f5e"; // Rose pink murni
      drawCenterHeart(ctx, center, center, heartSize);

      // 5. Tambahkan teks petunjuk di bawah canvas
      ctx.fillStyle = "#db2777";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCAN ME TO OPEN YOUR GALAXY 💖", center, size - 8);
    };
  }, [url, size]);

  // Helper menggambar ikon hati presisi tinggi di tengah canvas
  function drawCenterHeart(ctx, x, y, width) {
    const topY = y - width / 4;
    ctx.beginPath();
    ctx.moveTo(x, topY + width / 4);
    ctx.bezierCurveTo(x - width / 2, topY, x - width / 2, topY + width / 2, x, topY + width * 0.85);
    ctx.bezierCurveTo(x + width / 2, topY + width / 2, x + width / 2, topY, x, topY + width / 4);
    ctx.closePath();
    ctx.fill();
  }
>>>>>>> 31bce161b8b949cf9fb663599bdfece9011874ed

export default function LoveQRCode({ url = "https://fuck-galaxy.vercel.app/", size = 280 }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
<<<<<<< HEAD
      background: '#ffffff', 
      padding: '24px 24px 28px 24px', 
=======
      background: 'rgba(255, 255, 255, 0.98)', 
      padding: '24px 24px 32px 24px', 
>>>>>>> 31bce161b8b949cf9fb663599bdfece9011874ed
      borderRadius: '24px', 
      boxShadow: '0 20px 40px rgba(236, 72, 153, 0.15)', 
      border: '2px solid #fbcfe8' 
    }}>
<<<<<<< HEAD
      
      {/* 🎯 GENERATOR QR CODE UTAMA: Menggunakan SVG asli yang tajam, anti-pecah, dan super responsif */}
      <QRCodeSVG
        value={url}
        size={size}
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

      <p style={{ color: '#db2777', fontSize: '11px', marginTop: '12px', fontWeight: '700', letterSpacing: '0.03em' }}>
        SCAN ME TO OPEN YOUR GALAXY 💖
      </p>
      
      <p style={{ color: '#9ca3af', fontSize: '9px', marginTop: '4px', fontWeight: '500' }}>
        Target: {url}
=======
      {/* Canvas tempat QR Code Valid lu digambar */}
      <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: '12px' }} />
      <p style={{ color: '#9ca3af', fontSize: '10px', marginTop: '12px', fontWeight: '500', letterSpacing: '0.02em' }}>
        Secure Link: {url}
>>>>>>> 31bce161b8b949cf9fb663599bdfece9011874ed
      </p>
    </div>
  );
}
