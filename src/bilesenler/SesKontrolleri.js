import React from 'react';
import Gosterge from './Gosterge';

const SesKontrolleri = ({ muzikSesSeviyesi, setMuzikSesSeviyesi, sfxSesSeviyesi, setSfxSesSeviyesi }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: '#000',
      padding: '10px',
      borderRadius: '8px',
      zIndex: 1000, // Üstte görünmesi için
    }}>
      <div style={{ marginBottom: '10px' }}>
        <Gosterge metin="Muzik Sesi" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muzikSesSeviyesi}
          onChange={(e) => setMuzikSesSeviyesi(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <Gosterge metin="SFX Sesi" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sfxSesSeviyesi}
          onChange={(e) => setSfxSesSeviyesi(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default SesKontrolleri;