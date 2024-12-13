import React from 'react';
import { GostergeStili } from './stiller/GostergeStili';

// Gösterge bileşeni, oyundaki bilgileri göstermek için kullanılır
const Gosterge = ({ oyunBitti, metin }) => (
  <GostergeStili oyunBitti={oyunBitti}>{metin}</GostergeStili>
);

export default Gosterge;
