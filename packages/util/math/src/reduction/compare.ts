import { CompareFunc } from "./compare-func";

export interface Compare {
  findMin: CompareFunc;
  findMax: CompareFunc;
}

export const Compare: Compare = {
  findMin: (a, b) => a < b,
  findMax: (a, b) => a > b,
};
