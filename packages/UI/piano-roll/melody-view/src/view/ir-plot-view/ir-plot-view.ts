import { IRPlotModel } from "../../model";
import { IRPlotViewModel } from "./ir-plot-view-model";
import { ColorChangeable } from "../color-changeable";

const get_pos = (_x: number, _y: number) => {
  const a = 1 / 3;
  const x = a * _x;
  const y = a * _y;
  const double_angle_x = x * x - y * y;
  const double_angle_y = 2 * x * y;
  const r2 = 1 + x * x + y * y;
  return [
    double_angle_x / r2,
    double_angle_y / r2
  ];
};

export class IRPlotView
  extends ColorChangeable<"circle"> {
  readonly view_model: IRPlotViewModel
  constructor(
    protected readonly model: IRPlotModel,
  ) {
    super("circle");
    this.svg.style.stroke = "rgb(16, 16, 16)";
    this.svg.style.strokeWidth = String(6);
    this.view_model = new IRPlotViewModel()
  }
  updateRadius(r: number) {
    this.svg.style.r = String(r);
  }
  private updateX(x: number) {
    this.svg.setAttribute("cx", String(this.view_model.getTranslatedX(x)))
  }
  private updateY(y: number) {
    this.svg.setAttribute("cy", String(this.view_model.getTranslatedY(y)))
  }
  private easeInOutCos(t: number): number {
    return (1 - Math.cos(t * Math.PI)) / 2;
  }
  updatePosition() {
    const interval = this.model.getInterval();
    const curr = get_pos(interval[0], interval[1]);
    const next = get_pos(interval[1], interval[2]);
    const r = this.easeInOutCos(this.model.getPositionRatio());
    this.updateX(-((1 - r) * curr[0] + r * next[0]));
    this.updateY(-((1 - r) * curr[1] + r * next[1]));
  }
}
