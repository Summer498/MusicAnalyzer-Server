import { Math } from "../Math";

const mod = Math.mod;
const abs = Math.abs;
const vAdd = Math.vAdd;
const vMul = Math.vMul;
const vFloor = (a: number[]) => a.map((e) => Math.floor(e));

// 0 <= h < 360; 0 <= s <= 1; 0 <= b <= 1
export const hsv2rgb = (h: number, s: number, v: number) => {
  const c = v * s;
  const x = c * (1 - abs(mod(h / 60, 2) - 1));
  const m = v - c;
  const rgb =
    h < 60? [c, x, 0]: h < 120? [x, c, 0]: h < 180? [0, c, x]: h < 240? [0, x, c]: h < 300? [x, 0, c]: [c, 0, x];
  return vFloor(vMul(vAdd(rgb, m), 255));
};

export const rgbToString = (rgb: number[]) => {
  let ret = "#";
  rgb.forEach((e) => {
    ret = `${ret}${e < 16 ? `0` : ``}${e.toString(16)}`;
  });
  return ret;
};
