import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze";
import { _Chord } from "@music-analyzer/tonal-objects";
import { TimeAndChord } from "./interfaces";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  return chords
    .map(e => new TimeAndChord(e.begin, e.end, _Chord.get(e.chord)))
    .filter(e => e.chord.empty === false);
};
