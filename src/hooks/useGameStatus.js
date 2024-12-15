import { useState, useEffect, useCallback } from 'react';

// Bu özel hook, oyun sırasında puanı ve temizlenen satır sayısını takip eder
export const useGameStatus = temizlenenSatirlar => {
  // puan ve satırlar, kullanıcının anılık puanını ve temizlediği satır sayısını tutar
  const [puan, puanAyarla] = useState(0); // Oyun başladığında puan 0 olarak başlar
  const [satirlar, satirlarAyarla] = useState(0); // Oyun başladığında temizlenen satır sayısı 0 olarak başlar

  // Temizlenen satır sayısına göre kazanılan puanların belirli bir diziye atanması
  const satirPuanlari = [40, 100, 300, 1200]; // 1, 2, 3 ve 4 satırın aynı anda temizlenmesi durumunda kazanılan puanlar

  // puanHesapla, kullanıcının temizlediği satır sayısına göre puanı hesaplar ve ekler
  const puanHesapla = useCallback(() => {
    if (temizlenenSatirlar > 0) { // Temizlenen satır var mı kontrolü
      satirlarAyarla(onceki => onceki + temizlenenSatirlar); // Toplam temizlenen satır sayısının güncellenmesi
      const eklenenPuan = 
        satirPuanlari[Math.min(temizlenenSatirlar - 1, satirPuanlari.length - 1)]; // Temizlenen satır sayısına göre puanı hesapla
      puanAyarla(onceki => onceki + eklenenPuan); // Hesaplanan puanı toplam puana ekle
    }
  }, [satirPuanlari, temizlenenSatirlar]); // Bu fonksiyon, satirPuanlari ve temizlenenSatirlar değiştirildiğinde yeniden oluşturulur

  // temizlenenSatirlar değiştirildiğinde puan hesapla fonksiyonunun çağrılması
  useEffect(() => {
    puanHesapla(); // Temizlenen satırların değişmesini takiben puanı hesapla
  }, [puanHesapla, temizlenenSatirlar]); // useEffect, temizlenenSatirlar veya puanHesapla değiştirildiğinde çalışır

  // çağrıldığında güncel puan, puanAyarla fonksiyonu, satır sayısı ve satirlarAyarla fonksiyonu döndürülür
  return [puan, puanAyarla, satirlar, satirlarAyarla];
};
