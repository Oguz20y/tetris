import React, { useState } from 'react';

// Oyun yardımcı fonksiyonlarını içe aktarıyoruz
import { sahneyiOlustur as sahneOlustur, carpismayiKontrolEt as carpismaKontrol } from '../oyunYardimcilar';
import { TetrisSarmal, TetrisStili } from './stiller/TetrisStili';

// Özel hook'ları içe aktarıyoruz
import { useInterval as zamanlayiciKullan } from '../hooks/useInterval';
import { usePlayer as oyuncuKullan } from '../hooks/usePlayer';
import { useStage as sahneKullan } from '../hooks/useStage';
import { useGameStatus as oyunDurumuKullan } from '../hooks/useGameStatus';

// Bileşenleri içe aktarıyoruz
import Sahne from './Sahne';
import Gosterge from './Gosterge';
import BaslatDugmesi from './BaslatDugmesi';

const Tetris = () => {
  const [dusmeSuresi, dusmeSuresiAyarla] = useState(1000); // Düşme süresi artık sabit
  const [oyunBitti, oyunBittiAyarla] = useState(false);

  const [oyuncu, oyuncuKonumGuncelle, oyuncuSifirla, oyuncuDondur] = oyuncuKullan();
  const [sahne, sahneAyarla, temizlenenSatirlar] = sahneKullan(oyuncu, oyuncuSifirla);
  const [puan, puanAyarla, satirlar, satirlarAyarla] = oyunDurumuKullan(temizlenenSatirlar);

  // Oyuncunun hareket etmesini sağlar
  const oyuncuHareket = yon => {
    if (!carpismaKontrol(oyuncu, sahne, { x: yon, y: 0 })) {
      oyuncuKonumGuncelle({ x: yon, y: 0 });
    }
  };

  // Oyunun başlatılmasını sağlar
  const oyunuBaslat = () => {
    sahneAyarla(sahneOlustur());
    dusmeSuresiAyarla(1000); // Sabit düşme süresi
    oyuncuSifirla();
    puanAyarla(0);
    satirlarAyarla(0);
    oyunBittiAyarla(false);
  };

  // Oyuncunun tetrominosunu düşürme işlemi
  const dusur = () => {
    if (!carpismaKontrol(oyuncu, sahne, { x: 0, y: 1 })) {
      oyuncuKonumGuncelle({ x: 0, y: 1, carpti: false });
    } else {
      if (oyuncu.konum.y < 1) {
        oyunBittiAyarla(true);
        dusmeSuresiAyarla(null);
      }
      oyuncuKonumGuncelle({ x: 0, y: 0, carpti: true });
    }
  };

  // Aşağı tuşuna basıldığında tetrominoyu bir satır indirir
  const dusurOyuncu = () => {
    dusur(); // Oyuncu aşağı tuşuna bastığında bir satır indiriyoruz
  };

  // Zamanlayıcıyı kullanarak tetrominoyu otomatik düşürme işlemi
  zamanlayiciKullan(() => {
    dusur();
  }, dusmeSuresi);

  const hareket = ({ keyCode }) => {
    if (!oyunBitti) {
      if (keyCode === 37) oyuncuHareket(-1); // Sol ok
      if (keyCode === 39) oyuncuHareket(1); // Sağ ok
      if (keyCode === 40) dusurOyuncu(); // Aşağı ok
      if (keyCode === 38) oyuncuDondur(sahne, 1); // Yukarı ok
    }
  };

  const hareketiDurdur = ({ keyCode }) => {
    if (!oyunBitti && keyCode === 40) {
      dusmeSuresiAyarla(1000); // Kullanıcı aşağı ok tuşunu bırakırsa düşme süresini eski haline döndür
    }
  };

  return (
    <TetrisSarmal 
      role="button" 
      tabIndex="0" 
      onKeyDown={hareket} 
      onKeyUp={hareketiDurdur} // Kullanıcı tuşu bıraktığında çağrılır
    >
      <TetrisStili>
        <Sahne sahne={sahne} />
        <aside>
          {oyunBitti ? <Gosterge oyunBitti={oyunBitti} metin="Oyun Bitti" /> : null}
          <Gosterge metin={`Puan: ${puan}`} />
          <Gosterge metin={`Satırlar: ${satirlar}`} />
          <BaslatDugmesi geriCagir={oyunuBaslat} />
        </aside>
      </TetrisStili>
    </TetrisSarmal>
  );
};

export default Tetris;
