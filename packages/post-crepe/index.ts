import { default as fs } from "fs";
import { getRange, median } from "@music-analyzer/math";
import { WaveFile } from "wavefile";
import { parse } from "csv-parse/sync";

const bandpass = (x: number, low: number, high: number) => low <= x && x < high ? x : NaN;
const freq2midi = (freq: number) => 12 * (Math.log2(freq) - Math.log2(440)) + 69;
const midi2freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
const roundOnMIDI = (freq: number) => midi2freq(Math.round(freq2midi(freq)));

class MedianFilter {
  buff;
  array;
  window_size;
  constructor(initializer: number[], window_size: number) {
    this.buff = initializer.slice(0, window_size);
    this.array = initializer;
    this.window_size = window_size;
  }
  median(i: number) {
    this.buff[i % this.window_size] = this.array[i];  // リングバッファに保存
    return median(this.buff);
  }
}

class Freq2Phase {
  s;
  s0;
  sampling_rate;
  constructor(s0: number, sampling_rate = 44100) {
    this.s = 0;
    this.s0 = s0 || 0;
    this.sampling_rate = sampling_rate;
  }
  calc(freq: number) {
    this.s += (freq || 0) / this.sampling_rate;
    return this.s + this.s0;
  }
}

type VocalsF0CSV = { time: number, frequency: number, confidence: number }


const getMedianFrequency = (freq_rounded: number[]) => {
  // 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
  const WINDOW_SIZE = 25;
  const median_filter = new MedianFilter(freq_rounded, WINDOW_SIZE);
  return getRange(0, freq_rounded.length).map(i => median_filter.median(i));
};

const getBandpassEdFrequency = (freq_median_filtered: number[]) => {
  const LOW = 220; // hz
  const HIGH = 880; // hz
  // バンドパスで低すぎる/高すぎる音を除く
  return freq_median_filtered.map(freq => bandpass(freq, LOW, HIGH));
};

// 1/100[s] 刻みのデータをサンプリング周波数に合わせる
const getFrequency = (freq_band_passed: number[], SAMPLING_RATE: number) => {
  const CSV_SAMPLING_RATE = 100;
  const N = SAMPLING_RATE / CSV_SAMPLING_RATE;
  const size = Math.floor(freq_band_passed.length * SAMPLING_RATE / CSV_SAMPLING_RATE);
  const frequency = getRange(0, size).map(i => 2 * Math.PI * freq_band_passed[Math.floor(i / N)]);
  return frequency;
};

const getWav = (src: number[], SAMPLING_RATE: number) => {
  const wav = new WaveFile();
  wav.fromScratch(1, SAMPLING_RATE, "16", src);
  return wav.toBuffer();
};

const main = (argv: string[]) => {
  const csv_file_path = argv[2];

  const input_data = fs.readFileSync(csv_file_path);
  const parsed_data: VocalsF0CSV[] = parse(input_data, { columns: true, cast: true, delimiter: ',' });

  const SAMPLING_RATE = 22050;
  // 瞬間周波数 [Hz/s]
  const freq_row = parsed_data.map(e => e.frequency);
  const freq_rounded = freq_row.map(freq => roundOnMIDI(freq));
  const freq_median_filtered = getMedianFrequency(freq_rounded);
  const freq_band_passed = getBandpassEdFrequency(freq_median_filtered);
  const frequency = getFrequency(freq_band_passed, SAMPLING_RATE);

  // output
  const out_dir = `${argv[3]}`;
  if (!fs.existsSync(out_dir)) { fs.mkdirSync(out_dir); }
  const out_filename = out_dir + "/vocals";
  fs.writeFileSync(`${out_filename}.midi.json`, JSON.stringify(freq_band_passed.map(e => Math.round(freq2midi(e)))/*, undefined, "  "*/));
  fs.writeFileSync(`${out_filename}.json`, JSON.stringify(freq_band_passed/*, undefined, " "*/));

  // サイン波の音で確認するため, 瞬間周波数を積分して位相を求める
  const freq2phase = new Freq2Phase(frequency[0], SAMPLING_RATE);
  const phase = frequency.map(freq => freq2phase.calc(freq));
  const sinoid = phase.map(e => Math.floor(Math.sin(e) * 0.8 * 32767));
  fs.writeFileSync(
    `${out_filename}.f0.wav`,
    getWav(sinoid, SAMPLING_RATE)
  );
  fs.writeFileSync(
    `${out_filename}mini.f0.wav`,
    getWav(sinoid.slice(17 * SAMPLING_RATE, 40 * SAMPLING_RATE), SAMPLING_RATE)
  );
};

main(process.argv);