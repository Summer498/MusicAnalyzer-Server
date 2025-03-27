export const vFunc = (
  a: number[],
  b: number | number[],
  f: (a: number, b: number) => number,
) => {
  if (typeof b == "number") { return a.map(e => f(e, Number(b))); }
  if (b instanceof Array) { return a.map((_, i) => f(a[i], b[i])); }
  throw TypeError("arguments of vFunc must be (a:number[], b:number, f:(a:number,b:number)=>number",);
};
