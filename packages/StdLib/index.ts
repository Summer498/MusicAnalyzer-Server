export const console_green = "\u001b[32m";
export const console_reset = "\u001b[0m";

export type recurrentArray<T> = T | recurrentArray<T>[];
export function Arraying<T>(e: recurrentArray<T>): T[] {
  const concat = function (arr: recurrentArray<T>[]): T[] {
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
  if (o1 == null) { return false; } // because the other is not null
  if (o2 == null) { return false; } // because the other is not null
  if (Object.keys(o1).length != Object.keys(o2).length) { return false; }
  for (const key in o1) {
    if (!(key in o2)) { return false; }
    if (typeof o1[key] === "object") {
      if (!hasSameValue(o1[key], o2[key])) { return false; } // deep check
    } else if (o1[key] != o2[key]) { return false; }
  }
  return true;
};

export class IdDictionary<Key extends keyof any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  #item2id: { [key: keyof any]: number } = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  #id2item: Key[] = [];
  get length() {
    return this.#id2item.length;
  }
  register(item: Key) {
    const id = this.#item2id[item];
    if (id !== undefined) { return id; }
    else {
      const i = this.#id2item.length;
      this.#item2id[item] = i;
      this.#id2item[i] = item;
      return i;
    }
  }
  getId(item: Key) {
    const id = this.#item2id[item];
    if (id === undefined) { throw new ReferenceError(`key ${String(item)} not found`); }
    return id;
  }
  getItem(id: number) {
    const item = this.#id2item[id];
    if (item === undefined) { throw new ReferenceError(`id ${String(id)} not found`); }
    return item;
  }
  showAll() { return this.#id2item; }
}

// エラーを期待するテストのための, 予想外のエラーを受け取った時のエラー
export class UnexpectedErrorThrownError extends Error { constructor(message = "") { super(message); } }
export class NotImplementedError extends Error { constructor(message = "") { super(message); } }

export class Assertion {
  #assertion: boolean;
  constructor(assertion: boolean) {
    this.#assertion = assertion;
  }
  onFailed(errorExecution: () => void) { this.#assertion || errorExecution(); }
}

export const assertNotNull = <T>(value: T | null) => {
  if (value === null) { throw new TypeError("null value received"); }
  return value;
};

export const assertNotUndefined = <T>(value: T | undefined) => {
  if (value === undefined) { throw new TypeError("undefined value received"); }
  return value;
};

export const assertNonNullable = <T>(value: T | null | undefined) => assertNotNull(assertNotUndefined(value));

export const assertNotNaN = (value: number) => {
  if (isNaN(value)) { throw new TypeError("NaN value received"); }
  return value;
};

export const castToNumber = (value: string) => assertNotNaN(Number(value));
