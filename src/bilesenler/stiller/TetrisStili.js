import styled from 'styled-components';
import arkaPlanGorseli from '../../resim/bg.png';

// Tüm ekranı kapsayan oyun konteyneri
export const TetrisSarmal = styled.div`
  width: 100vw; /* Tüm genişliği kapla */
  min-height: 100vh; /* Tüm yüksekliği kapla */
  background: url(${arkaPlanGorseli}) #000; /* Arka plan resmi ve yedek siyah renk */
  background-size: cover; /* Arka planın tüm ekranı kaplamasını sağlar */
  overflow: hidden; /* Taşan içerikleri gizler */
  display: flex; /* Flexbox yapısını etkinleştiriyoruz */
  justify-content: center; /* X düzleminde ortalar */
  align-items: center; /* Y düzleminde ortalar */
`;

// Oyun alanı ve yandaki puan bölgesi için stil ayarları
export const TetrisStili = styled.div`
  display: flex; /* Sahne ve puan alanını yan yana dizer */
  align-items: flex-start; /* İçerikleri yukarıdan hizalar */
  padding: 0px; /* Dış boşluk ekler */
  max-width: 900px; /* Maksimum genişlik ayarlandı */
  width: 100%; /* Ekranın %100'ünü kaplar */
  margin: 0 auto; /* X düzleminde ortalar */
  margin-right: 60px; /* Oyun ekranını sağa kaydırır (Bu değeri artırıp azaltabilirsiniz) */
  

  aside {
    width: 100%; /* Yan alanın genişliği */
    max-width: 200px; /* Maksimum genişliği */
    display: block; /* Blok seviye eleman */
    padding: 0 20px; /* İçeriklerin sağ ve sol boşlukları */
  }
`;
