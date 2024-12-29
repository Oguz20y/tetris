import React from 'react';
import PropTypes from 'prop-types'; // PropTypes kütüphanesini ekliyoruz
import './stiller/SahneStili.css'; // CSS dosyasını içe aktar
import Hucre from './Hucre'; // Hucre bileşenini içe aktarıyoruz

// Sahne bileşeni, oyun alanını ızgara şeklinde oluşturur
const Sahne = ({ sahne }) => {
  const genislik = sahne[0].length;
  const yukseklik = sahne.length;

  return (
    <div
      className="sahne"
      style={{
        '--sahne-genislik': genislik,
        '--sahne-yukseklik': yukseklik,
      }}
    >
      {sahne.map((satir, y) =>
        satir.map((hucre, x) => <Hucre key={`${y}-${x}`} tur={hucre[0]} />)
      )}
    </div>
  );
};

// PropTypes ile 'sahne' prop'unun doğrulamasını yapıyoruz
Sahne.propTypes = {
  sahne: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.array])
    )
  ).isRequired,
};

export default Sahne; // Sahne bileşenini dışa aktarıyoruz
