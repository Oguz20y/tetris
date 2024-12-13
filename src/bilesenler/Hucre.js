import React from 'react';
// Hucre bileşeninin stilini içe aktarıyoruz
import { HucreStili } from './stiller/HucreStili';
// Tetromino türlerini içe aktarıyoruz
import { TETROMINOLAR } from '../tetrominolar';

// React.memo, sadece değişen hücreleri tekrar oluşturur
const Hucre = ({ tur }) => (
  <HucreStili tur={tur} renk={TETROMINOLAR[tur].renk}>
    {console.log('Hucre yeniden oluşturuldu')}
  </HucreStili>
);

export default React.memo(Hucre); // React.memo ile gereksiz render işlemlerini engelliyoruz
