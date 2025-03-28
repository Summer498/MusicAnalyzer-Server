import { RomanChord } from "@music-analyzer/roman-chord/src/roman-chord";

// TODO: 自信のあるものを選ぶ処理は後で実装 (とりあえず type が major のものとしている)
export const select_suitable_progression = (roman_chords: RomanChord[][]) => {
  // 入力は roman_chords[時刻][候補番号]
  // 全部を出力して確認する
  // console.log(roman_chords.map(e=>e.map(e => ({ scale: e.scale.name, chord: e.chord.name, roman: e.roman }))));
  return roman_chords.map(e_t => e_t.reduceRight(
    (p, c) => c.scale.type === "major" || p.scale.type === "minor" ? c : p)
  );
};
