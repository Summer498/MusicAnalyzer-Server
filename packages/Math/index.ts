import { hasSameValue } from "../StdLib";

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
export const mod = (n: number, m: number): number => (Number(n) % m + m) % m;
export const bool2number = (b: boolean) => b ? 1 : 0;
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

export const getOnehot = (positionOfOnes: number[], n = 0) => [...Array(Math.max(Math.max(...positionOfOnes) + 1, n))].map((_, i) => bool2number(positionOfOnes.includes(i)),);
export const getOnehotInMod = (positionOfOnes: number[] | number, m = 1) => {
  if (typeof positionOfOnes === "number") { return getOnehot(vMod([positionOfOnes], m), m); }
  return getOnehot(vMod(positionOfOnes, m), m);
};

export const vSum = (...arrays: number[][]) => arrays.reduce((p, c) => vAdd(p, c));
export const totalSum = (array: number[]) => array.reduce((p, c) => p + c);
export const totalProd = (array: number[]) => array.reduce((p, c) => p * c);

// ---------- below: process of export ---------- //

// interface of Base Math
type IBMath = typeof Math;

// Interface of Math
interface IMath extends IBMath {
  not: typeof not;
  getRange: typeof getRange;
  getZeros: typeof getZeros;
  vFunc: typeof vFunc;
  /**
   * @brief generate array
   * @param n count of elements
   * @param f generate function like (i => i*2)
   * @return generated array
   * @detail Given n = 5, f = i=>10*i, genArr generates [0,10,20,30,40]
   */
  genArr: typeof genArr;
  matTrans: typeof matTrans;
  forAll: typeof forAll;
  forSome: typeof forSome;
  isSubSet: typeof isSubSet;
  isSuperSet: typeof isSuperSet;
  sameArray: typeof sameArray;
  mod: typeof mod;
  bool2number: typeof bool2number;
  removeFromArray: typeof removeFromArray;
  ringShift: typeof ringShift;
  vAdd: typeof vAdd;
  vSub: typeof vSub;
  vMul: typeof vMul;
  vDiv: typeof vDiv;
  vMod: typeof vMod;
  vGet: typeof vGet;
  getOnehot: typeof getOnehot;
  getOnehotInMod: typeof getOnehotInMod;
  vSum: typeof vSum;
  totalSum: typeof totalSum;
  totalProd: typeof totalProd;
}

// concrete Math
const CMath: IMath = {
  ...Math,
  not,
  getRange,
  getZeros,
  vFunc,
  genArr,
  matTrans,
  forAll,
  forSome,
  isSubSet,
  isSuperSet,
  sameArray,
  mod,
  bool2number,
  removeFromArray,
  ringShift,
  vAdd,
  vSub,
  vMul,
  vDiv,
  vMod,
  vGet,
  getOnehot,
  getOnehotInMod,
  vSum,
  totalSum,
  totalProd,
};
export { CMath as Math };
