import { ChordProgression } from "@music-analyzer/key-estimation";
import { default as ReadLine } from "readline";
import { TimeAnd } from "@music-analyzer/time-and";
import { RomanChord } from "@music-analyzer/roman-chord";

export interface TimeAndRomanAnalysis extends TimeAnd {
  scale: string,
  chord: string,
  roman: string,
}

const remove_item = <T>(array: T[], will_removed: (item: T) => boolean) => {
  const ret: T[] = [];
  for (const e of array) {
    if (will_removed(e)) { continue; }
    ret.push(e);
  }
  return ret;
};

// TODO: 自信のあるものを選ぶ処理は後で実装 (とりあえず type が major のものとしている)
const select_suitable_progression = (roman_chords: RomanChord[][]) => {
  // 入力は roman_chords[時刻][候補番号]
  // 全部を出力して確認する
  // console.log(roman_chords.map(e=>e.map(e => ({ scale: e.scale.name, chord: e.chord.name, roman: e.roman }))));
  return roman_chords.map(e_t => e_t.reduceRight(
    (p, c) => c.scale.type === "major" || p.scale.type === "minor" ? c : p)
  );
};

const splitArray = <T>(arr: T[], separator: (e: T) => boolean) => {
  const res: T[][] = [];
  let elm: T[] = [];
  arr.forEach(e => {
    if (separator(e)) {
      res.push(elm.map(e => e));
      elm = [];
    } else { elm.push(e); }
  });
  res.push(elm.map(e => e));
  return res;
};

type TimeAndString = { 0: number; 1: number; 2: string };
// Expected Input: "Am7 FM7 G7 CM7"
const calcChordProgression = (chords: TimeAndString[]): TimeAndRomanAnalysis[] => {
  const tmp0 = splitArray(chords, e => e[2] === "N"); // ノンコードシンボルを除く     ["C", "F", "N", "N", "G","C"]       => [["C"],["F"], [], ["G"],["C"]]
  const time_and_chordss = remove_item(tmp0, item => item.length === 0); // 空配列を除く                 [["C"],["F"], [], ["G"],["C"]]      => [["C","F"], ["G","C"]]

  return time_and_chordss.flatMap(time_and_chords => {
    const time = time_and_chords.map(e => ({
      begin: Math.floor(e[0] * 1000) / 1000,
      end: Math.floor(e[1] * 1000) / 1000
    }));
    const progression = select_suitable_progression(
      new ChordProgression(time_and_chords.map(e => e[2])).getMinimumPath(),
    );
    return time_and_chords.map((_, i) => {
      return {
        begin: time[i].begin,
        end: time[i].end,
        roman: progression[i].roman,
        chord: progression[i].chord.name,
        scale: progression[i].scale.name,
      };
    });
  });
};

const main = (argv: string[]) => {
  if (argv.length > 2) {
    // 引数からコード列の入力があれば受け取る (テスト用)
    console.error(`出力:`);
    const chords = argv[2].split(" ");
    const chords_with_time = chords.map((e, i) => ({ 0: i * 100, 1: (i + 1) * 100, 2: e }));
    const roman_chords = calcChordProgression(chords_with_time);
    console.log(JSON.stringify(roman_chords, undefined, "  "));
  } else {
    // 標準入力からコード進行を受け取る
    process.stdin.setEncoding("utf8");
    const lines: string[] = [];
    const reader = ReadLine.createInterface({ input: process.stdin });
    reader.on("line", (line: string) => { lines.push(line); });
    reader.on("close", () => {
      const led_data: TimeAndString[] = JSON.parse(lines.join(""));
      // 本処理
      const roman_chords = calcChordProgression(
        led_data.map(e => ({ 0: e[0], 1: e[1], 2: e[2].replace(":", "") })),
      );
      console.log(JSON.stringify(roman_chords, undefined, "  "));
    });
  }
};
main(process.argv);
