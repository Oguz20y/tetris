import React from 'react';
import { SkorTablosuStili } from './stiller/SkorTablosuStili';

const SkorTablosu = ({ skorlar, yazıBoyutu = '0.8rem', bosluk = '10px' }) => {
  return (
    <SkorTablosuStili style={{ fontSize: yazıBoyutu, padding: bosluk }}>
      <h3>Skor Tablosu</h3>
      <ul>
        {skorlar.length > 0 ? (
          skorlar.map((skor, index) => (
            <li key={index} style={{ marginBottom: bosluk }}>
              {index + 1}. {skor.ad}: {skor.puan} Puan
            </li>
          ))
        ) : (
          <li>Henuz skor yok</li>
        )}
      </ul>
    </SkorTablosuStili>
  );
};

export default SkorTablosu;