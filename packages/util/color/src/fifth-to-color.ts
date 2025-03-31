import { fifthChromaToColor } from "./fifth-chroma-to-color";
import { getChroma } from "./facade";

export const fifthToColor = (note: string, s: number, v: number) => note.length ? fifthChromaToColor(getChroma(note), s, v) : "rgb(64, 64, 64)";
