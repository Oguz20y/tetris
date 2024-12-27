import styled from 'styled-components';


export const SkorTablosuStili = styled.div`
  background: #000;
  color: #999;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
  width: 15vw;
  min-height: 50vh;
  position: relative; /* Eski renderları gizler */
  z-index: 10; /* Üstteki renderın altındakini gizlemesini sağlar */
  left: -20px; /* Sola kaydırma */
`;