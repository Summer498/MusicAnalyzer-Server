import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-chord";
import { TimeAndChord } from "./time-and-chord";
import { getChord } from "@music-analyzer/tonal-objects/src/chord/get";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  return chords
    .map(e => new TimeAndChord(e.time, getChord(e.chord)))
    .filter(e => e.chord.empty === false);
};
