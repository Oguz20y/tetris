import { useEffect, useRef } from 'react';

// Bu özel hook, belirli aralıklarla bir işlem gerçekleştirmek için kullanılır
export function useInterval(geriCagir, gecikme) {
  const kaydedilenGeriCagir = useRef(); // Geri çağırma fonksiyonunu kaydeder

  // Geri çağırma fonksiyonunu güncelle
  useEffect(() => {
    kaydedilenGeriCagir.current = geriCagir;
  }, [geriCagir]);

  // Zamanlayıcıyı başlat
  useEffect(() => {
    function islem() {
      kaydedilenGeriCagir.current();
    }
    if (gecikme !== null) {
      const id = setInterval(islem, gecikme);
      return () => clearInterval(id); // Zamanlayıcıyı temizle
    }
  }, [gecikme]);
}
