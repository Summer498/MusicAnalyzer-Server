import { Assertion } from "@music-analyzer/stdlib";
import { mod } from "@music-analyzer/math";
import { _Note } from "@music-analyzer/tonal-objects";
import { map2rgbByHue } from "./src/util";

// 0 <= h < 360; 0 <= s <= 1; 0 <= b <= 1
// h |-> [red, yellow, green, cyan, blue, magenta]
export const hsv2rgb = (h: number, s: number, v: number) => {
  new Assertion(0 <= s && s <= 1).onFailed(() => { throw new RangeError(`Unexpected value received. It should be in 0 <= s <= 1, but max is ${s}`); });
  new Assertion(0 <= v && v <= 1).onFailed(() => { throw new RangeError(`Unexpected value received. It should be in 0 <= v <= 1, but mid is ${v}`); });

  const H = mod(h, 360) / 60;  // 0 to 6
  const max = v * s;
  const mid = v * s * Math.abs(mod(H + 1, 2) - 1);
  const m = v * (1 - s);
  const rgb = map2rgbByHue(H, max, mid);
  return rgb.map(e => Math.floor((e + m) * 256)).map(e => e > 255 ? 255 : e);
};

export const rgbToString = (rgb: number[]) => '#' + rgb.map(e => ('0' + e.toString(16)).slice(-2)).join('');

const green_hue = 120; // 0:red, 120:green, 240:blue
// C(green), Db, D, Eb, E(red), F, Gb, G, Ab(blue), A, Bb, B 
export const noteChromaToColor = (chroma: number, s: number, v: number) => rgbToString(hsv2rgb(chroma * 360 / 12 + green_hue, s, v));
export const noteToColor = (note: string, s: number, v: number) => note.length ? noteChromaToColor(_Note.chroma(note), s, v) : "rgb(64, 64, 64)";

// hsv2rgb(A*chroma+B):  F C(green) G D A E(red) B F#/Gb Db Ab(blue) Eb Bb
// hsv2rgb(-A*chroma+B):  F C(green) G D A E(blue) B F#/Gb Db Ab(red) Eb Bb
//   C長調のマイナーコードが青寄りに, 半音上げ転調が赤寄りになる半音下げ転調が青寄りにになる
export const fifthChromaToColor = (chroma: number, s: number, v: number) => rgbToString(hsv2rgb(-mod(chroma * 5, 12) * 360 / 12 + green_hue, s, v));
export const fifthToColor = (note: string, s: number, v: number) => note.length ? fifthChromaToColor(_Note.chroma(note), s, v) : "rgb(64, 64, 64)";
