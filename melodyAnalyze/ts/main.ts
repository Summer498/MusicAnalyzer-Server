import fs from "fs";
import { Chord } from "@tonaljs/chord/dist/index.js";
import Chord_default from "@tonaljs/chord/dist/index.js";
// TODO: 悪い依存の仕方。治す。
import { RomanChord } from "../../chordToRoman/build/lib/TonalEx/TonalEx.js";
import { Note } from "tonal";

const min = (a: number, b: number) => a < b ? a : b;
const max = (a: number, b: number) => a > b ? a : b;
const mod = (x: number, m: number) => (x % m + m) % m;
const parse_csv = (str: string) => {
    const separated = str.split(",");
    const ret = separated.map(e => parseFloat(e));
    return ret;
};

type MelodyAnalysis = {
    gravity: {
        destination: number | undefined,
        resolved: boolean,
    }[]
}
type timeAndChord = { time: number[], chord: Chord };
type timeAndMelody = { time: number[], note: number }
type timeAndRoman = { time: number[], progression: RomanChord };
type timeAndMelodyAnalysis = { time: number[], note: number, roman_name: string | undefined, melodyAnalysis: MelodyAnalysis }

const compress = <T>(arr: T[]) => {
    const ret: { time: number[], value: T }[] = [];
    let begin = 0;
    let old = arr[0];
    arr.forEach((e, i) => {
        if (old !== e) {
            ret.push({ time: [begin, i], value: old });
            begin = i;
            old = e;
        }
    });
    ret.push({ time: [begin, arr.length], value: old });
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

const analyzeMelody = (melodies: timeAndMelody[], romans: timeAndRoman[]): timeAndMelodyAnalysis[] => {
    return melodies.map((melody, i) => {
        const gravity: { destination: number | undefined, resolved: boolean }[] = [{ destination: undefined, resolved: false }, { destination: undefined, resolved: false }];
        const roman = romans.find(roman => roman.time[0] <= melody.time[1] && melody.time[0] < roman.time[1]);  // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
        if (roman) {
            const scale_tonic = roman.progression.scale.tonic!;
            if (roman.progression.scale.name.includes("major")) {
                if (mod(melody.note - Note.get(scale_tonic).chroma!, 12) === 11) {  // lead note
                    gravity[0].destination = melody.note + 1;
                }
                if (mod(melody.note - Note.get(scale_tonic).chroma!, 12) === 5) {  // 4th note
                    gravity[0].destination = melody.note - 1;
                }
            }
            else if (roman.progression.scale.name.includes("aeolian")) {
                if (mod(melody.note - Note.get(scale_tonic).chroma!, 12) === 2) {  // lead note
                    gravity[0].destination = melody.note + 1;
                }
                if (mod(melody.note - Note.get(scale_tonic).chroma!, 12) === 8) {  // 6th note
                    gravity[0].destination = melody.note - 1;
                }
            }
            // TODO: マイナーコードに対応する
            const chord_tonic = roman.progression.chord.tonic!;
            if (roman.progression.chord.name.includes("major")) {
                if (mod(melody.note - Note.get(chord_tonic).chroma!, 12) === 11) {  // lead note
                    gravity[1].destination = melody.note + 1;
                }
                if (mod(melody.note - Note.get(chord_tonic).chroma!, 12) === 5) {  // 4th note
                    gravity[1].destination = melody.note - 1;
                }
            }
            if (roman.progression.chord.name.includes("minor")) {
                if (mod(melody.note - Note.get(chord_tonic).chroma!, 12) === 2) {  // lead note
                    gravity[1].destination = melody.note + 1;
                }
                if (mod(melody.note - Note.get(chord_tonic).chroma!, 12) === 8) {  // 4th note
                    gravity[1].destination = melody.note - 1;
                }
            }

        }
        gravity.forEach((e, j) => {
            if (e.destination && i + 1 < melodies.length) {
                gravity[j].resolved = melodies[i + 1].note === e.destination;
            }
        });
        return {
            time: melody.time,
            note: melody.note,
            roman_name: roman?.progression.roman,
            melodyAnalysis: { gravity }
        };
    });
};

const main = (argv: string[]) => {
    const melody_filename = argv[2];
    const roman_filename = argv[3];
    const melody_txt = fs.readFileSync(melody_filename, "utf-8");
    const roman_txt = fs.readFileSync(roman_filename, "utf-8");
    const melody_sr = 100;  // CREPE から得られるメロディは毎秒 100 サンプル
    const melody_csv = parse_csv(melody_txt).map(e => isNaN(e) ? null : Math.round(freqToMidi(e)));  // compress が NaN を全て別のオブジェクト扱いするので null に置換する
    const comp_melody = compress(melody_csv);
    const non_null_melody = (() => {
        const res: { time: number[], note: number }[] = [];
        comp_melody.forEach(e => e.value === null ? 0 : res.push({ time: e.time.map(i => i / melody_sr), note: e.value }));  // value が null の場合は time ごと除く
        return res;
    })();

    const time_and_roman = JSON.parse(roman_txt);
    // TODO: コードとメロディの関係を求める

    console.log(JSON.stringify(
        analyzeMelody(
            non_null_melody,
            time_and_roman
        )
    ));
};
main(process.argv);