import { mod } from "../Math";

// 0 <= h < 360; 0 <= s <= 1; 0 <= b <= 1
// h |-> [red, yellow, green, cyan, blue, magenta]
export const hsv2rgb = (h: number, s: number, v: number) => {
  const H = mod(h, 360) / 60;
  const x = s * Math.abs(mod(H + 1, 2) - 1);
  const rgb = [[s, x, 0], [x, s, 0], [0, s, x], [0, x, s], [x, 0, s], [s, 0, x]][Math.floor(H)];
  return rgb.map(e => Math.floor((e + 1 - s) * v * 255));
};

export const rgbToString = (rgb: number[]) => '#' + rgb.map(e => ('0' + e.toString(16)).slice(-2)).join('');
