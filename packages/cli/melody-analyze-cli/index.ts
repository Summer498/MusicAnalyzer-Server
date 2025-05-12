import { SerializedRomanAnalysisData } from "@music-analyzer/chord-analyze";
import { analyzeMelody, SerializedMelodyAnalysisData } from "@music-analyzer/melody-analyze";
import { getTimeAndMelody } from "@music-analyzer/melody-analyze";
import { default as fs } from "fs";
import { default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";

interface CommandLineOptions {
  readonly melody_filename: string;
  readonly roman_filename: string;
  readonly sampling_rate: number;
  readonly outfile: string;
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
  const non_null_melody = getTimeAndMelody(melody_data, args.sampling_rate);
  const time_and_roman = JSON.parse(roman_txt) as SerializedRomanAnalysisData;

  fs.writeFileSync(
    args.out_file,
    JSON.stringify(new SerializedMelodyAnalysisData(analyzeMelody(non_null_melody, time_and_roman.body)), undefined, "  ")
  );
};
main(process.argv);
