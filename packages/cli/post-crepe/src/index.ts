import { getRange, median } from "@music-analyzer/math";
import { WaveFile } from "wavefile";

const bandpass = (x: number, low: number, high: number) => low <= x && x < high ? x : NaN;
export const freq2midi = (freq: number) => 12 * (Math.log2(freq) - Math.log2(440)) + 69;
const midi2freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
export const roundOnMIDI = (freq: number) => midi2freq(Math.round(freq2midi(freq)));

class MedianFilter {
  readonly buff;
  readonly array;
  constructor(
    initializer: number[],
    readonly window_size: number,
  ) {
    this.buff = initializer.slice(0, window_size);
    this.array = initializer;
  }
  median(i: number) {
    this.buff[i % this.window_size] = this.array[i];  // リングバッファに保存
    return median(this.buff);
  }
}

export const getFreqFromPhase = (frequency: number[]) => {
  const phase = [...frequency];
  frequency.reduce((p, c, i) => {
    phase[i] = p;
    return p + c;
  })
  return phase
}


export type VocalsF0CSV = { time: number, frequency: number, confidence: number }


export const getMedianFrequency = (freq_rounded: number[]) => {
  // 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
  const WINDOW_SIZE = 25;
  const median_filter = new MedianFilter(freq_rounded, WINDOW_SIZE);
  return getRange(0, freq_rounded.length).map(i => median_filter.median(i));
};

export const getBandpassEdFrequency = (freq_median_filtered: number[]) => {
  const LOW = 220; // hz
  const HIGH = 880; // hz
  // バンドパスで低すぎる/高すぎる音を除く
  return freq_median_filtered.map(freq => bandpass(freq, LOW, HIGH));
};

// 1/100[s] 刻みのデータをサンプリング周波数に合わせる
export const getFrequency = (freq_band_passed: number[], SAMPLING_RATE: number) => {
  const CSV_SAMPLING_RATE = 100;
  const N = SAMPLING_RATE / CSV_SAMPLING_RATE;
  const size = Math.floor(freq_band_passed.length * SAMPLING_RATE / CSV_SAMPLING_RATE);
  const frequency = getRange(0, size).map(i => 2 * Math.PI * freq_band_passed[Math.floor(i / N)]);
  return frequency;
};

export const getWav = (src: number[], SAMPLING_RATE: number) => {
  const wav = new WaveFile();
  wav.fromScratch(1, SAMPLING_RATE, "16", src);
  return wav.toBuffer();
};
