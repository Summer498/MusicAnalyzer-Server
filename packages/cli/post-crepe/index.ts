import { default as fs } from "fs";
import { parse } from "csv-parse/sync";
import { freq2midi, getBandpassFrequency, getFreqFromPhase, getFrequency, getWav, roundOnMIDI } from "@music-analyzer/post-f0-util"
import { getMedianFrequency, VocalsF0CSV } from "./src";

const main = (argv: string[]) => {
  const csv_file_path = argv[2];

  const input = fs.readFileSync(csv_file_path);
  const parsed: VocalsF0CSV[] = parse(input, { columns: true, cast: true, delimiter: ',' });

  const SAMPLING_RATE = 22050;
  // 瞬間周波数 [Hz/s]
  const raw = parsed.map(e => e.frequency);
  const round = raw.map(freq => roundOnMIDI(freq));
  const median = getMedianFrequency(round);
  const bandpass = getBandpassFrequency(median);
  const frequency = getFrequency(bandpass, SAMPLING_RATE, 100);
  return postProcess(argv[3], SAMPLING_RATE, bandpass, frequency)
};

const postProcess = (
  dir: string,
  SAMPLING_RATE: number,
  bandpass: number[],
  frequency: number[],
) => {
  // output
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }
  const out = `${dir}/vocals`;
  fs.writeFileSync(`${out}.midi.json`, JSON.stringify(bandpass.map(e => Math.round(freq2midi(e)))));
  fs.writeFileSync(`${out}.json`, JSON.stringify(bandpass));

  // サイン波の音で確認するため, 瞬間周波数を積分して位相を求める
  const sinoid =
    getFreqFromPhase(frequency)
      .map(e => e / SAMPLING_RATE)
      .map(e => Math.sin(e) * 0.8 * 32768)
      .map(e => Math.floor(e));
  fs.writeFileSync(`${out}.f0.wav`, getWav(sinoid, SAMPLING_RATE));
  fs.writeFileSync(`${out}mini.f0.wav`, getWav(sinoid.slice(17 * SAMPLING_RATE, 40 * SAMPLING_RATE), SAMPLING_RATE));
};

main(process.argv);