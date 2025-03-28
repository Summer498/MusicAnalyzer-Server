import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";
import { getInterval } from "@music-analyzer/tonal-objects/src/interval/get";
import { intervalOf } from "@music-analyzer/tonal-objects/src/interval/distance";
import { rgbToString } from "./rgb-to-string";
import { hsv2rgb } from "./hsv2rgb";
import { green_hue } from "./green-hue";

export const thirdToColor = (note: string, tonic: string, s: number, v: number) => {
  if (note.length === 0) { return "rgb(64, 64, 64)"; }
  const interval = getInterval(intervalOf(tonic, note));
  const circle_of_third_pos = mod(getChroma(tonic) * 5, 12) - interval.step / 4;
  return rgbToString(hsv2rgb(-circle_of_third_pos * 360 / 12 + green_hue, s, v));
};
