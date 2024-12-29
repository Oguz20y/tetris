import { useState, useEffect, useCallback } from 'react';

// Bu özel hook, oyun sırasında puanı ve temizlenen satır sayısını takip eder
export const useGameStatus = (temizlenenSatirlar) => {
  // useState ile dönenleri "değer + setter" formatında destructure ediyoruz
  const [puan, setPuan] = useState(0);     // Oyun başladığında puan 0
  const [satirlar, setSatirlar] = useState(0); // Oyun başladığında temizlenen satır sayısı 0

  // Temizlenen satır sayısına göre kazanılan puanlar
  const satirPuanlari = [40, 100, 300, 1200];

  // Temizlenen satır sayısına göre puanı hesaplar ve ekler
  const puanHesapla = useCallback(() => {
    if (temizlenenSatirlar > 0) {
      // Toplam temizlenen satır sayısını günceller
      setSatirlar((onceki) => onceki + temizlenenSatirlar);

      // Temizlenen satır sayısına göre eklenen puanı hesapla
      const eklenenPuan =
        satirPuanlari[Math.min(temizlenenSatirlar - 1, satirPuanlari.length - 1)];

      // Hesaplanan puanı toplam puana ekle
      setPuan((onceki) => onceki + eklenenPuan);
    }
  }, [satirPuanlari, temizlenenSatirlar]);

  // temizlenenSatirlar her değiştiğinde, puanı tekrar hesapla
  useEffect(() => {
    puanHesapla();
  }, [puanHesapla, temizlenenSatirlar]);

  // Güncel puan, setter fonksiyonu, toplam satırlar ve onun setter'ını döndürür
  return [puan, setPuan, satirlar, setSatirlar];
};
