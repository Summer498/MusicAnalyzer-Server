import { ChordProgression, RomanChord } from "./lib/TonalEx/TonalEx.js";
import { Assertion, assertNonNullable } from "./lib/StdLib/stdlib.js";
import { exit, stdin } from "process";
import ReadLine from "readline";
import { Chord_default, Scale_default } from "./lib/adapters/Tonal.js";

const green = "\u001b[32m";
const reset = "\u001b[0m";

const remove_item = <T>(array: T[], will_removed: (item: T) => Boolean) => {
    let ret: T[] = []
    for (const e of array) {
        if (will_removed(e)) { continue; }
        ret.push(e)
    }
    return ret;
}

// TODO: 自信のあるものを選ぶ処理は後で実装 (とりあえず [0] としている)
const select_suitable_progression = (roman_chords: RomanChord[][]) => {
    return roman_chords[0];
}

// Expected Input: "Am7 FM7 G7 CM7"
const calcChordProgression = (chords: string): RomanChord[][] => {
    const tmp = chords.split("N")                                           // ノンコードシンボルを除く     "C F N N G C"                       => ["C F ", " ", " G C"]
        .map(e => e.split(" "))                                             // 区切り文字で分割             ["C F ", " ", " G C"]               => [["C","F",""], [""], ["","G","C"]]
        .map(arr => remove_item(arr, (item) => item == ""));                // 空コードを除く               [["C","F",""], [""], ["","G","C"]]  => [["C","F"], [], ["G","C"]]
    const progressions_str = remove_item(tmp, (item) => item.length == 0);  // 空配列を除く                 [["C","F"], [], ["G","C"]]          => [["C","F"], ["G","C"]]
    const progressions = progressions_str.map(chords_str => new ChordProgression(chords_str))
    return progressions.map((progression) => select_suitable_progression(progression.getMinimumPath()));
}

const main = (argv: string[]) => {
    if (argv.length > 2) {
        // 引数からコード列の入力があれば受け取る (テスト用)
        console.error(`出力:`);
        const roman_chords = calcChordProgression(argv[2])
        console.log(JSON.stringify(roman_chords))
    }
    else {
        // 標準入力からコード進行を受け取る
        process.stdin.setEncoding("utf8");
        let lines: string[] = [];
        const reader = ReadLine.createInterface({ input: process.stdin });
        reader.on("line", (line: string) => { lines.push(line); });
        reader.on("close", () => {
            // 本処理
            const roman_chords = calcChordProgression(lines.join(" "))
            console.log(JSON.stringify(roman_chords))
        });
    }
}
main(process.argv)
//*/