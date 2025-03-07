import { hasSameValue } from "@music-analyzer/stdlib";

export const not = (b: boolean): boolean => !b;
export const getRange = (begin: number, end: number, step = 1): number[] => [...Array(Math.abs(end - begin))].map((_, i) => i * step + begin);
export const getZeros = (length: number): number[] => [...Array(length)].map(e => 0); // eslint-disable-line @typescript-eslint/no-unused-vars
export const vFunc = (
  a: number[],
  b: number | number[],
  f: (a: number, b: number) => number,
) => {
  if (typeof b == "number") { return a.map(e => f(e, Number(b))); }
  if (b instanceof Array) { return a.map((_, i) => f(a[i], b[i])); }
  throw TypeError("arguments of vFunc must be (a:number[], b:number, f:(a:number,b:number)=>number",);
};

export const genArr = (n: number, f: (i: number) => number) => [...Array(n)].map((_, i) => f(i));
export const matTrans = (matrix: number[][]) => getRange(0, matrix[0].length).map(i => getRange(0, matrix.length).map(j => matrix[j][i]),);
export const forAll = <T>(set: T[], condition: (element: T) => boolean) => {
  for (const e of set) {
    if (condition(e) == false) { return false; }
  }
  return true;
};
export const forSome = <T>(set: T[], condition: (element: T) => boolean) => {
  for (const e of set) {
    if (condition(e)) { return true; }
  }
  return false;
};
export const isSubSet = <T>(set: T[], superset: T[]) => forAll(set, e => superset.includes(e));
export const isSuperSet = <T>(set: T[], subset: T[]) => isSubSet(subset, set);
export const sameArray = <T>(arr1: T[], arr2: T[]) => hasSameValue(arr1, arr2);

/** @brief avoid bug from negative value */
export const mod = (x: number, m: number): number => (x % m + m) % m;
export const decimal = (x: number) => x - Math.floor(x);
export const bool2number = (b: boolean) => b ? 1 : 0;
export const square = (x: number) => x * x;
export const intPow = (b: number, p: number): number => p ? square(intPow(b, p >> 1)) * (p & 1 ? b : 1) : 1;
export const removeFromArray = <T>(array: T[], rmv: T[]) => array.filter(e => not(rmv.includes(e)));
export const ringShift = <T>(array: T[], b: number) => {
  const N = array.length;
  const bm = mod(b, N);
  return array.concat(array).slice(N - bm, 2 * N - bm);
};
export const vAdd = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a + b);
export const vSub = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a - b);
export const vMul = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a * b);
export const vDiv = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a / b);
export const vMod = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => mod(a, b));
export const vGet = <T>(array: T[], indexes: number[]) => indexes.map(e => array[e]);

export const max = (array: number[]) => array.reduce((p, c) => Math.max(p, c));
export const min = (array: number[]) => array.reduce((p, c) => Math.min(p, c));
export const argmax = (array: number[]) => array.map((e, i) => [e, i]).reduce((p, c) => c[0] >= p[0] ? c : p)[1];
export const argmin = (array: number[]) => array.map((e, i) => [e, i]).reduce((p, c) => c[0] <= p[0] ? c : p)[1];
export type CompareFunc = (a: number, b: number) => boolean;
export class Compare {
  static readonly findMin: CompareFunc = (a, b) => a < b;
  static readonly findMax: CompareFunc = (a, b) => a > b;
}
export const argsMinMax = <T>(f: (e: T, i: number) => number, space: T[], compare: CompareFunc,) => {
  let val = compare(0, 1) ? Infinity : -Infinity;
  let args: T[] = [];
  space.forEach((c, i) => {
    const v = f(c, i);
    if (compare(v, val)) { val = v; args = [c]; }
    else if (val === v) { args.push(c); }
  });
  return { val, args };
};



export const getOnehot = (positionOfOnes: number[], n = 0) => [...Array(Math.max(Math.max(...positionOfOnes) + 1, n))].map((_, i) => bool2number(positionOfOnes.includes(i)),);
export const getOnehotInMod = (positionOfOnes: number[] | number, m = 1) => {
  if (typeof positionOfOnes === "number") { return getOnehot(vMod([positionOfOnes], m), m); }
  return getOnehot(vMod(positionOfOnes, m), m);
};

export const vSum = (...arrays: number[][]) => arrays.reduce((p, c) => vAdd(p, c));
export const totalSum = (array: number[]) => array.reduce((p, c) => p + c);
export const totalProd = (array: number[]) => array.reduce((p, c) => p * c);
export const squareSum = (array: number[]) => [0, ...array].reduce((p, c) => p + c * c);
export const average = (array: number[]) => totalSum(array) / array.length;
export const variant = (array: number[]) => squareSum(array) / array.length - square(average(array));
export const median = (array: number[]) => ((sorted, H) => (sorted[Math.floor(H)] + sorted[Math.ceil(H)]) / 2)(array.sort(), array.length / 2);

// 正規乱数を生成
export const normal_rand = (m: number, s: number) => {
  const r = Math.sqrt(-2 * Math.log(Math.random()));
  const t = 2 * Math.PI * Math.random();
  return [r * Math.cos(t), r * Math.sin(t)];
};

export { Complex, fft, ifft, convolution, correlation, } from "./fft";