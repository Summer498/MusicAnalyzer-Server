import { getRange } from "@music-analyzer/math";

// 1/100[s] 刻みのデータをサンプリング周波数に合わせる
export const getFrequency = (freq_band_passed: number[], SAMPLING_RATE: number) => {
  const CSV_SAMPLING_RATE = 100;
  const N = SAMPLING_RATE / CSV_SAMPLING_RATE;
  const size = Math.floor(freq_band_passed.length * SAMPLING_RATE / CSV_SAMPLING_RATE);
  const frequency = getRange(0, size).map(i => 2 * Math.PI * freq_band_passed[Math.floor(i / N)]);
  return frequency;
};
