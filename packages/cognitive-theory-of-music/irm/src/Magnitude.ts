import { MagnitudeName } from "./magnitude-name";

export class Magnitude {
  readonly closure_degree;
  constructor(
    readonly name: MagnitudeName,
    readonly value: number
  ) {
    // NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
    if (name === "AA") { this.closure_degree = 1; }
    if (name === "AB") { this.closure_degree = 2; }
  }
}
