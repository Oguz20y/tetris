import styled from 'styled-components';

// Oyundaki her bir hücre için stil tanımlaması yapılıyor
export const HucreStili = styled.div`
  width: auto;
  background: rgba(${ozellikler => ozellikler.renk}, 0.8); // Hücre rengi
  border: ${ozellikler => (ozellikler.tur === 0 ? '0px solid' : '4px solid')};
  border-bottom-color: rgba(${ozellikler => ozellikler.renk}, 0.1);
  border-right-color: rgba(${ozellikler => ozellikler.renk}, 1);
  border-top-color: rgba(${ozellikler => ozellikler.renk}, 1);
  border-left-color: rgba(${ozellikler => ozellikler.renk}, 0.3);
`;
