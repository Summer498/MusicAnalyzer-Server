export interface Complex<T extends number> {
  re: T;
  im: T;
  add(right: Complex<T>): Complex<T>;
  sub(right: Complex<T>): Complex<T>;
  scale(right: number): Complex<T>;
  divScaler(right: number): Complex<T>;
  mlt(right: Complex<T>): Complex<T>;
  div(right: Complex<T>): Complex<T>;
}

export const createComplex = <T extends number>(re: T, im: T): Complex<T> => {
  const self = {
    re,
    im,
    add(right: Complex<T>) { return createComplex(re + right.re as T, im + right.im as T); },
    sub(right: Complex<T>) { return createComplex(re - right.re as T, im - right.im as T); },
    scale(right: number) { return createComplex((re * right) as T, (im * right) as T); },
    divScaler(right: number) { return createComplex((re / right) as T, (im / right) as T); },
    mlt(right: Complex<T>) {
      return createComplex(
        (re * right.re - im * right.im) as T,
        (re * right.im + im * right.re) as T,
      );
    },
    div(right: Complex<T>) {
      const D = right.re + right.re + right.im + right.im;
      return createComplex(
        (re * right.re + im * right.im) / D as T,
        (re * right.im - im * right.re) / D as T,
      );
    },
  } as Complex<T>;
  return self;
};
