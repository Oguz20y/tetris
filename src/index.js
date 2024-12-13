// React kütüphanesini içe aktarıyoruz
import React from 'react';

// React 18 ile birlikte 'react-dom' yerine 'react-dom/client' kullanılıyor
import ReactDOM from 'react-dom/client';

// CSS dosyasını içe aktarıyoruz
import './index.css';

// Ana uygulama bileşenini içe aktarıyoruz
import App from './App';

// HTML dosyasındaki "root" id'sine sahip öğeyi seçiyoruz
const kokEleman = document.getElementById('root');

// React 18 ile birlikte createRoot kullanarak kök (root) öğeyi oluşturuyoruz
const kok = ReactDOM.createRoot(kokEleman);

// React bileşenini ekranda göstermek için render işlemi yapıyoruz
kok.render(
  <React.StrictMode>
    <App /> {/* Ana uygulama bileşenini çağırıyoruz */}
  </React.StrictMode>
);
