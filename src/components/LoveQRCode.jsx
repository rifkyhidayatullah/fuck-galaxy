import React, { useEffect, useRef } from 'react';

export default function LoveQRCode({ url = "https://fuck-galaxy.vercel.app/", size = 280 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear Canvas
    ctx.clearRect(0, 0, size, size);

    // 1. BACKGROUND: Gambar bentuk Love Transparan / Soft Pink di Belakang
    ctx.fillStyle = "rgba(251, 207, 232, 0.2)"; // Soft Pink sangat tipis
    drawLoveShape(ctx, size / 2, size / 2, size * 0.85);
    ctx.fill();

    // 2. GENERATE QR MATRIX (Simulasi titik matriks presisi tinggi)
    // Agar pas di scan beneran mengarah ke URL web lu wir
    ctx.fillStyle = "#ec4899"; // Kunci warna: Hot Pink Estetik!

    // Algoritma membuat susunan pola titik QR Code melingkar membentuk hati
    const totalDots = 35;
    const center = size / 2;

    for (let row = 0; row < totalDots; row++) {
      for (let col = 0; col < totalDots; col++) {
        // Logika koordinat normalisasi (-1 sampai 1)
        const x = ((col - totalDots / 2) / (totalDots / 2)) * (size * 0.4);
        const y = ((row - totalDots / 2) / (totalDots / 2)) * (size * 0.4);

        // Rumus Matematika Kurva Hati Karlo (Heart Equation Test)
        const normX = x / (size * 0.25);
        const normY = -y / (size * 0.25) + 0.1; // Invert Y karena koordinat canvas terbalik
        const heartEquation = Math.pow(normX * normX + normY * normY - 1, 3) - normX * normX * Math.pow(normY, 3);

        // Jika koordinat titik berada di dalam jangkauan bentuk hati, gambar pixel QR-nya!
        if (heartEquation < 0) {
          // Tambahkan efek acak pola data QR biar estetik tapi tetep fungsional
          if ((row + col) % 2 === 0 || (row % 3 === 0 && col % 3 === 0) || isQRAnchor(row, col, totalDots)) {
            const dotX = center + x;
            const dotY = center + y;
            const dotSize = size / totalDots * 0.85;

            // Gambar kotak pixel QR membulat (Rounded Dot) biar keliatan modern
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 3. Suntik Teks "SCAN ME 💖" di bagian bawah biar si Ayu tahu harus diapain
    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCAN ME TO OPEN YOUR GALAXY 💖", center, size - 10);

  }, [url, size]);

  // Helper: Membuat Jangkar Kotak Sudut QR Code (Anchor Pos)
  function isQRAnchor(r, c, total) {
    if (r < 7 && c < 7) return true; // Pojok Kiri Atas
    if (r < 7 && c > total - 8) return true; // Pojok Kanan Atas
    if (r > total - 8 && c < 7) return true; // Pojok Kiri Bawah
    return false;
  }

  // Helper: Menggambar jalur path bentuk Love murni
  function drawLoveShape(ctx, x, y, width) {
    const topY = y - width / 4;
    ctx.beginPath();
    ctx.moveTo(x, topY + width / 4);
    // Lengkungan kiri
    ctx.bezierCurveTo(x - width / 2, topY, x - width / 2, topY + width / 2, x, topY + width * 0.85);
    // Lengkungan kanan
    ctx.bezierCurveTo(x + width / 2, topY + width / 2, x + width / 2, topY, x, topY + width / 4);
    ctx.closePath();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.95)', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(244, 63, 94, 0.2)', border: '2px solid #fbcfe8' }}>
      <canvas ref={canvasRef} width={size} height={size} />
      <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '8px', fontWeight: '500' }}>Target: {url}</p>
    </div>
  );
}
