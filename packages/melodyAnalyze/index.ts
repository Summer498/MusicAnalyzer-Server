import fs from "fs";
import { Chord, _Chord, _Note, _Scale } from "../TonalObjects";
import { compress, TimeAnd } from "../timeAnd";
import { TimeAndRomanAnalysis } from "../chordToRoman";

const mod = (x: number, m: number) => (x % m + m) % m;
const parse_csv = (str: string) => {
  const separated = str.split(",");
  const ret = separated.map(e => parseFloat(e));
  return ret;
};

export type Gravity = { destination?: number; resolved?: true }
export type MelodyAnalysis = {
  scale_gravity?: Gravity,
  chord_gravity?: Gravity,
};
export interface TimeAndMelody extends TimeAnd { note: number }
export interface TimeAndChord extends TimeAnd { chord: Chord }
export interface TimeAndMelodyAnalysis extends TimeAnd {
  note: number,
  roman_name: string,
  melody_analysis: MelodyAnalysis,
}


type TimeAndString = { 0: number; 1: number; 2: string };
const _getTimeAndChord = (chord_strs: TimeAndString[]) => {
  const time_and_chord = chord_strs.map(e => {
    return { time: [e[0], e[1]], chord: _Chord.get(e[2]) };
  });
  const non_null_chord = (() => {
    const res: TimeAndChord[] = [];
    time_and_chord.forEach(e => e.chord.empty ? 0 : res.push({ begin: e.time[0], end: e.time[1], chord: e.chord })); // chord が空の場合は time ごと除く
    return res;
  })();
  return non_null_chord;
};

const freqToMidi = (freq: number) => (Math.log2(freq) - Math.log2(440)) * 12 + 69;

// TODO: マイナーコードに対応する
const registerGravity = (name: string, tonic: number, melodies: TimeAndMelody[], i: number): Gravity | undefined => {
  if (!name) { return undefined; }
  const melody = melodies[i];
  const chroma = mod(melody.note - tonic - (name.includes("major") ? 0 : 3), 12);
  const destination = chroma === 11 ? melody.note + 1 : chroma === 5 ? melody.note - 1 : undefined;
  if (destination === undefined) { return undefined; }
  return {
    destination,
    resolved: destination && i + 1 < melodies.length && melodies[i + 1].note === destination || undefined
  };
};

const analyzeMelody = (
  melodies: TimeAndMelody[],
  romans: TimeAndRomanAnalysis[],
): TimeAndMelodyAnalysis[] => {
  return melodies.map((melody, i) => {
    const _roman = romans.find(roman => roman.begin <= melody.end && melody.begin < roman.end); // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
    return {
      begin: melody.begin,
      end: melody.end,
      note: melody.note,
      roman_name: _roman?.roman || "",
      melody_analysis: {
        scale_gravity: registerGravity(
          _roman?.scale || "",
          _Note.get(_Scale.get(_roman?.scale || "").tonic || "").chroma,
          melodies,
          i
        ),
        chord_gravity: registerGravity(
          _roman?.chord || "",
          _Note.get(_Chord.get(_roman?.chord || "").tonic || "").chroma,
          melodies,
          i
        ),
      },
    };
  });
};

const main = (argv: string[]) => {
  const melody_filename = argv[2];
  const roman_filename = argv[3];
  const melody_txt = fs.readFileSync(melody_filename, "utf-8");
  const roman_txt = fs.readFileSync(roman_filename, "utf-8");
  const melody_sr = 100; // CREPE から得られるメロディは毎秒 100 サンプル
  const melody_csv = parse_csv(melody_txt).map(e => isNaN(e) ? null : Math.round(freqToMidi(e))); // compress が NaN を全て別のオブジェクト扱いするので null に置換する
  const comp_melody = compress(melody_csv);
  const non_null_melody = (() => {
    const res: TimeAndMelody[] = [];
    comp_melody.forEach(e => e.item === null ? 0 : res.push({ begin: e.begin / melody_sr, end: e.end / melody_sr, note: e.item })); // value が null の場合は time ごと除く
    return res;
  })();

  const time_and_roman = JSON.parse(roman_txt);

  console.log(JSON.stringify(analyzeMelody(non_null_melody, time_and_roman), undefined, "  "));
};
main(process.argv);
