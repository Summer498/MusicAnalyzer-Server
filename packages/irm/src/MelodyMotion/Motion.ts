import { Direction } from "../Direction";
import { Magnitude } from "../Magnitude";

export class Motion {
  readonly direction;
  readonly magnitude;
  readonly closure: 0 | 1;
  constructor(dir: Direction, mgn: Magnitude) {
    this.direction = dir;
    this.magnitude = mgn;
    this.closure = dir.name === "mL" && mgn.name === "AB" ? 1 : 0;
  }
}