import { useState, useEffect } from 'react';
import { sahneyiOlustur } from '../oyunYardimcilar';

export const useStage = (oyuncu, oyuncuSifirla) => {
  // 1) State'leri daha yaygın konvansiyona göre adlandırdık.
  const [sahne, setSahne] = useState(sahneyiOlustur());
  const [temizlenenSatirlar, setTemizlenenSatirlar] = useState(0);

  /**
   * @description
   * Dolu satırları tespit edip temizleyip, temizlenen satır sayısını günceller.
   */
  const satirlariTemizle = (yeniSahne) => {
    // Kaç satırın tamamen dolu olduğunu bul
    const temizlenenSatirSayisi = yeniSahne.reduce((toplam, satir) => {
      if (satir.every((hucre) => hucre[0] !== 0)) {
        return toplam + 1; // Dolu satır buldukça artır
      }
      return toplam;
    }, 0);

    // Dolu satırları sahneden çıkar
    let yeniSahneGuncel = yeniSahne.filter(
      (satir) => !satir.every((hucre) => hucre[0] !== 0)
    );

    // Yukarıdan boş satır ekle
    for (let i = 0; i < temizlenenSatirSayisi; i++) {
      yeniSahneGuncel.unshift(
        new Array(yeniSahne[0].length).fill([0, 'temizle'])
      );
    }

    // Kaç satır temizlendiğini state'e yaz
    setTemizlenenSatirlar(temizlenenSatirSayisi);

    // Güncellenmiş sahneyi döndür
    return yeniSahneGuncel;
  };

  /**
   * @description
   * Oyuncunun tetrominosunu sahneye ekler ve eğer tetromino bir yere çarptıysa
   * satır temizlik işlemini de yapar.
   */
  const sahneyiGuncelle = (oncekiSahne) => {
    // 1) Önceki sahnedeki "temizle" etiketli hücreleri sıfırla
    const yeniSahne = oncekiSahne.map((satir) =>
      satir.map((hucre) => (hucre[1] === 'temizle' ? [0, 'temizle'] : hucre))
    );

    // 2) Oyuncunun mevcut tetrominosunu ekle
    oyuncu.tetromino.forEach((satir, y) => {
      satir.forEach((deger, x) => {
        if (deger !== 0) {
          // Hücre boş değilse tetromino parçasını yerleştir
          yeniSahne[y + oyuncu.konum.y][x + oyuncu.konum.x] = [
            deger,
            oyuncu.carpti ? 'birlesti' : 'temizle',
          ];
        }
      });
    });

    // 3) Tetromino çarptıysa oyuncuyu sıfırla ve satırları temizle
    if (oyuncu.carpti) {
      oyuncuSifirla();
      return satirlariTemizle(yeniSahne);
    }

    return yeniSahne; // Çarpma yoksa sadece yeni sahneyi döndür
  };

  // useEffect içinde mümkün olduğunca az kod tutarak, fonksiyonları dışarı taşıdık.
  useEffect(() => {
    // Her render'da yeniden tetikleneceği için, önce temizlenen satır sayısını 0'la
    setTemizlenenSatirlar(0);

    // Ardından sahneyi güncelle
    setSahne((oncekiSahne) => sahneyiGuncelle(oncekiSahne));
    // Dependencies: oyuncunun konumu, tetrominosu veya çarpma durumu değiştiğinde
  }, [oyuncu.carpti, oyuncu.konum, oyuncu.tetromino, oyuncuSifirla]);

  // Dışarıya sahne, sahneyi ayarlama fonksiyonu ve temizlenen satır sayısı döndürülür
  return [sahne, setSahne, temizlenenSatirlar];
};
