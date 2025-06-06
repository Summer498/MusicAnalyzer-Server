import { median } from "@music-analyzer/math";

export interface MedianFilter {
  median(i: number): number;
}

export const createMedianFilter = (
  initializer: number[],
  window_size: number,
): MedianFilter => {
  const buff = initializer.slice(0, window_size);
  const array = initializer;
  return {
    median(i: number) {
      buff[i % window_size] = array[i];  // リングバッファに保存
      return median(buff);
    },
  };
};
