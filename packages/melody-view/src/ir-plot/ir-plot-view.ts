import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { MVVM_View } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";

export class IRPlotView extends MVVM_View<IRPlotModel, "circle"> {
  #getColor: (archetype: Archetype) => string;
  readonly x0: number;
  readonly y0: number;
  readonly w: number;
  readonly h: number;
  #x: number;
  #y: number;
  get x() { return this.#x; };
  get y() { return this.#y; };
  constructor(model: IRPlotModel) {
    super(model, "circle");
    this.#x = 0;
    this.#y = 0;
    this.w = 500;
    this.h = 500;
    this.x0 = 250;
    this.y0 = 250;
    this.svg.style.stroke = "rgb(16, 16, 16)";
    this.svg.style.strokeWidth = String(6);
    this.#getColor = get_color_of_Narmour_concept;
  }
  updateRadius(r: number) {
    this.svg.style.r = String(r);
  }
  private updateX(x: number) {
    this.#x = x;
    this.svg.style.cx = String(x * this.w / 2 + this.x0);
  }
  private updateY(y: number) {
    this.#y = y;
    this.svg.style.cy = String(y * this.h / 2 + this.y0);
  }
  private easeInOutCos(t: number): number {
    return (1 - Math.cos(t * Math.PI)) / 2;
  }
  updatePosition() {
    const interval = this.model.getInterval();
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
    const curr = get_pos(interval[0], interval[1]);
    const next = get_pos(interval[1], interval[2]);
    const r = this.easeInOutCos(this.model.getPositionRatio());
    this.updateX(-((1 - r) * curr[0] + r * next[0]));
    this.updateY(-((1 - r) * curr[1] + r * next[1]));

    /*
    // 回転補間
    const curr_radius = Math.sqrt(curr[0] * curr[0] + curr[1] * curr[1]);
    const next_radius = Math.sqrt(next[0] * next[0] + next[1] * next[1]);
    const curr_angle = Math.atan2(curr[1], curr[0]);
    const n_angle = Math.atan2(next[1], next[0]);
    const next_angle = ((curr_angle: number, n_angle: number) => {
      if (n_angle < curr_angle - Math.PI) { return n_angle + 2 * Math.PI; }
      else if (curr_angle + Math.PI < n_angle) { return n_angle - 2 * Math.PI; }
      return n_angle;
    })(curr_angle, n_angle);
    const compilation_radius = (1 - r) * curr_radius + r * next_radius;
    const compilation_angle = (1 - r) * curr_angle + r * next_angle;
    this.updateX(compilation_radius * Math.cos(compilation_angle));
    this.updateY(compilation_radius * Math.sin(compilation_angle));
    */
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.#getColor = getColor;
    this.svg.style.fill = this.#getColor(this.model.getCurrentNote().melody_analysis.implication_realization) || "rgb(0, 0, 0)";
  }
  updateColor() {
    this.svg.style.fill = this.#getColor(this.model.getCurrentNote().melody_analysis.implication_realization) || "rgb(0, 0, 0)";
  }

  onWindowResized() {
  }
}
