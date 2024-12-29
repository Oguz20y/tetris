import React from 'react';
import PropTypes from 'prop-types'; // PropTypes kütüphanesini ekliyoruz
import './stiller/HucreStili.css'; // CSS dosyasını içe aktar
import { TETROMINOLAR } from '../tetrominolar'; // Tetromino türlerini içe aktarıyoruz

// React.memo, sadece değişen hücreleri tekrar oluşturur
const Hucre = ({ tur }) => {
  const renk = TETROMINOLAR[tur].renk; // Tetromino rengini al
  const className = `hucre ${tur === 0 ? 'tur-0' : ''}`; // Dinamik sınıf belirleme

  return (
    <div
      className={className}
      style={{ '--hucre-renk': renk }}
    >
      {console.log('Hucre yeniden oluşturuldu')}
    </div>
  );
};

// PropTypes doğrulaması
Hucre.propTypes = {
  tur: PropTypes.number.isRequired, // tur bir sayı ve zorunlu
};

export default React.memo(Hucre); // React.memo ile gereksiz render işlemlerini engelliyoruz
