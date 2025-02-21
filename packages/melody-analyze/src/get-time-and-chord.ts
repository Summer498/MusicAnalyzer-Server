import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze";
import { _Chord } from "@music-analyzer/tonal-objects";
import { ITimeAndChord } from "./interfaces";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  return chords
    .map(e => ({ begin: e.begin, end: e.end, chord: _Chord.get(e.chord) } as ITimeAndChord))
    .filter(e => e.chord.empty === false);
};
