import React from 'react';
// Stil bileşeni styled-components ile oluşturuluyor
import styled from 'styled-components';

// Butonun stilleri
const BaslatDugmesiStili = styled.button`
  box-sizing: border-box;
  margin: 0 0 20px 0;
  padding: 20px;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  border: none;
  color: white;
  background: #333;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
`;

// BaslatDugmesi bileşeni, oyunu başlatmak için bir buton sağlar
const BaslatDugmesi = ({ geriCagir }) => (
  <BaslatDugmesiStili onClick={geriCagir}>Oyunu Başlat</BaslatDugmesiStili>
);

export default BaslatDugmesi; // BaslatDugmesi bileşenini dışa aktarıyoruz
