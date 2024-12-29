import React from 'react';
import PropTypes from 'prop-types'; // PropTypes kütüphanesini ekliyoruz
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
  <BaslatDugmesiStili onClick={geriCagir}>Oyunu Baslat</BaslatDugmesiStili>
);

// PropTypes doğrulaması
BaslatDugmesi.propTypes = {
  geriCagir: PropTypes.func.isRequired, // geriCagir bir fonksiyon ve zorunlu
};

export default BaslatDugmesi; // BaslatDugmesi bileşenini dışa aktarıyoruz
export { BaslatDugmesiStili }; // BaslatDugmesi yazı stilini dışa aktarıyoruz
