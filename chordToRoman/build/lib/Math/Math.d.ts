declare const not: (b: boolean) => boolean;
declare const getRange: (begin: number, end: number, step?: number) => number[];
declare const getZeros: (length: number) => number[];
declare const vFunc: (a: number[], b: number | number[], f: (a: number, b: number) => number) => number[];
declare const genArr: (n: number, f: (i: number) => number) => number[];
declare const matTrans: (matrix: number[][]) => number[][];
declare const forAll: <T>(set: T[], condition: (element: T) => boolean) => boolean;
declare const forSome: <T>(set: T[], condition: (element: T) => boolean) => boolean;
declare const isSubSet: <T>(set: T[], superset: T[]) => boolean;
declare const isSuperSet: <T>(set: T[], subset: T[]) => boolean;
declare const sameArray: <T>(arr1: T[], arr2: T[]) => boolean;
/** @brief avoid bug from negative value */
declare const mod: (n: number, m: number) => number;
declare const bool2number: (b: boolean) => 1 | 0;
declare const removeFromArray: <T>(array: T[], rmv: T[]) => T[];
declare const ringShift: <T>(array: T[], b: number) => T[];
declare const vAdd: (vector1: number[], vector2: number | number[]) => number[];
declare const vSub: (vector1: number[], vector2: number | number[]) => number[];
declare const vMul: (vector1: number[], vector2: number | number[]) => number[];
declare const vDiv: (vector1: number[], vector2: number | number[]) => number[];
declare const vMod: (vector1: number[], vector2: number | number[]) => number[];
declare const vGet: <T>(array: T[], indexes: number[]) => T[];
declare const getOnehot: (positionOfOnes: number[], n?: number) => (1 | 0)[];
declare const getOnehotInMod: (positionOfOnes: number[] | number, m?: number) => (1 | 0)[];
declare const vSum: (...arrays: number[][]) => number[];
declare const totalSum: (array: number[]) => number;
declare const totalProd: (array: number[]) => number;
declare type IBMath = typeof Math;
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
declare const CMath: IMath;
export { CMath as Math };
