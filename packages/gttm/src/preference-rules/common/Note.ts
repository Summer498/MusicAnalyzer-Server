export class Note<T> {
  readonly length: T;
  get attack_point() { return this.begin; }
  // get length() { return this.end - this.begin }
  constructor(
    readonly begin: T,
    readonly end: T,
  ) {
    this.length = end;
  }
}