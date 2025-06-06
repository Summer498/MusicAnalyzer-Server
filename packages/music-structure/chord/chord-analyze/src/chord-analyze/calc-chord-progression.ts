import { createChordProgression } from "../key-estimation";
import { remove_item } from "./remove-item";
import { select_suitable_progression } from "./select-suitable-progression";
import { splitArray } from "./split-array";
import { TimeAndChordSymbol } from "./time-and-chord";
import { createSerializedTimeAndRomanAnalysis } from "./serialized-time-and-roman-analysis";

// Expected Input: "Am7 FM7 G7 CM7"
export const calcChordProgression = (chords: TimeAndChordSymbol[]) => {
  const tmp0 = splitArray(chords, chord => chord.chord === "N"); // ノンコードシンボルを除く     ["C", "F", "N", "N", "G","C"]       => [["C"],["F"], [], ["G"],["C"]]
  const time_and_chord_groups = remove_item(tmp0, item => item.length === 0); // 空配列を除く                 [["C"],["F"], [], ["G"],["C"]]      => [["C","F"], ["G","C"]]

  return time_and_chord_groups.flatMap(chords => {
    const time = chords.map(chord => chord.time.map(e => Math.floor(e * 1000) / 1000));
    const progression = select_suitable_progression(
      createChordProgression(chords.map(chord => chord.chord)).getMinimumPath(),
    );
    return chords.map((_, i) => createSerializedTimeAndRomanAnalysis(
      time[i],
      progression[i].chord.name,
      progression[i].scale.name,
      progression[i].roman,
    ));
  });
};

