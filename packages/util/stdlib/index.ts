export const console_green = "\u001b[32m";
export const console_reset = "\u001b[0m";

export const _throw = <E extends Error>(e: E) => { throw e; };  // 文の式化
export const assertNotNull = <T>(value: T | null, error = new TypeError("null value received")) => value !== null ? value : _throw(error);
export const assertNotUndefined = <T>(value: T | undefined, error = new TypeError("undefined value received")) => value !== undefined ? value : _throw(error);
export const assertNonNullable = <T>(value: T | null | undefined) => assertNotNull(assertNotUndefined(value));
export const assertNotNaN = (value: number) => isNaN(value) ? _throw(new TypeError("NaN value received")) : value;
export const castToNumber = (value: string) => assertNotNaN(Number(value));
export const unique = <T>(arr: T[]) => Array.from(new Set(arr));
export const getLowerCase = (str: string) => str.toLowerCase();
export const getCapitalCase = (str: string) => str[0].toUpperCase().concat(str.slice(1));


export type recurrentArray<T> = T | recurrentArray<T>[];
export function Arraying<T>(e: recurrentArray<T>) {
  const concat = function (arr: recurrentArray<T>[]) {
    let res: T[] = [];
    for (const e of arr) {
      res = res.concat(Arraying(e));
    }
    return res;
  };
  return e instanceof Array ? concat(e) : [e];
}

// 引数には any が入る.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasSameValue = (o1: any, o2: any) => {
  if (o1 === o2) { return true; } // same object
  if (o1 === null) { return false; } // because the other is not null
  if (o2 === null) { return false; } // because the other is not null
  if (Object.keys(o1).length != Object.keys(o2).length) { return false; }
  for (const key in o1) {
    if (!(key in o2)) { return false; }
    if (typeof o1[key] === "object") {
      if (!hasSameValue(o1[key], o2[key])) { return false; } // deep check
    } else if (o1[key] != o2[key]) { return false; }
  }
  return true;
};

export class NotImplementedError 
  extends Error { constructor(message = "") { super(message); } }
export class Assertion {
  #assertion: boolean;
  constructor(assertion: boolean) {
    this.#assertion = assertion;
  }
  onFailed(errorExecution: () => void) { this.#assertion || errorExecution(); }
}

