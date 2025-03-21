import { getRange, median } from "@music-analyzer/math";
import { WaveFile } from "wavefile";

const bandpass = (x: number, low: number, high: number) => low <= x && x < high ? x : NaN;
export const freq2midi = (freq: number) => 12 * (Math.log2(freq) - Math.log2(440)) + 69;
const midi2freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
export const roundOnMIDI = (freq: number) => midi2freq(Math.round(freq2midi(freq)));

export const SAMPLING_RATE = 22050;

export const getFreqFromPhase = (frequency: number[]) => {
  const phase = [...frequency];
  frequency.reduce((p, c, i) => {
    phase[i] = p;
    return p + c;
  })
  return phase
}

export class MedianFilter {
  i;
  buff: number[];
  constructor(
    readonly window_size: number,
  ) {
    this.i = 0;
    this.buff = [];
  }
  median(e: number | null) {
    // i が 1 ずつ上がる想定
    if (e === null) {
      // バッファ初期化
      this.i = 0;
      this.buff = [];
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

export const getMedianFrequency = (freq_rounded: (number | null)[]) => {
  // 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
  const WINDOW_SIZE = 25;
  const median_filter = new MedianFilter(WINDOW_SIZE);
  return freq_rounded.map(e => median_filter.median(e));
};

export const getBandpassEdFrequency = (freq_median_filtered: number[]) => {
  const LOW = 110; // hz
  const HIGH = 880; // hz
  // バンドパスで低すぎる/高すぎる音を除く
  return freq_median_filtered.map(freq => bandpass(freq, LOW, HIGH));
};

// DATA_SAMPLING_RATE 刻みのデータをサンプリング周波数に合わせる
export const getFrequency = (freq_band_passed: number[]) => {
  const DATA_SAMPLING_RATE = Math.floor(44100 / 512);
  const N = SAMPLING_RATE / DATA_SAMPLING_RATE;
  const size = Math.floor(freq_band_passed.length * SAMPLING_RATE / DATA_SAMPLING_RATE);
  const frequency = getRange(0, size).map(i => 2 * 2 * Math.PI * freq_band_passed[Math.floor(i / N)]);
  return frequency;
};

export const getWav = (src: number[]) => {
  const wav = new WaveFile();
  wav.fromScratch(1, SAMPLING_RATE, "16", src);
  return wav.toBuffer();
};

export type Vocals = {
  readonly sampling_rate: number,
  f0: (number | null)[],
  readonly voiced_flags: boolean[],
  readonly voiced_prob: number[]
};
