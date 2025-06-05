import { createMedianFilter } from "./median-filter";

export const getMedianFrequency = (freq_rounded: (number | null)[]) => {
  // 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
  const WINDOW_SIZE = 25;
  const median_filter = createMedianFilter(WINDOW_SIZE);
  return freq_rounded.map(e => median_filter.median(e));
};
