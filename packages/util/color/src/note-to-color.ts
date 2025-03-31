import { getChroma } from "./facade";
import { noteChromaToColor } from "./note-chroma-to-color";

export const noteToColor = (note: string, s: number, v: number) => note.length ? noteChromaToColor(getChroma(note), s, v) : "rgb(64, 64, 64)";

