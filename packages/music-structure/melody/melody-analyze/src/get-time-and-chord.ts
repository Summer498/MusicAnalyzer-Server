import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze";
import { TimeAndChord } from "./time-and-chord";
import { getChord } from "@music-analyzer/tonal-objects";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  return chords
    .map(e => new TimeAndChord(e.time, getChord(e.chord)))
    .filter(e => e.chord.empty === false);
};
