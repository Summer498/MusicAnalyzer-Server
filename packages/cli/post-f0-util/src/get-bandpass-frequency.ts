import { bandpass } from "./util";

export const getBandpassFrequency = (freq_median_filtered: number[]) => {
  const LOW = 220; // hz
  const HIGH = 880; // hz
  // バンドパスで低すぎる/高すぎる音を除く
  return freq_median_filtered.map(freq => bandpass(freq, LOW, HIGH));
};
