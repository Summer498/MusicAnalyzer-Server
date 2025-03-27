import { CompareFunc } from "./compare-func";

export class Compare {
  static readonly findMin: CompareFunc = (a, b) => a < b;
  static readonly findMax: CompareFunc = (a, b) => a > b;
}
