export type DirectionName = "mL" | "mN" | "mR"

export class Direction {
  readonly name;
  readonly closure_degree;
  readonly value;
  constructor(name: DirectionName, value: number) {
    this.name = name;
    this.value = value;
    // NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
    if (name === "mL") { this.closure_degree = 1; }
    if (name === "mN") { this.closure_degree = 0; }
    if (name === "mR") { this.closure_degree = -1; }
  }
}
