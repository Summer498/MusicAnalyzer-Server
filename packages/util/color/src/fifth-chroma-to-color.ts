import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { green_hue } from "./green-hue";
import { rgbToString } from "./rgb-to-string";
import { hsv2rgb } from "./hsv2rgb";

// hsv2rgb(A*chroma+B):  F C(green) G D A E(red) B F#/Gb Db Ab(blue) Eb Bb
// hsv2rgb(-A*chroma+B):  F C(green) G D A E(blue) B F#/Gb Db Ab(red) Eb Bb
//   C長調のマイナーコードが青寄りに, 半音上げ転調が赤寄りになる半音下げ転調が青寄りにになる
export const fifthChromaToColor = (chroma: number, s: number, v: number) => rgbToString(hsv2rgb(-mod(chroma * 5, 12) * 360 / 12 + green_hue, s, v));
