import { fifthChromaToColor } from "./fifth-chroma-to-color";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";

export const fifthToColor = (note: string, s: number, v: number) => note.length ? fifthChromaToColor(getChroma(note), s, v) : "rgb(64, 64, 64)";
