import styled from 'styled-components';

// Oyun skorunun, seviyesinin ve satır sayısının gösterildiği alanın stili
export const GostergeStili = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  padding: 20px;
  border: 4px solid #333;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  color: ${ozellikler => (ozellikler.oyunBitti ? 'red' : '#999')}; // Oyun bittiğinde kırmızı renk
  background: #000; // Arka plan rengi siyah
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.8rem; // Yazı boyutu
`;
