export const cosineWindow = (e: number, i: number, arr: number[]) => {
  const N = arr.length;
  return e * Math.sin(Math.PI * i / (N - 1));
};
