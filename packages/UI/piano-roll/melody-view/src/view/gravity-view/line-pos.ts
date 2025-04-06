export class LinePos {
  constructor(
    readonly x1: number,
    readonly x2: number,
    readonly y1: number,
    readonly y2: number,
  ) { }

  scaled(w: number, h: number) {
    return new LinePos(
      this.x1 * w,
      this.x2 * w,
      this.y1 * h,
      this.y2 * h,
    )
  }
  getAngle() {
    const w = this.x2 - this.x1;
    const h = this.y2 - this.y1;
    return Math.atan2(h, w) * 180 / Math.PI;
  }
};
