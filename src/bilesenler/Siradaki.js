import React from 'react';
import { TETROMINOLAR } from '../tetrominolar';
import Gosterge from './Gosterge'; // Gosterge bileşeni içe aktarılıyor
import './stiller/siradaki.css';

const Siradaki = ({ tetrominolar }) => {
  return (
    <div className="siradaki-kapsayici">
      {/* Başlık yerine Gosterge bileşeni eklendi */}
      <Gosterge metin="Siradaki" />

      {tetrominolar.map((tetromino, index) => (
        <div key={index} className="siradaki-tetromino">
          {tetromino.sekil.map((satir, y) => (
            <div key={y} className="tetromino-satir">
              {satir.map((hucre, x) => (
                <div
                  key={x}
                  className={`siradaki-hucre ${hucre === 0 ? 'tur-0' : ''}`}
                  style={{
                    '--hucre-renk': TETROMINOLAR[hucre]?.renk || '0, 0, 0',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Siradaki;
