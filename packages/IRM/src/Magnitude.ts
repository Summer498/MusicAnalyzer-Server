export type MagnitudeName = "AA" | "AB";

export class Magnitude {
  readonly name;
  readonly closure_degree;
  readonly value;
  constructor(name: MagnitudeName, value: number) {
    this.name = name;
    this.value = value;
    // NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
    if (name === "AA") { this.closure_degree = 1; }
    if (name === "AB") { this.closure_degree = 2; }
  }
}
