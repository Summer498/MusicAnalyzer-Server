import { octave_height } from "@music-analyzer/view-parameters";
import { RectParameters } from "@music-analyzer/view-parameters";

export class RectangleModel {
  constructor(
    private readonly prm: typeof RectParameters,
    private readonly pos: number[],
    private readonly oct: number,
    private readonly i: number,
  ) { }
  get prm_pos() { return this.prm.height * this.pos[this.i]; }
  get oct_gap() { return octave_height * this.oct; }

  get x() { return 0; }
  get y() { return this.prm_pos + this.oct_gap; }
  get w() { return this.prm.width; }
  get h() { return this.prm.height; }
}