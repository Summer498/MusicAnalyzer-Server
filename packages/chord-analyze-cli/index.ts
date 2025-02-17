import { default as ReadLine } from "readline";
import { calcChordProgression, TimeAndChord } from "@music-analyzer/chord-analyze";

const main = (argv: string[]) => {
  if (argv.length > 2) {
    // 引数からコード列の入力があれば受け取る (テスト用)
    console.error(`出力:`);
    const chords = argv[2].split(" ");
    const chords_with_time = chords.map((e, i) => new TimeAndChord({ 0: i * 100, 1: (i + 1) * 100, 2: e }));
    const roman_chords = calcChordProgression(chords_with_time);
    console.log(JSON.stringify(roman_chords, undefined, "  "));
  } else {
    // 標準入力からコード進行を受け取る
    process.stdin.setEncoding("utf8");
    const lines: string[] = [];
    const reader = ReadLine.createInterface({ input: process.stdin });
    reader.on("line", (line: string) => { lines.push(line); });
    reader.on("close", () => {
      const led_data = JSON.parse(lines.join("")) as { 0: number, 1: number, 2: string }[];
      // 本処理
      const roman_chords = calcChordProgression(
        led_data.map(e => new TimeAndChord({ 0: e[0], 1: e[1], 2: e[2].replace(":", "") })),
      );
      console.log(JSON.stringify(roman_chords, undefined, "  "));
    });
  }
};
main(process.argv);
