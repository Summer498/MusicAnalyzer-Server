import { default as fs } from "fs";
import { freq2midi } from "@music-analyzer/post-f0-util"
import { getBandpassFrequency } from "@music-analyzer/post-f0-util"
import { getFreqFromPhase } from "@music-analyzer/post-f0-util"
import { getFrequency } from "@music-analyzer/post-f0-util"
import { getWav } from "@music-analyzer/post-f0-util"
import { roundOnMIDI } from "@music-analyzer/post-f0-util"
import { getMedianFrequency } from "./src";
import { Vocals } from "./src";

const main = (argv: string[]) => {
  const csv_file_path = argv[2];

  const input = fs.readFileSync(csv_file_path, "utf8");
  const parsed = (JSON.parse(input) as Vocals).f0;

  const SAMPLING_RATE = 22050;
  // 瞬間周波数 [Hz/s]
  const raw = parsed.map(freq => freq && freq * 2);  // pYIN の推定結果が 1 オクターブ低く出るので 1 オクターブ上げる
  const round = raw.map(freq => freq && roundOnMIDI(freq));
  const median = getMedianFrequency(round).map(e => e === null ? NaN : e);
  const bandpass = getBandpassFrequency(median);
  const frequency = getFrequency(bandpass, SAMPLING_RATE / Math.floor(44100 / 512));
  return postProcess(argv[3], SAMPLING_RATE, bandpass, frequency)
};

const postProcess = (
  dir: string,
  SAMPLING_RATE: number,
  freq_band_passed: number[],
  frequency: number[],
) => {
  // output
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }
  const out = `${dir}/vocals`;
  fs.writeFileSync(`${out}.midi.json`, JSON.stringify(freq_band_passed.map(e => Math.round(freq2midi(e)))));
  fs.writeFileSync(`${out}.json`, JSON.stringify(freq_band_passed));

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