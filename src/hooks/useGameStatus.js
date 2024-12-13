import { useState, useEffect, useCallback } from 'react';

// Bu özel hook, puanı ve temizlenen satır sayısını takip eder
export const useGameStatus = temizlenenSatirlar => {
  const [puan, puanAyarla] = useState(0);
  const [satirlar, satirlarAyarla] = useState(0);

  const satirPuanlari = [40, 100, 300, 1200]; // 1, 2, 3, 4 satır temizleme puanları

  // Puan hesaplamak için kullanılan fonksiyon
  const puanHesapla = useCallback(() => {
    if (temizlenenSatirlar > 0) {
      // Her satır temizlendiğinde yalnızca 1 artır
      satirlarAyarla(onceki => onceki + 1); 
      puanAyarla(onceki => onceki + satirPuanlari[0]); // Sadece ilk puanı veriyoruz
    }
  }, [satirPuanlari, temizlenenSatirlar]);

  useEffect(() => {
    puanHesapla();
  }, [puanHesapla, temizlenenSatirlar]);

  return [puan, puanAyarla, satirlar, satirlarAyarla];
};
