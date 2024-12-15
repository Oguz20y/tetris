import React, { useEffect, useState } from 'react';

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
import { BaslatDugmesiStili } from './BaslatDugmesi';

// DurdurDugmesi bileşeni, oyunu durdurmak için bir buton sağlar
const DurdurDugmesi = ({ geriCagir }) => (
  <BaslatDugmesiStili onClick={geriCagir}>Durdur</BaslatDugmesiStili>
);

// DevamDugmesi bileşeni, durdurulan oyunu devam ettirmek için bir buton sağlar
const DevamDugmesi = ({ geriCagir }) => (
  <BaslatDugmesiStili onClick={geriCagir}>Devam Et</BaslatDugmesiStili>
);

// Müzik ve ses dosyalarının yolu (src/ses dizinine göre düzenlendi)
const arkaPlanMuzigi = new Audio(require('../ses/arkaplan.mp3'));
const yonTusuSesi = new Audio(require('../ses/yon-tusu.mp3'));
const blokYerlesmeSesi = new Audio(require('../ses/yerlesme.mp3'));
const oyunBittiSesi = new Audio(require('../ses/game-over.mp3'));

// Müzik ayarları
arkaPlanMuzigi.loop = true; // Arka plan müziği sürekli çalacak şekilde ayarlandı

// State'lerin tanımlanması
const Tetris = () => {
    const [muzikSesSeviyesi, setMuzikSesSeviyesi] = useState(() => {
        const kaydedilenMuzikSesSeviyesi = localStorage.getItem('muzikSesSeviyesi');
        return kaydedilenMuzikSesSeviyesi ? parseFloat(kaydedilenMuzikSesSeviyesi) : arkaPlanMuzigi.volume;
      });
      const [sfxSesSeviyesi, setSfxSesSeviyesi] = useState(() => {
        const kaydedilenSfxSesSeviyesi = localStorage.getItem('sfxSesSeviyesi');
        return kaydedilenSfxSesSeviyesi ? parseFloat(kaydedilenSfxSesSeviyesi) : yonTusuSesi.volume;
      });
    const [dusmeSuresi, dusmeSuresiAyarla] = useState(1000);
    const [oyunBitti, oyunBittiAyarla] = useState(false);
    const [oyunDuraklatildi, setOyunDuraklatildi] = useState(false);
    const [enYuksekPuan, setEnYuksekPuan] = useState(() => {
      const kaydedilenPuan = localStorage.getItem('enYuksekPuan');
      return kaydedilenPuan ? parseInt(kaydedilenPuan, 10) : 0;
    });

    // Hook'ların kullanımı
    const [oyuncu, oyuncuKonumGuncelle, oyuncuSifirla, oyuncuDondur] = oyuncuKullan();
    const [sahne, sahneAyarla, temizlenenSatirlar] = sahneKullan(oyuncu, oyuncuSifirla);
    const [puan, puanAyarla, satirlar, satirlarAyarla] = oyunDurumuKullan(temizlenenSatirlar);


    // Müzik ve ses seviyelerini ayarlama
    useEffect(() => {
        arkaPlanMuzigi.volume = muzikSesSeviyesi;
        localStorage.setItem('muzikSesSeviyesi', muzikSesSeviyesi);
    }, [muzikSesSeviyesi]);

    useEffect(() => {
        yonTusuSesi.volume = sfxSesSeviyesi;
        blokYerlesmeSesi.volume = sfxSesSeviyesi;
        oyunBittiSesi.volume = sfxSesSeviyesi;
        localStorage.setItem('sfxSesSeviyesi', sfxSesSeviyesi)
    }, [sfxSesSeviyesi]);

    // Klavye tuşları dinleyicisi
    useEffect(() => {
      const handleKeyDown = ({ keyCode }) => {
          if (!oyunBitti && !oyunDuraklatildi) {
              if (keyCode === 37) oyuncuHareket(-1);
              if (keyCode === 39) oyuncuHareket(1);
              if (keyCode === 40) dusur();
              if (keyCode === 38) {
                  oyuncuDondur(sahne, 1);
                  yonTusuSesi.currentTime = 0;
                  yonTusuSesi.play().catch(error => console.log('Yukarı tuşu sesi çalma hatası:', error));
              }
          }
          if (keyCode === 13) {
              oyunuBaslat();
          }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [oyunBitti, oyunDuraklatildi, oyuncu, sahne]);

  // Oyuncu hareket ettirme fonksiyonu
  const oyuncuHareket = yon => {
      if (!carpismaKontrol(oyuncu, sahne, { x: yon, y: 0 })) {
          oyuncuKonumGuncelle({ x: yon, y: 0 });
      }
  };  

    // Oyunu başlatma fonksiyonu
    const oyunuBaslat = () => {
        sahneAyarla(sahneOlustur());
        dusmeSuresiAyarla(1000);
        oyuncuSifirla();
        puanAyarla(0);
        satirlarAyarla(0);
        oyunBittiAyarla(false);
        setOyunDuraklatildi(false);
        
        arkaPlanMuzigi.pause();
        arkaPlanMuzigi.currentTime = 0;
        arkaPlanMuzigi.play().catch(error => console.log('Müzik oynatma hatası:', error));
    };

    // Blok düşürme fonksiyonu
    const dusur = () => {
        if (!carpismaKontrol(oyuncu, sahne, { x: 0, y: 1 })) {
            oyuncuKonumGuncelle({ x: 0, y: 1, carpti: false });
        } else {
            if (oyuncu.konum.y < 1) {
                oyunBittiAyarla(true);
                dusmeSuresiAyarla(null);
                arkaPlanMuzigi.pause();
                oyunBittiSesi.currentTime = 0;
                oyunBittiSesi.play().catch(error => console.log('Oyun bitti sesi çalma hatası:', error));
            }
            oyuncuKonumGuncelle({ x: 0, y: 0, carpti: true });
            blokYerlesmeSesi.currentTime = 0;
            blokYerlesmeSesi.play().catch(error => console.log('Blok yerleşme sesi çalma hatası:', error));
        }
    };

    // Blokların aşağıya iniş fonksiyonu
    zamanlayiciKullan(() => {
        if (!oyunDuraklatildi) {
            dusur();
        }
    }, dusmeSuresi);

    // Oyun duraklatma fonksiyonu
    const oyunuDuraklat = () => {
        setOyunDuraklatildi(!oyunDuraklatildi);
        if (!oyunDuraklatildi) {
            arkaPlanMuzigi.pause();
        } else {
            arkaPlanMuzigi.play().catch(error => console.log('Müzik oynatma hatası:', error));
        }
    };
    
    // En yüksek skorun ayarlanması
    useEffect(() => {
      if (puan > enYuksekPuan) {
          setEnYuksekPuan(puan);
          localStorage.setItem('enYuksekPuan', puan);
      }
    }, [puan, enYuksekPuan]);

    // Oyun menüsü kısmı
    return (
      <TetrisSarmal role="button" tabIndex="0">
          <TetrisStili>
              <Sahne sahne={sahne} />
              <aside>
                  {oyunBitti ? <Gosterge oyunBitti={oyunBitti} metin="Oyun Bitti" /> : null}
                  <Gosterge metin={`En Yuksek Skor: ${enYuksekPuan}`} />
                  <Gosterge metin={`Skor: ${puan}`} />
                  <Gosterge metin={`SatIrlar: ${satirlar}`} />
                  <div style={{ backgroundColor: '#000', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                      <Gosterge metin="Muzik Sesi" />
                      <input type="range" min="0" max="1" step="0.01" value={muzikSesSeviyesi} onChange={(e) => setMuzikSesSeviyesi(parseFloat(e.target.value))} style={{ width: '100%' }} />
                  </div>
                  <div style={{ backgroundColor: '#000', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                      <Gosterge metin="SFX Sesi" />
                      <input type="range" min="0" max="1" step="0.01" value={sfxSesSeviyesi} onChange={(e) => setSfxSesSeviyesi(parseFloat(e.target.value))} style={{ width: '100%' }} />
                  </div>
                  <BaslatDugmesi geriCagir={oyunuBaslat} />
                  {oyunDuraklatildi ? <DevamDugmesi geriCagir={oyunuDuraklat} /> : <DurdurDugmesi geriCagir={oyunuDuraklat} />}
              </aside>
          </TetrisStili>
      </TetrisSarmal>
  );
};

export default Tetris;
