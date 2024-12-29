import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SkorTablosu from './SkorTablosu';
import { sahneyiOlustur as sahneOlustur, carpismayiKontrolEt as carpismaKontrol } from '../oyunYardimcilar';

import { useInterval as zamanlayiciKullan } from '../hooks/useInterval';
import { usePlayer as oyuncuKullan } from '../hooks/usePlayer';
import { useStage as sahneKullan } from '../hooks/useStage';
import { useGameStatus as oyunDurumuKullan } from '../hooks/useGameStatus';

import Sahne from './Sahne';
import Gosterge from './Gosterge';
import BaslatDugmesi, { BaslatDugmesiStili } from './BaslatDugmesi'; // Tek satırda import
import AdBileseni from './AdBileseni';
import SesKontrolleri from './SesKontrolleri';

// Video dosyası
import arkaPlanVideosu from '../resim/video.mp4';

// CSS dosyası (artık styled-components yerine bu dosyayı kullanıyoruz)
import './stiller/TetrisStili.css';

import Siradaki from './Siradaki';

// Durdur ve Devam Et düğmeleri
const DurdurDugmesi = ({ geriCagir }) => (
  <BaslatDugmesiStili onClick={geriCagir}>Durdur</BaslatDugmesiStili>
);
DurdurDugmesi.propTypes = {
  geriCagir: PropTypes.func.isRequired,
};

const DevamDugmesi = ({ geriCagir }) => (
  <BaslatDugmesiStili onClick={geriCagir}>Devam Et</BaslatDugmesiStili>
);
DevamDugmesi.propTypes = {
  geriCagir: PropTypes.func.isRequired,
};

// Sesler
const arkaPlanMuzigi = new Audio(require('../ses/arkaplan.mp3'));
const yonTusuSesi = new Audio(require('../ses/yon-tusu.mp3'));
const blokYerlesmeSesi = new Audio(require('../ses/yerlesme.mp3'));
const oyunBittiSesi = new Audio(require('../ses/game-over.mp3'));
arkaPlanMuzigi.loop = true;

const Tetris = () => {
  // Müzik ve SFX ses seviyeleri
  const savedMuzikSesSeviyesi = localStorage.getItem('muzikSesSeviyesi');
  const initialMuzikVolume = savedMuzikSesSeviyesi
    ? parseFloat(savedMuzikSesSeviyesi)
    : arkaPlanMuzigi.volume;
  const [muzikSesSeviyesi, setMuzikSesSeviyesi] = useState(initialMuzikVolume);

  const savedSfxSesSeviyesi = localStorage.getItem('sfxSesSeviyesi');
  const initialSfxVolume = savedSfxSesSeviyesi
    ? parseFloat(savedSfxSesSeviyesi)
    : yonTusuSesi.volume;
  const [sfxSesSeviyesi, setSfxSesSeviyesi] = useState(initialSfxVolume);

  // Diğer state'ler
  const [dusmeSuresi, dusmeSuresiAyarla] = useState(1000);
  const [oyunBitti, oyunBittiAyarla] = useState(false);
  const [oyunDuraklatildi, setOyunDuraklatildi] = useState(false);
  const [enYuksekPuan, setEnYuksekPuan] = useState(0); // SQL skorundan güncellenecek
  const [skorGonderildi, setSkorGonderildi] = useState(false);
  const [oyuncuAdi, setOyuncuAdi] = useState('');
  const [level, setLevel] = useState(1);

  // Sunucu skorları
  const [sqlSkorlar, setSqlSkorlar] = useState([]);

  // Hook'lar
  const [oyuncu, oyuncuKonumGuncelle, oyuncuSifirla, oyuncuDondur, siradakiTetrominolar] = oyuncuKullan();
  const [sahne, sahneAyarla, temizlenenSatirlar] = sahneKullan(oyuncu, oyuncuSifirla);
  const [puan, puanAyarla, satirlar, satirlarAyarla] = oyunDurumuKullan(temizlenenSatirlar);


  // WebSocket bağlantısı (SQL skorları)
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');
    ws.onopen = () => {
      console.log('WebSocket bağlantısı kuruldu.');
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'skorGuncelle') {
        setSqlSkorlar(message.data); // Skorları güncelle
      }
    };
    ws.onclose = () => {
      console.log('WebSocket bağlantısı kapandı.');
    };
    return () => ws.close();
  }, []);

  // Oyuncu adı değiştirme
  const handleOyuncuAdiDegisti = (yeniAd) => {
    const temizlenmisAd = yeniAd.trim().toLowerCase();
    setOyuncuAdi(temizlenmisAd);
  };

  // Müzik ve ses seviyeleri etkileri
  useEffect(() => {
    arkaPlanMuzigi.volume = muzikSesSeviyesi;
    localStorage.setItem('muzikSesSeviyesi', muzikSesSeviyesi);
  }, [muzikSesSeviyesi]);

  useEffect(() => {
    yonTusuSesi.volume = sfxSesSeviyesi;
    blokYerlesmeSesi.volume = sfxSesSeviyesi;
    oyunBittiSesi.volume = sfxSesSeviyesi;
    localStorage.setItem('sfxSesSeviyesi', sfxSesSeviyesi);
  }, [sfxSesSeviyesi]);

  // Klavye dinleyicisi
  useEffect(() => {
    const handleKeyDown = ({ keyCode }) => {
      if (!oyunBitti && !oyunDuraklatildi) {
        if (keyCode === 37) oyuncuHareket(-1); // Sol
        if (keyCode === 39) oyuncuHareket(1);  // Sağ
        if (keyCode === 40) dusur();          // Aşağı
        if (keyCode === 38) {
          oyuncuDondur(sahne, 1);
          // SFX
          yonTusuSesi.currentTime = 0;
          yonTusuSesi.play().catch((error) =>
            console.log('Yukarı tuşu sesi çalma hatası:', error)
          );
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [oyunBitti, oyunDuraklatildi, oyuncu, sahne]);

  // Oyuncu hareketi
  const oyuncuHareket = (yon) => {
    if (!carpismaKontrol(oyuncu, sahne, { x: yon, y: 0 })) {
      oyuncuKonumGuncelle({ x: yon, y: 0 });
    }
  };

  // Oyunu başlat
  const oyunuBaslat = () => {
    if (!oyuncuAdi) {
      alert('Lütfen bir oyuncu adı girin!');
      return;
    }
    // Reset
    oyunBittiAyarla(false);
    setOyunDuraklatildi(false);
    setSkorGonderildi(false);

    sahneAyarla(sahneOlustur());
    dusmeSuresiAyarla(1000);
    oyuncuSifirla();
    puanAyarla(0);
    satirlarAyarla(0);

    // Müzik
    arkaPlanMuzigi.pause();
    arkaPlanMuzigi.currentTime = 0;
    arkaPlanMuzigi.play().catch((error) =>
      console.log('Müzik oynatma hatası:', error)
    );
  };

  // Skoru sunucuya tek seferlik gönder
  useEffect(() => {
    if (oyunBitti && !skorGonderildi && oyuncuAdi && puan > 0) {
      fetch('http://localhost:5000/skor-ekle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oyuncu_adi: oyuncuAdi,
          skor: puan,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.mesaj);
          setSkorGonderildi(true);
        })
        .catch((error) => console.error('Skor kaydetme/güncelleme hatası:', error));
    }
  }, [oyunBitti, skorGonderildi, oyuncuAdi, puan]);

  // Level ayarı
  useEffect(() => {
    const yeniLevel = Math.min(10, Math.floor(satirlar / 3) + 1);
    setLevel(yeniLevel);
    if (yeniLevel <= 10) {
      dusmeSuresiAyarla(1000 - (yeniLevel - 1) * 50);
    }
  }, [satirlar]);

  // Zamanlayıcı: blokları düşür
  zamanlayiciKullan(() => {
    if (!oyunDuraklatildi) {
      dusur();
    }
  }, dusmeSuresi);

  // Blok düşürme
  const dusur = () => {
    if (!carpismaKontrol(oyuncu, sahne, { x: 0, y: 1 })) {
      oyuncuKonumGuncelle({ x: 0, y: 1, carpti: false });
    } else {
      if (oyuncu.konum.y < 1) {
        oyunBittiAyarla(true);
        dusmeSuresiAyarla(null);
        arkaPlanMuzigi.pause();
        oyunBittiSesi.currentTime = 0;
        oyunBittiSesi.play().catch((error) =>
          console.log('Oyun bitti sesi çalma hatası:', error)
        );
      }
      oyuncuKonumGuncelle({ x: 0, y: 0, carpti: true });
      blokYerlesmeSesi.currentTime = 0;
      blokYerlesmeSesi.play().catch((error) =>
        console.log('Blok yerleşme sesi çalma hatası:', error)
      );
    }
  };

  // Oyunu duraklatma / devam ettirme
  const oyunuDuraklat = () => {
    setOyunDuraklatildi(!oyunDuraklatildi);
    if (!oyunDuraklatildi) {
      arkaPlanMuzigi.pause();
    } else {
      arkaPlanMuzigi.play().catch((error) =>
        console.log('Müzik oynatma hatası:', error)
      );
    }
  };

  // SQL skorlarından en yüksek puanı al
  useEffect(() => {
    if (sqlSkorlar.length > 0) {
      setEnYuksekPuan(sqlSkorlar[0].skor);
    }
  }, [sqlSkorlar]);

  return (
    <div 
      className="tetris-sarmal" 
      role="application"
      aria-label="Tetris oyunu"
      tabIndex="0"
    >
      <video autoPlay muted loop>
        <source src={arkaPlanVideosu} type="video/mp4" />
      </video>
      <div className="tetris-stili">
        <aside>
          <div className="siradaki-kapsayici">
            <Siradaki tetrominolar={siradakiTetrominolar} />
          </div>
        </aside>
        <Sahne sahne={sahne} />
        <aside>
          {oyunBitti ? <Gosterge oyunBitti={oyunBitti} metin="Oyun Bitti" /> : null}
          <Gosterge metin={`En Yuksek Skor: ${enYuksekPuan}`} />
          <Gosterge metin={`Skor: ${puan}`} />
          <Gosterge metin={`Satirlar: ${satirlar}`} />
          <Gosterge metin={`Level: ${level}`} />
  
          <AdBileseni onAdDegisti={handleOyuncuAdiDegisti} />
          <BaslatDugmesi geriCagir={oyunuBaslat} />
          {oyunDuraklatildi ? (
            <DevamDugmesi geriCagir={oyunuDuraklat} />
          ) : (
            <DurdurDugmesi geriCagir={oyunuDuraklat} />
          )}
  
          <SesKontrolleri
            muzikSesSeviyesi={muzikSesSeviyesi}
            setMuzikSesSeviyesi={setMuzikSesSeviyesi}
            sfxSesSeviyesi={sfxSesSeviyesi}
            setSfxSesSeviyesi={setSfxSesSeviyesi}
          />
        </aside>
      </div>
  
      <SkorTablosu skorlar={sqlSkorlar} yazıBoyutu="1rem" bosluk="20px" />
    </div>
  );
};

export default Tetris;
