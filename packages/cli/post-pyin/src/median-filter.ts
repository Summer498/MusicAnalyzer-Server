import { median } from "@music-analyzer/math";

export interface MedianFilter {
  median(e: number | null): number | null;
}

export const createMedianFilter = (
  window_size: number,
): MedianFilter => {
  let i = 0;
  let buff: number[] = [];
  return {
    median(e: number | null) {
      // i が 1 ずつ上がる想定
      if (e === null) {
        // バッファ初期化
      i = 0;
      buff = [];
        return null;
      }

    if (buff.length < window_size) { buff.push(e); }
    else {
      // リングバッファに保存
      i = (i + 1) % window_size;
      buff[i] = e;
    }
    return median(buff);
    },
  };
};
