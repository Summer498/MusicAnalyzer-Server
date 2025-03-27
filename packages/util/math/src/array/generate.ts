export const genArr = (n: number, f: (i: number) => number) => [...Array(n)].map((_, i) => f(i));
