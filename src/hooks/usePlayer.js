import { useState, useCallback, useEffect } from 'react';

// Tetromino şekilleri ve çarpışma kontrolünü içe aktarıyoruz
import { TETROMINOLAR, rastgeleTetromino } from '../tetrominolar';
import {
  SAHNE_GENISLIK as SAHNE_GENISLIGI,
  carpismayiKontrolEt as carpismaKontrol,
} from '../oyunYardimcilar';

export const usePlayer = () => {
  // Oyuncunun konumu, tetromino şekli ve çarpma durumu burada saklanır
  const [oyuncu, setOyuncu] = useState({
    konum: { x: 0, y: 0 }, // Oyuncunun başlangıç pozisyonu
    tetromino: TETROMINOLAR[0].sekil, // İlk tetromino şekli
    carpti: false, // Çarpma durumu
  });

  // Siradaki tetrominolar listesi
  const [siradakiTetrominolar, setSiradakiTetrominolar] = useState([]);

  // Siradaki tetrominoları başlat
  useEffect(() => {
    const yeniListe = Array.from({ length: 1 }, rastgeleTetromino);
    setSiradakiTetrominolar(yeniListe);
  }, []);

  // Siradaki tetrominoları güncelle
  const birSonrakiTetromino = () => {
    setSiradakiTetrominolar((onceki) => [
      ...onceki.slice(1),
      rastgeleTetromino(),
    ]);
  };

  // Tetromino'yu döndürmek için matris işlemleri
  function dondur(matriks, yon) {
    const yeniMatriks = matriks.map((_, index) =>
      matriks.map((sutun) => sutun[index])
    );
    return yon > 0
      ? yeniMatriks.map((satir) => satir.reverse())
      : yeniMatriks.reverse();
  }

  // Oyuncunun tetrominosunu döndür
  function oyuncuDondur(sahne, yon) {
    const kopyaOyuncu = JSON.parse(JSON.stringify(oyuncu));
    kopyaOyuncu.tetromino = dondur(kopyaOyuncu.tetromino, yon);

    const ilkKonum = kopyaOyuncu.konum.x;
    let ofset = 1;
    while (carpismaKontrol(kopyaOyuncu, sahne, { x: 0, y: 0 })) {
      kopyaOyuncu.konum.x += ofset;
      ofset = -(ofset + (ofset > 0 ? 1 : -1));
      if (ofset > kopyaOyuncu.tetromino[0].length) {
        dondur(kopyaOyuncu.tetromino, -yon);
        kopyaOyuncu.konum.x = ilkKonum;
        return;
      }
    }
    setOyuncu(kopyaOyuncu);
  }

  // Oyuncunun konumunu güncelle
  const oyuncuKonumGuncelle = ({ x, y, carpti }) => {
    setOyuncu((onceki) => ({
      ...onceki,
      konum: { x: onceki.konum.x + x, y: onceki.konum.y + y },
      carpti,
    }));
  };

  // Oyuncunun tetrominosunu sıfırlama fonksiyonu
  const oyuncuSifirla = useCallback(() => {
    const yeniTetromino = siradakiTetrominolar[0];
    birSonrakiTetromino(); // Siradaki tetrominoları güncelle
    setOyuncu({
      konum: { x: SAHNE_GENISLIGI / 2 - 2, y: 0 },
      tetromino: yeniTetromino.sekil,
      carpti: false,
    });
  }, [siradakiTetrominolar]);

  // Oyuncu ve siradaki tetrominoları döndür
  return [oyuncu, oyuncuKonumGuncelle, oyuncuSifirla, oyuncuDondur, siradakiTetrominolar];
};
