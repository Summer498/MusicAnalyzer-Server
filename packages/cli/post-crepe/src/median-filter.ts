import { median } from "@music-analyzer/math/src/stochastic/median";

export class MedianFilter {
  readonly buff;
  readonly array;
  constructor(
    initializer: number[],
    readonly window_size: number,
  ) {
    this.buff = initializer.slice(0, window_size);
    this.array = initializer;
  }
  median(i: number) {
    this.buff[i % this.window_size] = this.array[i];  // リングバッファに保存
    return median(this.buff);
  }
}
