import { getRange } from "@music-analyzer/math";
import { MedianFilter } from "./median-filter";

export const getMedianFrequency = (freq_rounded: number[]) => {
  // 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
  const WINDOW_SIZE = 25;
  const median_filter = new MedianFilter(freq_rounded, WINDOW_SIZE);
  return getRange(0, freq_rounded.length).map(i => median_filter.median(i));
};
