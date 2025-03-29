import { freq2midi } from "./freq-to-midi";
import { midi2freq } from "./midi-to-freq";

export const roundOnMIDI = (freq: number) => midi2freq(Math.round(freq2midi(freq)));
