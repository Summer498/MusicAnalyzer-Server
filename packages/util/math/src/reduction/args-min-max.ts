import { CompareFunc } from "./compare-func";

export const argsMinMax = <T>(f: (e: T, i: number) => number, space: T[], compare: CompareFunc) => {
  let val = compare(0, 1) ? Infinity : -Infinity;
  let args: T[] = [];
  space.forEach((c, i) => {
    const v = f(c, i);
    if (compare(v, val)) { val = v; args = [c]; }
    else if (val === v) { args.push(c); }
  });
  return { val, args };
};
