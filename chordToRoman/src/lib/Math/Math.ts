import { hasSameValue } from "../StdLib/stdlib.js";

const not = (b: boolean): boolean => !b;
const getRange = (begin: number, end: number, step = 1): number[] => [...Array(Math.abs(end - begin))].map((_, i) => i * step + begin);
const getZeros = (length: number): number[] => [...Array(length)].map(e => 0);  // eslint-disable-line @typescript-eslint/no-unused-vars
const vFunc = (a: number[], b: number | number[], f: (a: number, b: number) => number) => {
    if (typeof b == "number") { return a.map(e => f(e, Number(b))); }
    if (b instanceof Array) { return a.map((_, i) => f(a[i], b[i])); }
    throw TypeError("arguments of vFunc must be (a:number[], b:number, f:(a:number,b:number)=>number");
};

const genArr = (n: number, f: (i: number) => number) => [...Array(n)].map((_, i) => f(i));
const matTrans = (matrix: number[][]) => getRange(0, matrix[0].length).map(i => getRange(0, matrix.length).map(j => matrix[j][i]));
const forAll = <T>(set: T[], condition: (element: T) => boolean) => {
    for (const e of set) { if (condition(e) == false) { return false; } }
    return true;
};
const forSome = <T>(set: T[], condition: (element: T) => boolean) => {
    for (const e of set) { if (condition(e)) { return true; } }
    return false;
};
const isSubSet = <T>(set: T[], superset: T[]) => {
    return forAll(set, (e) => superset.includes(e));
};
const isSuperSet = <T>(set: T[], subset: T[]) => {
    return isSubSet(subset, set);
};

const sameArray = <T>(arr1: T[], arr2: T[]) => hasSameValue(arr1, arr2);

/** @brief avoid bug from negative value */
const mod = (n: number, m: number): number => (Number(n) % m + m) % m;
const bool2number = (b: boolean) => b ? 1 : 0;
const removeFromArray = <T>(array: T[], rmv: T[]) => array.filter(e => not(rmv.includes(e)));
const ringShift = <T>(array: T[], b: number) => {
    const N = array.length; const bm = mod(b, N);
    return array.concat(array).slice(N - bm, 2 * N - bm);
};
const vAdd = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a + b);
const vSub = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a - b);
const vMul = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a * b);
const vDiv = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => a / b);
const vMod = (vector1: number[], vector2: number | number[]) => vFunc(vector1, vector2, (a, b) => mod(a, b));
const vGet = <T>(array: T[], indexes: number[]) => indexes.map(e => array[e]);

const getOnehot = (positionOfOnes: number[], n = 0) => [...Array(Math.max(Math.max(...positionOfOnes) + 1, n))].map((_, i) => bool2number(positionOfOnes.includes(i)));
const getOnehotInMod = (positionOfOnes: number[] | number, m = 1) => {
    if (typeof positionOfOnes === "number") { return getOnehot(vMod([positionOfOnes], m), m); }
    return getOnehot(vMod(positionOfOnes, m), m);
};

const vSum = (...arrays: number[][]) => {
    let s: number[] = getZeros(arrays[0].length);
    arrays.forEach(arr => { s = vAdd(s, arr); });
    return s;
};
const totalSum = (array: number[]) => {
    let s = 0;
    array.forEach(e => s += e);
    return s;
};
const totalProd = (array: number[]) => {
    let s = 0;
    array.forEach(e => s *= e);
    return s;
};

// ---------- below: process of export ---------- //

// interface of Base Math
type IBMath = typeof Math;

// Interface of Math
interface IMath extends IBMath {
    not: typeof not;
    getRange: typeof getRange
    getZeros: typeof getZeros
    vFunc: typeof vFunc
    /**
     * @brief generate array
     * @param n count of elements
     * @param f generate function like (i => i*2)
     * @return generated array
     * @detail Given n = 5, f = i=>10*i, genArr generates [0,10,20,30,40]
     */
    genArr: typeof genArr
    matTrans: typeof matTrans
    forAll: typeof forAll
    forSome: typeof forSome
    isSubSet: typeof isSubSet
    isSuperSet: typeof isSuperSet
    sameArray: typeof sameArray
    mod: typeof mod
    bool2number: typeof bool2number
    removeFromArray: typeof removeFromArray
    ringShift: typeof ringShift
    vAdd: typeof vAdd
    vSub: typeof vSub
    vMul: typeof vMul
    vDiv: typeof vDiv
    vMod: typeof vMod
    vGet: typeof vGet
    getOnehot: typeof getOnehot
    getOnehotInMod: typeof getOnehotInMod
    vSum: typeof vSum
    totalSum: typeof totalSum
    totalProd: typeof totalProd
}

// concrete Math
const CMath: IMath = {
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

    // 組み込み Math オブジェクトからの継承
    clz32: Math.clz32,
    imul: Math.imul,
    sign: Math.sign,
    log10: Math.log10,
    log2: Math.log2,
    log1p: Math.log1p,
    expm1: Math.expm1,
    cosh: Math.cosh,
    sinh: Math.sinh,
    tanh: Math.tanh,
    acosh: Math.acosh,
    asinh: Math.asinh,
    atanh: Math.atanh,
    hypot: Math.hypot,
    trunc: Math.trunc,
    fround: Math.fround,
    cbrt: Math.cbrt,

    E: Math.E,
    LN10: Math.LN10,
    LN2: Math.LN2,
    LOG2E: Math.LOG2E,
    LOG10E: Math.LOG10E,
    PI: Math.PI,
    SQRT1_2: Math.SQRT1_2,
    SQRT2: Math.SQRT2,
    abs: Math.abs,
    acos: Math.acos,
    asin: Math.asin,
    atan: Math.atan,
    atan2: Math.atan2,
    ceil: Math.ceil,
    cos: Math.cos,
    exp: Math.exp,
    floor: Math.floor,
    log: Math.log,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    random: Math.random,
    round: Math.round,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    [Symbol.toStringTag]: "Math"
};
export { CMath as Math };