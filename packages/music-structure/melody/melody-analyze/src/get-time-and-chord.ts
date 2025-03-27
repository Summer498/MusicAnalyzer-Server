import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze";
import { _Chord } from "@music-analyzer/tonal-objects";
import { TimeAndChord } from "./time-and-chord";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  return chords
    .map(e => new TimeAndChord(e.time, _Chord.get(e.chord)))
    .filter(e => e.chord.empty === false);
};
