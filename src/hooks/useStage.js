import { useState, useEffect } from 'react';
import { sahneyiOlustur } from '../oyunYardimcilar';

// Oyun sahnesini kontrol etmek için özel hook
export const useStage = (oyuncu, oyuncuSifirla) => {
  const [sahne, sahneAyarla] = useState(sahneyiOlustur());
  const [temizlenenSatirlar, temizlenenSatirlarAyarla] = useState(0);

  useEffect(() => {
    temizlenenSatirlarAyarla(0); // Temizlenen satır sayısını sıfırlıyoruz

    // Satırları temizle fonksiyonu
    const satirlariTemizle = yeniSahne =>
      yeniSahne.reduce((toplam, satir) => {
        // Eğer satırdaki tüm hücreler doluysa o satırı temizliyoruz
        if (satir.every(hucre => hucre[0] !== 0)) {
          toplam.unshift(new Array(yeniSahne[0].length).fill([0, 'temizle'])); // Boş bir satır ekliyoruz
          temizlenenSatirlarAyarla(onceki => onceki + 1); // Sadece 1 artır
        } else {
          toplam.push(satir); // Dolmamış olan satırları koruyoruz
        }
        return toplam;
      }, []);

    // Sahneyi güncelle ve tetrominoyu ekle
    const sahneyiGuncelle = oncekiSahne => {
      // Mevcut sahneyi kopyalayıp tüm "temizle" etiketlerini sıfırlıyoruz
      const yeniSahne = oncekiSahne.map(satir => 
        satir.map(hucre => (hucre[1] === 'temizle' ? [0, 'temizle'] : hucre))
      );

      // Oyuncunun tetrominosunu sahneye ekle
      oyuncu.tetromino.forEach((satir, y) => {
        satir.forEach((deger, x) => {
          if (deger !== 0) {
            yeniSahne[y + oyuncu.konum.y][x + oyuncu.konum.x] = [
              deger,
              `${oyuncu.carpti ? 'birlesti' : 'temizle'}`,
            ];
          }
        });
      });

      // Oyuncu çarptığında, satırları temizle
      if (oyuncu.carpti) {
        oyuncuSifirla();
        return satirlariTemizle(yeniSahne);
      }

      return yeniSahne;
    };

    sahneAyarla(onceki => sahneyiGuncelle(onceki));
  }, [oyuncu.carpti, oyuncu.konum, oyuncu.tetromino, oyuncuSifirla]);

  return [sahne, sahneAyarla, temizlenenSatirlar];
};
