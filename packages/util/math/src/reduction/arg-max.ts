export const argmax = (array: number[]) => array
  .map((e, i) => [e, i])
  .reduce((p, c) => c[0] >= p[0] ? c : p)[1];
