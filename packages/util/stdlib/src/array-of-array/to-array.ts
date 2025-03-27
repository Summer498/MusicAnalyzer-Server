import { recurrentArray } from "./array-of-array";

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
