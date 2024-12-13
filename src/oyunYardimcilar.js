// Oyun sahnesinin genişliği ve yüksekliği
export const SAHNE_GENISLIK = 12; // Sahnede 12 sütun var
export const SAHNE_YUKSEKLIK = 20; // Sahnede 20 satır var

// Oyun sahnesini oluşturan fonksiyon
export const sahneyiOlustur = () =>
  Array.from(Array(SAHNE_YUKSEKLIK), () => 
    Array(SAHNE_GENISLIK).fill([0, 'temizle'])
  );

// Oyuncunun hareket ettiği sırada çarpışma olup olmadığını kontrol eden fonksiyon
export const carpismayiKontrolEt = (oyuncu, sahne, { x: hareketX, y: hareketY }) => {
  // Oyuncu veya konum nesnesi undefined ise çarpışma varmış gibi davranır
  if (!oyuncu || !oyuncu.konum) return true;

  // Oyuncunun Tetrominosundaki her bir hücreyi kontrol eder
  for (let y = 0; y < oyuncu.tetromino.length; y += 1) {
    for (let x = 0; x < oyuncu.tetromino[y].length; x += 1) {
      // 1. Tetromino hücresinin dolu olup olmadığını kontrol et
      if (oyuncu.tetromino[y][x] !== 0) {
        if (
          // 2. Sahnenin sınırlarının dışına çıkılıp çıkılmadığını kontrol et
          !sahne[y + oyuncu.konum.y + hareketY] || 
          // 3. Sahnenin genişliği aşıldı mı?
          !sahne[y + oyuncu.konum.y + hareketY][x + oyuncu.konum.x + hareketX] || 
          // 4. Hareket edilen hücrenin dolu olup olmadığını kontrol et
          sahne[y + oyuncu.konum.y + hareketY][x + oyuncu.konum.x + hareketX][1] !== 'temizle'
        ) {
          return true; // Çarpışma tespit edildi
        }
      }
    }
  }
  // Çarpışma yoksa false döndür
  return false;
};
