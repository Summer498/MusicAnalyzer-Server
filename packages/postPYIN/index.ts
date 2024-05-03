import { default as fs } from "fs";
import { getRange, median } from "../Math/dist";
import { WaveFile } from "wavefile";

const bandpass = (x: number, low: number, high: number) => low <= x && x < high ? x : NaN;
const freq2midi = (freq: number) => 12 * (Math.log2(freq) - Math.log2(440)) + 69;
const midi2freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
const roundOnMIDI = (freq: number) => midi2freq(Math.round(freq2midi(freq)));

export const SAMPLING_RATE = 22050;

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

class MedianFilter {
  i;
  buff: number[];
  window_size;
  constructor(window_size: number) {
    this.i = 0;
    this.buff = new Array<number>(0);
    this.window_size = window_size;
  }
  median(e: number | null) {
    // i が 1 ずつ上がる想定
    if (e === null) {
      // バッファ初期化
      this.i = 0;
      this.buff = new Array<number>(0);
      return null;
    }

    if (this.buff.length < this.window_size) { this.buff.push(e); }
    else {
      // リングバッファに保存
      this.i = (this.i + 1) % this.window_size;
      this.buff[this.i] = e;
    }
    return median(this.buff);
  }
}

const getMedianFrequency = (freq_rounded: (number | null)[]) => {
  // 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
  const WINDOW_SIZE = 25;
  const median_filter = new MedianFilter(WINDOW_SIZE);
  return freq_rounded.map(e => median_filter.median(e));
};

const getBandpassEdFrequency = (freq_median_filtered: number[]) => {
  const LOW = 220; // hz
  const HIGH = 880; // hz
  // バンドパスで低すぎる/高すぎる音を除く
  return freq_median_filtered.map(freq => bandpass(freq, LOW, HIGH));
};

// DATA_SAMPLING_RATE 刻みのデータをサンプリング周波数に合わせる
const getFrequency = (freq_band_passed: number[]) => {
  const DATA_SAMPLING_RATE = Math.floor(44100 / 512);
  const N = SAMPLING_RATE / DATA_SAMPLING_RATE;
  const size = Math.floor(freq_band_passed.length * SAMPLING_RATE / DATA_SAMPLING_RATE);
  console.log(`size: ${size}`);
  const frequency = getRange(0, size).map(i => 2 * Math.PI * freq_band_passed[Math.floor(i / N)]);
  return frequency;
};

const getWav = (src: number[]) => {
  const wav = new WaveFile();
  wav.fromScratch(1, SAMPLING_RATE, "16", src);
  return wav.toBuffer();
};

type Vocals = {
  sampling_rate: number,
  f0: (number | null)[],
  voiced_flags: boolean[],
  voiced_prob: number[]
};

const main = (argv: string[]) => {
  console.error("this is PostPYIN");

  const vocal_f0_file_path = argv[2];

  const data = fs.readFileSync(vocal_f0_file_path, "utf8");
  const f0_data: Vocals = JSON.parse(data);
  // const input_data = fs.readFileSync(vocal_f0_file_path);
  // const parsed_data: VocalsF0CSV[] = parse(input_data, { columns: true, cast: true, delimiter: ',' });

  // 瞬間周波数 [Hz/s]
  const freq_row = f0_data.f0;
  const freq_rounded = freq_row.map(freq => freq && roundOnMIDI(freq));
  const freq_median_filtered = getMedianFrequency(freq_rounded).map(e => e === null ? NaN : e);
  const freq_band_passed = getBandpassEdFrequency(freq_median_filtered);
  const frequency = getFrequency(freq_band_passed);

  // output
  const out_dir = `${argv[3]}`;
  if (!fs.existsSync(out_dir)) { fs.mkdirSync(out_dir); }
  const out_filename = out_dir + "/vocals";
  fs.writeFileSync(`${out_filename}.midi.json`, JSON.stringify(freq_band_passed.map(e => Math.round(freq2midi(e)))));
  fs.writeFileSync(`${out_filename}.json`, JSON.stringify(freq_band_passed));


  // サイン波の音で確認するため, 瞬間周波数を積分して位相を求める
  const freq2phase = new Freq2Phase(frequency[0], SAMPLING_RATE);
  const phase = frequency.map(freq => freq2phase.calc(freq));
  const sinoid = phase.map(e => Math.floor(Math.sin(e) * 0.8 * 32767));
  fs.writeFileSync(
    `${out_filename}.f0.wav`,
    getWav(sinoid)
  );
  fs.writeFileSync(
    `${out_filename}mini.f0.wav`,
    getWav(sinoid.slice(17 * SAMPLING_RATE, 40 * SAMPLING_RATE))
  );
};

main(process.argv);