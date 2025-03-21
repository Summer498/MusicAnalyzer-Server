import { getRange } from "@music-analyzer/math";
import { SAMPLING_RATE } from "./util";

// DATA_SAMPLING_RATE 刻みのデータをサンプリング周波数に合わせる
export const getFrequency = (freq_band_passed: number[]) => {
  const DATA_SAMPLING_RATE = Math.floor(44100 / 512);
  const N = SAMPLING_RATE / DATA_SAMPLING_RATE;
  const size = Math.floor(freq_band_passed.length * SAMPLING_RATE / DATA_SAMPLING_RATE);
  const frequency = getRange(0, size).map(i => 2 * 2 * Math.PI * freq_band_passed[Math.floor(i / N)]);
  return frequency;
};
