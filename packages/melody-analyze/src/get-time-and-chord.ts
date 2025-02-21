import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze";
import { _Chord } from "@music-analyzer/tonal-objects";
import { ITimeAndChord } from "./interfaces";

const _getTimeAndChord = (chords: TimeAndChordSymbol[]) => {
  const time_and_chord = chords.map(e => {
    return { time: [e.begin, e.end], chord: _Chord.get(e.chord) };
  });
  const non_null_chord = (() => {
    const res: ITimeAndChord[] = [];
    time_and_chord.forEach(e => e.chord.empty ? 0 : res.push({
      begin: e.time[0],
      end: e.time[1],
      chord: e.chord
    })); // chord が空の場合は time ごと除く
    return res;
  })();
  return non_null_chord;
};
