import { TimeAndChordSymbol } from "./facade";
import { getChord } from "./facade";
import { TimeAndChord } from "./time-and-chord";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  return chords
    .map(e => new TimeAndChord(e.time, getChord(e.chord)))
    .filter(e => e.chord.empty === false);
};
