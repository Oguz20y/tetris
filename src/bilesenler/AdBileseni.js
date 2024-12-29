import React, { useState } from 'react';
import PropTypes from 'prop-types'; // PropTypes kütüphanesini ekliyoruz
import './stiller/AdStili.css'; // CSS dosyasını içe aktar

const AdBileseni = ({ onAdDegisti }) => {
  const [ad, setAd] = useState('');

  const handleInputChange = (event) => {
    setAd(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Enter tuşuna basıldığında adı üst bileşene gönder
      if (ad.trim()) {
        onAdDegisti(ad.trim());
        setAd(''); // Input alanını temizle
      } else {
        alert('Lütfen bir oyuncu adı girin!');
      }
    }
  };

  return (
    <div className="ad-stili">
      <label htmlFor="ad">Ad:</label>
      <input
        className="input-stili"
        id="ad"
        type="text"
        placeholder="Adinizi giriniz..."
        value={ad}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress} // Enter tuşunu dinler
      />
    </div>
  );
};

// PropTypes doğrulaması
AdBileseni.propTypes = {
  onAdDegisti: PropTypes.func.isRequired, // onAdDegisti bir fonksiyon ve zorunlu
};

export default AdBileseni;
