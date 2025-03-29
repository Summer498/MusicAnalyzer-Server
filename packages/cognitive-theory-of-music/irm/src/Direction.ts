import { DirectionName } from "./direction-name";

export class Direction {
  readonly closure_degree;
  constructor(
    readonly name: DirectionName,
    readonly value: number
  ) {
    // NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
    if (name === "mL") { this.closure_degree = 1; }
    if (name === "mN") { this.closure_degree = 0; }
    if (name === "mR") { this.closure_degree = -1; }
  }
}
