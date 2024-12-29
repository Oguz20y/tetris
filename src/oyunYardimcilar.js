// Oyun sahnesinin genişliği ve yüksekliği
export const SAHNE_GENISLIK = 12; // Sahnede 12 sütun var
export const SAHNE_YUKSEKLIK = 20; // Sahnede 20 satır var

// Oyun sahnesini oluşturan fonksiyon
export const sahneyiOlustur = () =>
  Array.from({ length: SAHNE_YUKSEKLIK }, () =>
    Array(SAHNE_GENISLIK).fill([0, 'temizle'])
  );

/**
 * Oyuncunun hareket ettiği sırada çarpışma olup olmadığını kontrol eden fonksiyon
 * @param {Object} oyuncu - oyuncu nesnesi
 * @param {Array}  sahne - oyun sahnesi (2D dizi)
 * @param {Object} param2 - hareket vektörü {x, y}
 */
export const carpismayiKontrolEt = (oyuncu, sahne, { x: hareketX, y: hareketY }) => {
  // Optional chaining ile: oyuncu?.konum olmadığı durumda doğrudan true dön
  if (!oyuncu?.konum) return true;

  // Oyuncunun Tetrominosundaki her bir hücreyi kontrol et
  for (let satirIndex = 0; satirIndex < oyuncu.tetromino.length; satirIndex += 1) {
    for (
      let sutunIndex = 0; 
      sutunIndex < oyuncu.tetromino[satirIndex].length; 
      sutunIndex += 1
    ) {
      // Tetromino hücresinin dolu olup olmadığını kontrol et
      if (oyuncu.tetromino[satirIndex][sutunIndex] !== 0) {

        // Sahnede ilgili hücreye optional chaining ile eriş
        const hucreDurumu = sahne
          ?.[satirIndex + oyuncu.konum.y + hareketY]
          ?.[sutunIndex + oyuncu.konum.x + hareketX]?.[1];

        // Hücre yoksa (undefined) veya "temizle" değilse çarpışma var
        if (hucreDurumu !== 'temizle') {
          return true; // Çarpışma tespit edildi
        }
      }
    }
  }
  // Tüm hücreler temiz ise çarpışma yok
  return false;
};
