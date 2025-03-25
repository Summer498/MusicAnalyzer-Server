import { WindowReflectable } from "@music-analyzer/view";
import { RectParameters } from "@music-analyzer/view-parameters";
import { RectangleView } from "./rectangle-view";
import { RectangleModel } from "./rectangle-model";
export { RectangleModel } from "./rectangle-model";

export abstract class Rectangle implements WindowReflectable {
  readonly model: RectangleModel;
  readonly view: RectangleView;
  get svg() { return this.view.svg; }
  constructor(
    id: string,
    protected readonly prm: typeof RectParameters,
    protected readonly pos: number[],
    oct: number,
    i: number,
  ) {
    this.model = new RectangleModel(prm, pos, oct, i);
    this.view = new RectangleView(id, prm);
  }

  protected get prm_pos() { return this.model.prm_pos }
  protected get oct_gap() { return this.model.oct_gap; }

  onWindowResized() {
    this.view.setX(this.model.x);
    this.view.setY(this.model.y);
    this.view.setW(this.model.w);
    this.view.setH(this.model.h);
  }
}