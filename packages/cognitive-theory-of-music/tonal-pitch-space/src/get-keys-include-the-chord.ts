import { _Key } from "@music-analyzer/tonal-objects";
import { _Scale } from "@music-analyzer/tonal-objects";
import { Chord } from "@music-analyzer/tonal-objects";
import { doesKeyIncludeTheChord } from "./does-key-include-the-chord";

// 最も尤もらしいコード進行を見つける
const chroma2symbol = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",];

// TODO: minor Major 7 を受け取ることがあるので, 任意のキーを候補として使えるようにする.
// NOTE: major キーのみ受け取るようにしている
export const getKeysIncludeTheChord = (chord: Chord) => {
  const keys_includes_the_chord = chroma2symbol
    .flatMap(symbol => [
      _Key.majorKey(symbol),
      // _Key.minorKey(symbol).natural,
    ])
    .filter(key => doesKeyIncludeTheChord(key, chord))
    .map(key => _Scale.get(key.chordScales[0]));
  return keys_includes_the_chord;
};
