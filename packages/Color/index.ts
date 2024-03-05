import { mod } from "../Math";
import { _Note } from "../TonalObjects";

// 0 <= h < 360; 0 <= s <= 1; 0 <= b <= 1
// h |-> [red, yellow, green, cyan, blue, magenta]
export const hsv2rgb = (h: number, s: number, v: number) => {
  const H = mod(h, 360) / 60;
  const x = s * Math.abs(mod(H + 1, 2) - 1);
  const rgb = [[s, x, 0], [x, s, 0], [0, s, x], [0, x, s], [x, 0, s], [s, 0, x]][Math.floor(H)];
  return rgb.map(e => Math.floor((e + 1 - s) * v * 255));
};

export const rgbToString = (rgb: number[]) => '#' + rgb.map(e => ('0' + e.toString(16)).slice(-2)).join('');

const green_hue = 120; // 0:red, 120:green, 240:blue
// C(green), Db, D, Eb, E(red), F, Gb, G, Ab(blue), A, Bb, B 
export const noteChromaToColor = (chroma: number, s: number, v: number) => rgbToString(hsv2rgb(chroma * 360 / 12 + green_hue, s, v));
export const noteToColor = (note: string, s: number, v: number) => note.length ? noteChromaToColor(_Note.chroma(note), s, v) : "#444";

// hsv2rgb(A*chroma+B): F C(green) G D A E(red) B F#/Gb Db Ab(blue) Eb Bb
// hsv2rgb(-A*chroma+B): F C(green) G D A E(blue) B F#/Gb Db Ab(red) Eb Bb
//   C長調のマイナーコードが青寄りに, 半音上げ転調が赤寄りになる半音下げ転調が青寄りにになる
export const fifthChromaToColor = (chroma: number, s: number, v: number) => rgbToString(hsv2rgb(-mod(chroma * 5, 12) * 360 / 12 + green_hue, s, v));
export const fifthToColor = (note: string, s: number, v: number) => note.length ? fifthChromaToColor(_Note.chroma(note), s, v) : "#444";
