import React from 'react';
import PropTypes from 'prop-types'; // PropTypes kütüphanesini ekliyoruz
import './stiller/GostergeStili.css'; // CSS dosyasını içe aktar

// Gösterge bileşeni, oyundaki bilgileri göstermek için kullanılır
const Gosterge = ({ oyunBitti, metin }) => {
  // Dinamik sınıf belirleme
  const className = `gosterge-stili ${oyunBitti ? 'oyun-bitti' : 'normal'}`;

  return <div className={className}>{metin}</div>;
};

// PropTypes doğrulaması
Gosterge.propTypes = {
  oyunBitti: PropTypes.bool.isRequired, // oyunBitti zorunlu ve boolean türünde
  metin: PropTypes.string.isRequired, // metin zorunlu ve string türünde
};

export default Gosterge;
