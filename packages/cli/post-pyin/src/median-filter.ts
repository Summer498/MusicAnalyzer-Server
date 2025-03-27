import { median } from "@music-analyzer/math/src/stochastic/median";

export class MedianFilter {
  i;
  buff: number[];
  constructor(
    readonly window_size: number,
  ) {
    this.i = 0;
    this.buff = [];
  }
  median(e: number | null) {
    // i が 1 ずつ上がる想定
    if (e === null) {
      // バッファ初期化
      this.i = 0;
      this.buff = [];
      return null;
    }

    if (this.buff.length < this.window_size) { this.buff.push(e); }
    else {
      // リングバッファに保存
      this.i = (this.i + 1) % this.window_size;
      this.buff[this.i] = e;
    }
    return median(this.buff);
  }
}
