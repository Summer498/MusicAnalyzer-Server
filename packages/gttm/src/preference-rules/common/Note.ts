export class Note<T> {
  readonly begin: T;
  readonly end: T;
  readonly length: T;
  get attack_point() { return this.begin; }
  // get length() { return this.end - this.begin }
  constructor(begin: T, end: T) {
    this.begin = begin;
    this.end = end;
    this.length = end;
  }
}