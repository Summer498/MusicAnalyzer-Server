export class IRPlotViewModel {
  readonly x0: number;
  readonly y0: number;
  readonly w: number;
  readonly h: number;
  constructor() {
    this.w = 500;
    this.h = 500;
    this.x0 = 250;
    this.y0 = 250;
  }
  getTranslatedX(x: number) { return x * this.w / 2 + this.x0; }
  getTranslatedY(y: number) { return y * this.h / 2 + this.y0; }
}