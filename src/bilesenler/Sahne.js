import React from 'react';
// Sahne bileşeninin stilini içe aktarıyoruz
import { SahneStili } from './stiller/SahneStili';
// Hucre bileşenini içe aktarıyoruz
import Hucre from './Hucre';

// Sahne bileşeni, oyun alanını ızgara şeklinde oluşturur
const Sahne = ({ sahne }) => (
  <SahneStili genislik={sahne[0].length} yukseklik={sahne.length}>
    {sahne.map((satir, y) => 
      satir.map((hucre, x) => <Hucre key={x} tur={hucre[0]} />)
    )}
  </SahneStili>
);

export default Sahne; // Sahne bileşenini dışa aktarıyoruz
