import { getChord } from "@music-analyzer/tonal-objects";
import { createTimeAndChord } from "./time-and-chord";
import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  return chords
    .map(e => createTimeAndChord(e.time, getChord(e.chord)))
    .filter(e => e.chord.empty === false);
};
