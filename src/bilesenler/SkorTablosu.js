import React from 'react';
import PropTypes from 'prop-types'; // PropTypes kütüphanesini ekliyoruz
import './stiller/SkorTablosuStili.css'; // CSS dosyasını içe aktar

const SkorTablosu = ({ skorlar, yazıBoyutu = '0.8rem', bosluk = '10px' }) => {
  return (
    <div className="skor-tablosu" style={{ fontSize: yazıBoyutu, padding: bosluk }}>
      <h3>Skor Tablosu</h3>
      <ul>
        {skorlar.length > 0 ? (
          skorlar.map((skor) => (
            <li key={`${skor.oyuncu_adi}-${skor.skor}`}>
              {skorlar.indexOf(skor) + 1}. {skor.oyuncu_adi}: {skor.skor}
            </li>
          ))
        ) : (
          <li>Henuz skor yok</li>
        )}
      </ul>
    </div>
  );
};

// PropTypes doğrulaması
SkorTablosu.propTypes = {
  skorlar: PropTypes.arrayOf(
    PropTypes.shape({
      oyuncu_adi: PropTypes.string.isRequired,
      skor: PropTypes.number.isRequired,
    })
  ).isRequired,
  yazıBoyutu: PropTypes.string,
  bosluk: PropTypes.string,
};

export default SkorTablosu;
