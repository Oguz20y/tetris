import React from 'react';
import PropTypes from 'prop-types'; // PropTypes kütüphanesini ekliyoruz
import { useNavigate } from 'react-router-dom'; // React Router kullanımı için
import styled from 'styled-components';

import arkaPlanGorseli from '../resim/bg.png';

const AnaSayfa = ({ butonGenislik = '200px', butonYukseklik = '50px' }) => {
  const navigate = useNavigate();

  // Başlat butonuna uygun buton stili
  const ButonStil = styled.button`
    width: ${butonGenislik}; /* Dinamik genişlik */
    height: ${butonYukseklik}; /* Dinamik yükseklik */
    margin: 10px; /* Dış boşluk */
    background-color: #333; /* Arka plan rengi */
    color: #fff; /* Yazı rengi */
    border: none; /* Kenarlık kaldırıldı */
    border-radius: 20px; /* Kenarları yuvarla */
    display: flex; /* Flexbox ile içerik hizalaması */
    justify-content: center; /* Yazıyı yatayda ortala */
    align-items: center; /* Yazıyı dikeyde ortala */
    font-size: calc(${butonYukseklik} / 2.5); /* Yüksekliğe göre yazı boyutunu ayarla */
    font-weight: bold; /* Yazıyı kalın yap */
    cursor: pointer; /* Fareyi butonun üzerine getirince imleç değişimi */
    text-align: center; /* Metni ortala */
    text-decoration: none; /* Alt çizgi kaldırıldı */
    transition: transform 0.2s ease; /* Hover için geçiş efekti */

    &:hover {
      transform: scale(1.1); /* Butonu büyüt */
    }
  `;

  const EkranStil = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
    background-image: url(${arkaPlanGorseli});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `;

  const BaslikStil = styled.h1`
    font-size: 5rem; /* Başlık boyutu */
    color: #fff; /* Yazı rengi */
    text-align: center; /* Ortalanmış metin */
    margin-bottom: 60px; /* Başlık ile butonlar arasındaki boşluk */
    padding: 20px; /* İç boşluk */
    background-color: rgba(0, 0, 0, 0.7); /* Yarı saydam siyah arka plan */
    border-radius: 40px; /* Köşeler yuvarlatıldı */
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7); /* Gölgeli yazı efekti */
    width: fit-content; /* Başlığın genişliği, içeriğine göre ayarlanır */
    margin-top: -60px; /* Başlığı biraz yukarı taşır */
  `;

  return (
    <EkranStil>
      <BaslikStil>TETRIS</BaslikStil>
      <ButonStil onClick={() => navigate('/Tetris')}>BASLA</ButonStil>
    </EkranStil>
  );
};

// PropTypes doğrulaması
AnaSayfa.propTypes = {
  butonGenislik: PropTypes.string, // butonGenislik opsiyonel ve string türünde
  butonYukseklik: PropTypes.string, // butonYukseklik opsiyonel ve string türünde
};

export default AnaSayfa;
