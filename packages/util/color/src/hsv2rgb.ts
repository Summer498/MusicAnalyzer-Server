import { createAssertion } from "@music-analyzer/stdlib";
import { mod } from "@music-analyzer/math";
import { map2rgbByHue } from "./util";

// 0 <= h < 360; 0 <= s <= 1; 0 <= b <= 1
// h |-> [red, yellow, green, cyan, blue, magenta]
export const hsv2rgb = (h: number, s: number, v: number) => {
  createAssertion(0 <= s && s <= 1).onFailed(() => { throw new RangeError(`Unexpected value received. It should be in 0 <= s <= 1, but max is ${s}`); });
  createAssertion(0 <= v && v <= 1).onFailed(() => { throw new RangeError(`Unexpected value received. It should be in 0 <= v <= 1, but mid is ${v}`); });

  const H = mod(h, 360) / 60;  // 0 to 6
  const max = v * s;
  const mid = v * s * Math.abs(mod(H + 1, 2) - 1);
  const m = v * (1 - s);
  const rgb = map2rgbByHue(H, max, mid);
  const f = (e: number) => Math.floor((e + m) * 256);
  const g = (e: number) => e > 255 ? 255 : e;
  return [g(f(rgb[0])), g(f(rgb[1])), g(f(rgb[2]))] as [number,number,number]
};
