import { ChordProgression } from "./lib/TonalEx/TonalEx.js";
import ReadLine from "readline";
const green = "\u001b[32m";
const reset = "\u001b[0m";
const remove_item = (array, will_removed) => {
    let ret = [];
    for (const e of array) {
        if (will_removed(e)) {
            continue;
        }
        ret.push(e);
    }
    return ret;
};
// TODO: 自信のあるものを選ぶ処理は後で実装 (とりあえず [0] としている)
const select_suitable_progression = (roman_chords) => {
    /*
    // 全部を出力して確認する
    console.log(roman_chords.map(e=>e.map(e => {
        return {
            scale: e.scale.name, chord: e.chord.name, roman: e.roman
        }
    })));
    */
    return roman_chords[0];
};
const splitArray = (arr, separator) => {
    let res = [];
    let elm = [];
    arr.forEach(e => {
        if (separator(e)) {
            res.push(elm.map(e => e));
            elm = [];
        }
        else {
            elm.push(e);
        }
    });
    res.push(elm.map(e => e));
    return res;
};
// Expected Input: "Am7 FM7 G7 CM7"
const calcChordProgression = (chords) => {
    const tmp0 = splitArray(chords, e => e[2] === "N"); // ノンコードシンボルを除く     ["C", "F", "N", "N", "G","C"]       => [["C"],["F"], [], ["G"],["C"]]
    const time_and_chordss = remove_item(tmp0, item => item.length === 0); // 空配列を除く                 [["C"],["F"], [], ["G"],["C"]]      => [["C","F"], ["G","C"]]
    return time_and_chordss.map(time_and_chords => {
        const time = time_and_chords.map(e => [e[0], e[1]]);
        const progression = select_suitable_progression(new ChordProgression(time_and_chords.map(e => e[2])).getMinimumPath());
        return time_and_chords.map((_, i) => {
            return {
                time: time[i],
                progression: progression[i]
            };
        });
    });
};
const main = (argv) => {
    if (argv.length > 2) {
        // 引数からコード列の入力があれば受け取る (テスト用)
        console.error(`出力:`);
        const chords = argv[2].split(" ");
        const chords_with_time = chords.map((e, i) => { return { 0: i * 100, 1: (i + 1) * 100, 2: e }; });
        const roman_chords = calcChordProgression(chords_with_time);
        console.log(JSON.stringify(roman_chords));
    }
    else {
        // 標準入力からコード進行を受け取る
        process.stdin.setEncoding("utf8");
        let lines = [];
        const reader = ReadLine.createInterface({ input: process.stdin });
        reader.on("line", (line) => { lines.push(line); });
        reader.on("close", () => {
            const led_data = JSON.parse(lines.join(""));
            // 本処理
            const roman_chords = calcChordProgression(led_data.map(e => { return { 0: e[0], 1: e[1], 2: e[2].replace(":", "") }; }));
            console.log(JSON.stringify(roman_chords));
        });
    }
};
main(process.argv);
//*/
//# sourceMappingURL=ChordToRoman.js.map