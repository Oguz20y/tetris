import styled from 'styled-components';

// Oyun sahnesinin stilini oluşturur
export const SahneStili = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${ozellikler => ozellikler.yukseklik},
    calc(25vw / ${ozellikler => ozellikler.genislik})
  );
  grid-template-columns: repeat(${ozellikler => ozellikler.genislik}, 1fr);
  grid-gap: 1px; // Hücreler arasındaki boşluk
  border: 2px solid #333; // Dış kenarlık
  width: 100%; // Genişlik
  max-width: 25vw; // Maksimum genişlik
  background: #111; // Arka plan rengi
`;
