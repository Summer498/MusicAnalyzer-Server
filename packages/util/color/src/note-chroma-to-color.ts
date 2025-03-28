import { hsv2rgb, rgbToString } from "../dist";
import { green_hue } from "./green-hue";

// C(green), Db, D, Eb, E(red), F, Gb, G, Ab(blue), A, Bb, B 
export const noteChromaToColor = (chroma: number, s: number, v: number) => rgbToString(hsv2rgb(chroma * 360 / 12 + green_hue, s, v));
