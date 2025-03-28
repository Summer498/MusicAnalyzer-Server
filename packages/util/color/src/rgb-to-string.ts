export const rgbToString = (rgb: [number, number, number]) => '#' + rgb.map(e => ('0' + e.toString(16)).slice(-2)).join('');
