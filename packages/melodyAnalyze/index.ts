import fs from "fs";
import { _Chord, _Note, _Scale } from "../TonalObjects";
import { TimeAndMelody, TimeAndChord, TimeAndValue, TimeAndMelodyAnalysis, TimeAndRomanAnalysis } from "../timeAnd";

const mod = (x: number, m: number) => (x % m + m) % m;
const parse_csv = (str: string) => {
  const separated = str.split(",");
  const ret = separated.map(e => parseFloat(e));
  return ret;
};

export type MelodyAnalysis = {
  gravity: {
    destination: number | undefined;
    resolved: boolean;
  }[];
};

const compress = <T>(arr: T[]) => {
  const ret: TimeAndValue<T>[] = [];
  let begin = 0;
  let old = arr[0];
  arr.forEach((e, i) => {
    if (old !== e) {
      ret.push({ begin, end: i, value: old });
      begin = i;
      old = e;
    }
  });
  ret.push({ begin, end: arr.length, value: old });
  return ret;
};


type TimeAndString = { 0: number; 1: number; 2: string };
const getTimeAndChord = (chord_strs: TimeAndString[]) => {
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

const analyzeMelody = (
  melodies: TimeAndMelody[],
  romans: TimeAndRomanAnalysis[],
): TimeAndMelodyAnalysis[] => {
  return melodies.map((melody, i) => {
    const gravity: { destination: number | undefined; resolved: boolean }[] = [
      { destination: undefined, resolved: false },
      { destination: undefined, resolved: false },
    ];
    const _roman = romans.find(roman => roman.begin <= melody.end && melody.begin < roman.end); // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
    if (_roman) {
      const scale_tonic = _Scale.get(_roman.scale).tonic!;
      if (_roman.scale.includes("major")) {
        if (mod(melody.note - _Note.get(scale_tonic).chroma!, 12) === 11) {
          // lead note
          gravity[0].destination = melody.note + 1;
        }
        if (mod(melody.note - _Note.get(scale_tonic).chroma!, 12) === 5) {
          // 4th note
          gravity[0].destination = melody.note - 1;
        }
      } else if (_roman.scale.includes("aeolian")) {
        if (mod(melody.note - _Note.get(scale_tonic).chroma!, 12) === 2) {
          // lead note
          gravity[0].destination = melody.note + 1;
        }
        if (mod(melody.note - _Note.get(scale_tonic).chroma!, 12) === 8) {
          // 6th note
          gravity[0].destination = melody.note - 1;
        }
      }
      // TODO: マイナーコードに対応する
      const chord_tonic = _Chord.get(_roman.chord).tonic!;
      if (_roman.chord.includes("major")) {
        if (mod(melody.note - _Note.get(chord_tonic).chroma!, 12) === 11) {
          // lead note
          gravity[1].destination = melody.note + 1;
        }
        if (mod(melody.note - _Note.get(chord_tonic).chroma!, 12) === 5) {
          // 4th note
          gravity[1].destination = melody.note - 1;
        }
      }
      if (_roman.chord.includes("minor")) {
        if (mod(melody.note - _Note.get(chord_tonic).chroma!, 12) === 2) {
          // lead note
          gravity[1].destination = melody.note + 1;
        }
        if (mod(melody.note - _Note.get(chord_tonic).chroma!, 12) === 8) {
          // 4th note
          gravity[1].destination = melody.note - 1;
        }
      }
    }
    gravity.forEach((e, j) => {
      if (e.destination && i + 1 < melodies.length) {
        gravity[j].resolved = melodies[i + 1].note === e.destination;
      }
    });
    const roman_name = _roman?.roman || "";
    return {
      begin: melody.begin,
      end: melody.end,
      note: melody.note,
      roman_name,
      melody_analysis: { gravity },
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
    comp_melody.forEach(e => e.value === null ? 0 : res.push({ begin: e.begin / melody_sr, end: e.end / melody_sr, note: e.value })); // value が null の場合は time ごと除く
    return res;
  })();

  const time_and_roman = JSON.parse(roman_txt);
  // TODO: コードとメロディの関係を求める

  console.log(JSON.stringify(analyzeMelody(non_null_melody, time_and_roman), undefined, "  "));
};
main(process.argv);
