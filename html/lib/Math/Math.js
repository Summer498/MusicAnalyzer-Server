import { hasSameValue } from "../StdLib/stdlib.js";
export const not = (b) => !b;
export const getRange = (begin, end, step = 1) => [...Array(Math.abs(end - begin))].map((_, i) => i * step + begin);
export const getZeros = (length) => [...Array(length)].map(e => 0); // eslint-disable-line @typescript-eslint/no-unused-vars
export const vFunc = (a, b, f) => {
    if (typeof b == "number") {
        return a.map(e => f(e, Number(b)));
    }
    if (b instanceof Array) {
        return a.map((_, i) => f(a[i], b[i]));
    }
    throw TypeError("arguments of vFunc must be (a:number[], b:number, f:(a:number,b:number)=>number");
};
export const genArr = (n, f) => [...Array(n)].map((_, i) => f(i));
export const matTrans = (matrix) => getRange(0, matrix[0].length).map(i => getRange(0, matrix.length).map(j => matrix[j][i]));
export const forAll = (set, condition) => {
    for (const e of set) {
        if (condition(e) == false) {
            return false;
        }
    }
    return true;
};
export const forSome = (set, condition) => {
    for (const e of set) {
        if (condition(e)) {
            return true;
        }
    }
    return false;
};
export const isSubSet = (set, superset) => {
    return forAll(set, (e) => superset.includes(e));
};
export const isSuperSet = (set, subset) => {
    return isSubSet(subset, set);
};
export const sameArray = (arr1, arr2) => hasSameValue(arr1, arr2);
/** @brief avoid bug from negative value */
export const mod = (n, m) => (Number(n) % m + m) % m;
export const bool2number = (b) => b ? 1 : 0;
export const removeFromArray = (array, rmv) => array.filter(e => not(rmv.includes(e)));
export const ringShift = (array, b) => {
    const N = array.length;
    const bm = mod(b, N);
    return array.concat(array).slice(N - bm, 2 * N - bm);
};
export const vAdd = (vector1, vector2) => vFunc(vector1, vector2, (a, b) => a + b);
export const vSub = (vector1, vector2) => vFunc(vector1, vector2, (a, b) => a - b);
export const vMul = (vector1, vector2) => vFunc(vector1, vector2, (a, b) => a * b);
export const vDiv = (vector1, vector2) => vFunc(vector1, vector2, (a, b) => a / b);
export const vMod = (vector1, vector2) => vFunc(vector1, vector2, (a, b) => mod(a, b));
export const vGet = (array, indexes) => indexes.map(e => array[e]);
export const getOnehot = (positionOfOnes, n = 0) => [...Array(Math.max(Math.max(...positionOfOnes) + 1, n))].map((_, i) => bool2number(positionOfOnes.includes(i)));
export const getOnehotInMod = (positionOfOnes, m = 1) => {
    if (typeof positionOfOnes === "number") {
        return getOnehot(vMod([positionOfOnes], m), m);
    }
    return getOnehot(vMod(positionOfOnes, m), m);
};
export const vSum = (...arrays) => {
    let s = getZeros(arrays[0].length);
    arrays.forEach(arr => { s = vAdd(s, arr); });
    return s;
};
export const totalSum = (array) => {
    let s = 0;
    array.forEach(e => s += e);
    return s;
};
export const totalProd = (array) => {
    let s = 0;
    array.forEach(e => s *= e);
    return s;
};
// concrete Math
const CMath = {
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
