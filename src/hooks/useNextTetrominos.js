import { useState, useEffect } from 'react';
import { rastgeleTetromino } from '../tetrominolar';

export const useNextTetrominos = () => {
  const [siradakiTetrominolar, setSiradakiTetrominolar] = useState([]);

  // Listeyi başlat
  useEffect(() => {
    const yeniListe = Array.from({ length: 3 }, rastgeleTetromino);
    setSiradakiTetrominolar(yeniListe);
  }, []);

  // Listeyi güncelle
  const birSonraki = () => {
    setSiradakiTetrominolar((onceki) => {
      const yeniListe = [...onceki.slice(1), rastgeleTetromino()];
      return yeniListe;
    });
  };

  return [siradakiTetrominolar, birSonraki];
};
