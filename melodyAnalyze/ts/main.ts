import fs from "fs";
import { Chord } from "@tonaljs/chord/dist/index.js";
import Chord_default from "@tonaljs/chord/dist/index.js";
import { exit } from "process";

const min = (a: number, b: number) => a < b ? a : b;
const max = (a: number, b: number) => a > b ? a : b;
const parse_csv = (str: string) => {
    const separated = str.split(",");
    const ret = separated.map(e => parseFloat(e));
    return ret;
};

const compress = <T>(arr: T[]) => {
    const ret: { time: number[], value: T }[] = [];
    // const ret: { time: number[][], value: T[] } = { time: [], value: [] };
    let begin = 0;
    let old = arr[0];
    arr.forEach((e, i) => {
        if (old !== e) {
            //            ret.time.push([begin, i - 1]);
            //            ret.value.push(old);
            ret.push({ time: [begin, i - 1], value: old });
            begin = i;
            old = e;
        }
    });
    //    ret.time.push([begin, arr.length - 1]);
    //    ret.value.push(old);
    ret.push({ time: [begin, arr.length - 1], value: old });
    return ret;
};

type TimeAndString = { 0: number, 1: number, 2: string };
const getTimeAndChord = (chord_strs: TimeAndString[]) => {
    const time_and_chord = chord_strs.map(e => { return { time: [e[0], e[1]], chord: Chord_default.get(e[2]) }; });
    const non_null_chord = (() => {
        const res: { time: number[], chord: Chord }[] = [];
        time_and_chord.forEach(e => e.chord.empty ? 0 : res.push({ time: e.time, chord: e.chord }));  // chord が空の場合は time ごと除く
        return res;
    })();
    return non_null_chord;
};

const freqToMidi = (freq: number) => (Math.log2(freq) - Math.log2(440)) * 12 + 69;



type timeAndChord = { time: number[], chord: Chord };
type timeAndMelody = { time: number[], note: number }
const analyzeMelody = (melody: timeAndMelody[], chord: timeAndChord[]) => {
    const melody_i = 0;
    const chord_i = 0;
//    const time = min(melody[melody_i].time[0], chord[chord_i].time[0]);
//    const i = 0;
    return melody;
};

const hogehoge = () => {
    const a = [10, 20, 30, 40, 50];
    const b = [1, 5, 10, 15, 21, 25, 31, 35, 40, 45, 51];
    let i = 0;
    let j = 0;
    let t = 0;
    while (t < max(a[i], b[j])) {
        console.log(t, a[i], b[j]);
        // TODO: 最後の要素をうまく扱えないのを何とかする
        if (0) { }
        else if (a[i] === b[j]) { t = a[i]; i++; j++; }
        else if (a[i] <= b[j]) { t = a[i]; i++; }
        else if (a[i] >= b[j]) { t = b[j]; j++; }
        else { break; }
    }
};
//hogehoge();
//exit(0);

const main = (argv: string[]) => {
    const melody_filename = argv[2];
    const chord_filename = argv[3];
    const melody_txt = fs.readFileSync(melody_filename, "utf-8");
    const chord_txt = fs.readFileSync(chord_filename, "utf-8");
    const melody_sr = 100;  // CREPE から得られるメロディは毎秒 100 サンプル
    const melody_csv = parse_csv(melody_txt).map(e => isNaN(e) ? null : Math.round(freqToMidi(e)));  // compress が NaN を全て別のオブジェクト扱いするので null に置換する
    const comp_melody = compress(melody_csv);
    const non_null_melody = (() => {
        const res: { time: number[], note: number }[] = [];
        comp_melody.forEach(e => e.value === null ? 0 : res.push({ time: e.time.map(i => i / melody_sr), note: e.value }));  // value が null の場合は time ごと除く
        return res;
    })();

    const time_and_chord = getTimeAndChord(JSON.parse(chord_txt));
    // TODO: コードとメロディの関係を求める

    console.log(JSON.stringify(
        analyzeMelody(
            non_null_melody,
            time_and_chord
        )
    ));
};
main(process.argv);