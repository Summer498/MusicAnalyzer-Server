"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TonalEx_js_1 = require("./lib/TonalEx/TonalEx.js");
const readline_1 = __importDefault(require("readline"));
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
// 自信のあるものを選ぶ処理は後で実装 (とりあえず [0] としている)
const select_suitable_progression = (roman_chords) => {
    return roman_chords[0];
};
// Expected Input: "Am7 FM7 G7 CM7"
const calcChordProgression = (chords) => {
    const tmp = chords.split("N") // ノンコードシンボルを除く     "C F N N G C"                       => ["C F ", " ", " G C"]
        .map(e => e.split(" ")) // 区切り文字で分割             ["C F ", " ", " G C"]               => [["C","F",""], [""], ["","G","C"]]
        .map(arr => remove_item(arr, (item) => item == "")); // 空コードを除く               [["C","F",""], [""], ["","G","C"]]  => [["C","F"], [], ["G","C"]]
    const progressions_str = remove_item(tmp, (item) => item.length == 0); // 空配列を除く                 [["C","F"], [], ["G","C"]]          => [["C","F"], ["G","C"]]
    const progressions = progressions_str.map(chords_str => new TonalEx_js_1.ChordProgression(chords_str));
    return progressions.map((progression) => select_suitable_progression(progression.getMinimumPath()));
};
const main = (argv) => {
    if (argv.length > 2) {
        // 引数からコード列の入力があれば受け取る (テスト用)
        console.error(`出力:`);
        const roman_chords = calcChordProgression(argv[2]);
        console.log(JSON.stringify(roman_chords));
    }
    else {
        // 標準入力からコード進行を受け取る
        process.stdin.setEncoding("utf8");
        let lines = [];
        const reader = readline_1.default.createInterface({ input: process.stdin });
        reader.on("line", (line) => { lines.push(line); });
        reader.on("close", () => {
            // 本処理
            const roman_chords = calcChordProgression(lines.join(" "));
            console.log(JSON.stringify(roman_chords));
        });
    }
};
main(process.argv);
//*/
//# sourceMappingURL=ChordToRoman.js.map