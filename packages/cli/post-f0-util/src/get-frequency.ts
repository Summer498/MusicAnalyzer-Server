import { getRange } from "@music-analyzer/math";

// DATA_SAMPLING_RATE 刻みのデータをサンプリング周波数に合わせる
export const getFrequency = (
  freq: number[],
  N:number
) => {
  const size = Math.floor(freq.length * N);
  const frequency = getRange(0, size).map(i => 2 * 2 * Math.PI * freq[Math.floor(i / N)]);
  return frequency;
};
