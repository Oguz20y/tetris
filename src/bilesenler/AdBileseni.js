import React, { useState } from 'react';
import { AdStili, InputStili } from './stiller/AdStili';

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
    <AdStili>
      <label htmlFor="ad">Ad:</label>
      <InputStili
        id="ad"
        type="text"
        placeholder="AdInIzI giriniz..."
        value={ad}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress} // Enter tuşunu dinler
      />
    </AdStili>
  );
};

export default AdBileseni;