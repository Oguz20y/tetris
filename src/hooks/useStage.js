import { useState, useEffect } from 'react';
import { sahneyiOlustur } from '../oyunYardimcilar';

// Oyun sahnesini kontrol etmek için özel hook
export const useStage = (oyuncu, oyuncuSifirla) => {
  // Sahne ve temizlenen satır sayısı için state oluşturuluyor
  const [sahne, sahneAyarla] = useState(sahneyiOlustur()); // Oyun sahnesini başlatır
  const [temizlenenSatirlar, temizlenenSatirlarAyarla] = useState(0); // Temizlenen satır sayısını izlemek için state

  useEffect(() => {
    temizlenenSatirlarAyarla(0); // Her güncellemede temizlenen satır sayısını sıfırla

    // Dolu satırları tespit edip sahneden kaldırır ve yeni boş satırlar ekler
    const satirlariTemizle = yeniSahne => {
      const temizlenenSatirSayisi = yeniSahne.reduce((toplam, satir) => {
        if (satir.every(hucre => hucre[0] !== 0)) { // Satırdaki her hücre boş değilse
          toplam += 1; // Tam dolu satır bulunduğunda sayaç artırılır
        }
        return toplam;
      }, 0);

      // Dolu satırları sil ve yukarıdan boş satır ekle
      const yeniSahneGuncel = yeniSahne.filter(
        satir => !satir.every(hucre => hucre[0] !== 0)
      );

      // Boş satırları yukarı ekle
      for (let i = 0; i < temizlenenSatirSayisi; i++) {
        yeniSahneGuncel.unshift(
          new Array(yeniSahne[0].length).fill([0, 'temizle']) // Boş bir satır ekle
        );
      }

      temizlenenSatirlarAyarla(temizlenenSatirSayisi); /// Temizlenen satır sayısını güncelle

      return yeniSahneGuncel; // Güncellenmiş sahneyi döndür
    };

    // Oyun sahnesini güncellemek için fonksiyon
    const sahneyiGuncelle = oncekiSahne => {
      // Önceki sahnedeki "temizle" etiketli hücreleri sıfırla
      const yeniSahne = oncekiSahne.map(satir =>
        satir.map(hucre => (hucre[1] === 'temizle' ? [0, 'temizle'] : hucre))
      );

      // Oyuncunun mevcut tetrominosunu sahneye ekle
      oyuncu.tetromino.forEach((satir, y) => {
        satir.forEach((deger, x) => {
          if (deger !== 0) { // Tetromino hücresinin boş olmaması
            yeniSahne[y + oyuncu.konum.y][x + oyuncu.konum.x] = [
              deger, // Hücrenin değeri (tetromino parçası)
              `${oyuncu.carpti ? 'birlesti' : 'temizle'}`, // Çarpma durumu kontrol edilir
            ];
          }
        });
      });

      if (oyuncu.carpti) { // Oyuncunun tetrominosu bir yere çarptığında
        oyuncuSifirla(); // Oyuncunun pozisyonu ve tetrominosu sıfırlanır
        return satirlariTemizle(yeniSahne); // Satırları temizle ve yeni sahneyi döndür
      }

      return yeniSahne; // Güncellenmiş sahneyi döndür
    };

    // Sahneyi güncelleme işlemini başlat
    sahneAyarla(onceki => sahneyiGuncelle(onceki));
  }, [oyuncu.carpti, oyuncu.konum, oyuncu.tetromino, oyuncuSifirla]); // Oyuncunun konum, çarpma durumu ve tetrominosu değiştiğinde yeniden çalışır

  return [sahne, sahneAyarla, temizlenenSatirlar]; // Sahne, sahneyi ayarlama fonksiyonu ve temizlenen satır sayısını döndür
};