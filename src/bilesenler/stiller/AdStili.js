import styled from 'styled-components';

// Kullanıcı adını gireceği input alanı için stil
export const AdStili = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* Input ve etiketi dikey hizala */
  align-items: flex-start;
  margin: 0 0 20px 0;
  padding: 20px;
  border: 4px solid #333;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  color: #999; /* Yazı rengi */
  background: #000; /* Arka plan rengi siyah */
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.8rem; /* Yazı boyutu */
`;

// Input alanının stili
export const InputStili = styled.input`
  margin-top: 10px; /* Label ile input arası boşluk */
  padding: 10px;
  border: 2px solid #333;
  border-radius: 10px;
  background: #111;
  color: #fff;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
  outline: none;
  width: 100%;
`;