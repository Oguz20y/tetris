// Tetris tetrominolarının şekil ve renk tanımları
export const TETROMINOLAR = {
    0: { sekil: [[0]], renk: '0, 0, 0' },
    I: { sekil: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]], renk: '80, 227, 230' },
    J: { sekil: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]], renk: '36, 95, 223' },
    L: { sekil: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']], renk: '223, 173, 36' },
    O: { sekil: [['O', 'O'], ['O', 'O']], renk: '223, 217, 36' },
    S: { sekil: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]], renk: '48, 211, 56' },
    T: { sekil: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]], renk: '132, 61, 198' },
    Z: { sekil: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]], renk: '227, 78, 78' },
  };
  
  // Rastgele bir tetromino oluşturur
  export const rastgeleTetromino = () => {
    const tetrominolar = 'IJLOSTZ';
    const rastgeleIndex = Math.floor(Math.random() * tetrominolar.length);
    return TETROMINOLAR[tetrominolar[rastgeleIndex]];
  };
  