import { getRange } from "@music-analyzer/math";

// DATA_SAMPLING_RATE 刻みのデータをサンプリング周波数に合わせる
export const getFrequency = (
  freq: number[],
  SAMPLING_RATE: number,
  DATA_SAMPLING_RATE:number
) => {
  const N = SAMPLING_RATE / DATA_SAMPLING_RATE;
  const size = Math.floor(freq.length * N);
  const frequency = getRange(0, size).map(i => 2 * 2 * Math.PI * freq[Math.floor(i / N)]);
  return frequency;
};
