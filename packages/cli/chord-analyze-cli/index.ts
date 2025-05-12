import { calcChordProgression, SerializedRomanAnalysisData } from "@music-analyzer/chord-analyze";
import { TimeAndChordSymbol } from "@music-analyzer/chord-analyze";
import { Time } from "@music-analyzer/time-and";
import { default as ReadLine } from "readline";

type TimeAndItem<T> = { 0: number, 1: number, 2: T }
type TimeAndString = TimeAndItem<string>;

const analyzeAndOutputProgression = (chords: TimeAndString[]) => {
  const chords_with_time = chords.map(e => new TimeAndChordSymbol(new Time(e[0], e[1]), e[2].replace(":", "")));
  const roman_chords = calcChordProgression(chords_with_time);
  console.log(JSON.stringify(
    new SerializedRomanAnalysisData(roman_chords),
    undefined, "  "
  ));
};

const handleArgv = (argv: string[]) => {
  const chords = argv[2].split(" ").map((e, i) => ({ 0: i * 100, 1: (i + 1) * 100, 2: e }));
  analyzeAndOutputProgression(chords);
};

const handleStdIn = (lines: string[]) => {
  process.stdin.setEncoding("utf8");
  const reader = ReadLine.createInterface({ input: process.stdin });
  reader.on("line", (line: string) => { lines.push(line); });
  reader.on("close", () => {
    const chords = JSON.parse(lines.join("")) as TimeAndString[];
    analyzeAndOutputProgression(chords);
  });
};

const main = (argv: string[]) => {
  if (argv.length > 2) { handleArgv(argv); }
  else { handleStdIn([]); }
};
main(process.argv);
