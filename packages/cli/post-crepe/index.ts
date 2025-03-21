import { default as fs } from "fs";
import { parse } from "csv-parse/sync";
import { freq2midi, getBandpassFrequency, getFreqFromPhase, getFrequency, getWav, roundOnMIDI } from "@music-analyzer/post-f0-util"
import { getMedianFrequency, VocalsF0CSV } from "./src";

const main = (argv: string[]) => {
  const csv_file_path = argv[2];

  const input_data = fs.readFileSync(csv_file_path);
  const parsed_data: VocalsF0CSV[] = parse(input_data, { columns: true, cast: true, delimiter: ',' });

  const SAMPLING_RATE = 22050;
  // 瞬間周波数 [Hz/s]
  const freq_row = parsed_data.map(e => e.frequency);
  const freq_rounded = freq_row.map(freq => roundOnMIDI(freq));
  const freq_median_filtered = getMedianFrequency(freq_rounded);
  const freq_band_passed = getBandpassFrequency(freq_median_filtered);
  const frequency = getFrequency(freq_band_passed, SAMPLING_RATE, 100);

  // output
  const out_dir = `${argv[3]}`;
  if (!fs.existsSync(out_dir)) { fs.mkdirSync(out_dir); }
  const out_filename = out_dir + "/vocals";
  fs.writeFileSync(`${out_filename}.midi.json`, JSON.stringify(freq_band_passed.map(e => Math.round(freq2midi(e)))));
  fs.writeFileSync(`${out_filename}.json`, JSON.stringify(freq_band_passed));

  // サイン波の音で確認するため, 瞬間周波数を積分して位相を求める
  const sinoid =
    getFreqFromPhase(frequency)
      .map(e => e / SAMPLING_RATE)
      .map(e => Math.sin(e) * 0.8 * 32767)
      .map(e => Math.floor(e));
  fs.writeFileSync(`${out_filename}.f0.wav`, getWav(sinoid, SAMPLING_RATE));
  fs.writeFileSync(`${out_filename}mini.f0.wav`, getWav(sinoid.slice(17 * SAMPLING_RATE, 40 * SAMPLING_RATE), SAMPLING_RATE)
  );
};

main(process.argv);