import fs from "fs";
import { Chord, _Chord, _Note, _Scale } from "@music-analyzer/tonal-objects";
import { compress, TimeAnd } from "@music-analyzer/time-and";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { Archetype } from "@music-analyzer/irm";
import { default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";

const mod = (x: number, m: number) => (x % m + m) % m;

export type Gravity = { destination?: number; resolved?: true }
export type MelodyAnalysis = {
  scale_gravity?: Gravity,
  chord_gravity?: Gravity,
  implication_realization: Archetype,
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
    const start = i > 1 ? i - 1 : 0;
    const next = i + 1;
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
        implication_realization: new Archetype(melodies.slice(start, next + 1).map(e => _Note.fromMidi(e.note)))
      },
    };
  });
};

interface CommandLineOptions {
  melody_filename: string;
  roman_filename: string;
  sampling_rate: number;
  outfile: string;
}

const parseArgs = (argv: string[]) => {
  const parsed_argv = yargs(hideBin(argv))
    .option('melody_filename', {
      alias: 'm',
      type: 'string',
      description: 'The filename of the melody',
      demandOption: true
    })
    .option('roman_filename', {
      alias: 'r',
      type: 'string',
      description: 'The filename of the roman chords',
      demandOption: true
    })
    .option('sampling_rate', {
      alias: 's',
      type: 'number',
      description: 'The sampling rate',
      demandOption: true
    })
    .option('outfile', {
      alias: 'o',
      type: 'string',
      description: 'The output file',
      demandOption: true
    })
    .parseSync() as CommandLineOptions; // 引数を解析します

  return {
    melody_file: parsed_argv.melody_filename,
    roman_file: parsed_argv.roman_filename,
    sampling_rate: parsed_argv.sampling_rate,
    out_file: parsed_argv.outfile
  };
};

const main = (argv: string[]) => {
  const args = parseArgs(argv);
  const melody_txt = fs.readFileSync(args.melody_file, "utf-8");
  const roman_txt = fs.readFileSync(args.roman_file, "utf-8");
  const melody_data: number[] = JSON.parse(melody_txt);
  const melody = melody_data.map(e => e === null ? null : Math.round(freqToMidi(e)));
  const comp_melody = compress(melody);
  const non_null_melody = (() => {
    const res: TimeAndMelody[] = [];
    comp_melody.forEach(e => e.item === null ? 0 : res.push({ begin: e.begin / args.sampling_rate, end: e.end / args.sampling_rate, note: e.item })); // value が null の場合は time ごと除く
    return res;
  })();

  const time_and_roman = JSON.parse(roman_txt);

  fs.writeFileSync(
    args.out_file,
    JSON.stringify(analyzeMelody(non_null_melody, time_and_roman), undefined, "  ")
  );
};
main(process.argv);