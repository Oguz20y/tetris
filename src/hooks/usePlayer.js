import { useState, useCallback } from 'react';

// Tetromino şekilleri ve çarpışma kontrolünü içe aktarıyoruz
import { TETROMINOLAR, rastgeleTetromino } from '../tetrominolar';
import { SAHNE_GENISLIK as SAHNE_GENISLIGI, carpismayiKontrolEt as carpismaKontrol } from '../oyunYardimcilar';

// Oyuncu tetrominosunu yönetmek için özel hook
export const usePlayer = () => {
  // Oyuncunun konumu, tetromino şekli ve çarpma durumu burada saklanır
  const [oyuncu, oyuncuAyarla] = useState({
    konum: { x: 0, y: 0 }, // Oyuncunun başlangıç pozisyonu
    tetromino: TETROMINOLAR[0].sekil, // İlk tetromino şekli
    carpti: false, // Çarpma durumu
  });

  // Tetromino'yu döndürmek için matris işlemleri
  function dondur(matriks, yon) {
    // Matriksi döndürmek için önce satır ve sütunları değiştiriyoruz
    const yeniMatriks = matriks.map((_, index) => matriks.map(sutun => sutun[index]));
    // Eğer yön pozitifse her satırı ters çeviriyoruz, aksi takdirde tüm matrisi ters çeviriyoruz
    return yon > 0 ? yeniMatriks.map(satir => satir.reverse()) : yeniMatriks.reverse();
  }

  // Oyuncunun tetrominosunu döndür
  function oyuncuDondur(sahne, yon) {
    const kopyaOyuncu = JSON.parse(JSON.stringify(oyuncu)); // Oyuncunun tetromino verilerini kopyalıyoruz
    kopyaOyuncu.tetromino = dondur(kopyaOyuncu.tetromino, yon); // Tetrominoyu döndürüyoruz

    const ilkKonum = kopyaOyuncu.konum.x; // Oyuncunun ilk pozisyonu
    let ofset = 1; // Ofset, tetromino çarparsa geri çekilmesini sağlar
    while (carpismaKontrol(kopyaOyuncu, sahne, { x: 0, y: 0 })) {
      kopyaOyuncu.konum.x += ofset; // Ofset değerine göre konumu değiştiriyoruz
      ofset = -(ofset + (ofset > 0 ? 1 : -1)); // Ofseti tersine çeviriyoruz
      if (ofset > kopyaOyuncu.tetromino[0].length) {
        dondur(kopyaOyuncu.tetromino, -yon); // Çarpma olursa tetrominoyu eski haline döndürüyoruz
        kopyaOyuncu.konum.x = ilkKonum; // Konumu sıfırlıyoruz
        return;
      }
    }
    oyuncuAyarla(kopyaOyuncu); // Oyuncu bilgilerini güncelliyoruz
  }

  // Oyuncunun konumunu güncelle
  const oyuncuKonumGuncelle = ({ x, y, carpti }) => {
    oyuncuAyarla(onceki => ({
      ...onceki, // Mevcut bilgileri kopyalıyoruz
      konum: { x: onceki.konum.x + x, y: onceki.konum.y + y }, // Konumunu güncelliyoruz
      carpti, // Çarpma durumunu güncelliyoruz
    }));
  };

  // Oyuncunun tetrominosunu sıfırlama fonksiyonu
  const oyuncuSifirla = useCallback(() => {
    oyuncuAyarla({
      konum: { x: SAHNE_GENISLIGI / 2 - 2, y: 0 }, // Oyuncuyu sahnenin ortasına yerleştiriyoruz
      tetromino: rastgeleTetromino().sekil, // Rastgele bir tetromino seçiyoruz
      carpti: false, // Çarpma durumunu sıfırlıyoruz
    });
  }, []);

  // Oyuncu, konum güncelleme, sıfırlama ve döndürme işlemleri döndürülüyor
  return [oyuncu, oyuncuKonumGuncelle, oyuncuSifirla, oyuncuDondur];
};
