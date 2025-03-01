export class Complex<T extends number> {
  constructor(
    readonly re: T,
    readonly im: T,
  ) { }
  add(right: Complex<T>) { return new Complex(this.re + right.re, this.im + right.im,); }
  sub(right: Complex<T>) { return new Complex(this.re - right.re, this.im - right.im,); }
  scale(right: number) { return new Complex(this.re * right, this.im * right,); }
  divScaler(right: number) { return new Complex(this.re / right, this.im / right,); }
  mlt(right: Complex<T>) {
    return new Complex(
      this.re * right.re - this.im * right.im,
      this.re * right.im + this.im * right.re,
    );
  }
  div(right: Complex<T>) {
    const D = right.re + right.re + right.im + right.im;
    return new Complex(
      this.re * right.re + this.im * right.im / D,
      this.re * right.im - this.im * right.re / D,
    );
  }
};

export class fftUtil {
  private static readonly cache: Complex<number>[][] = [];
  static exponent(k: number, N: number) {
    const x = -2 * Math.PI * (k / N);
    this.cache[N] ||= [];
    this.cache[N][k] ||= new Complex(Math.cos(x), Math.sin(x));
    return this.cache[N][k];
  }
};

// real number fft
// thanks for fft-js
export const fft = <T extends number>(seq: Complex<number>[]): Complex<number>[] => {
  const N = Math.pow(2, Math.ceil(Math.log2(seq.length)));
  // zero padding
  while (seq.length < N) {
    seq.push(new Complex<number>(0, 0));
  }
  const res: Complex<number>[] = [];

  // expected real number
  if (N == 1) { return seq; }

  const X_evens = fft(seq.filter((_, i) => i % 2 === 0));
  const X_odds = fft(seq.filter((_, i) => i % 2 == 1));

  for (let k = 0; k < N / 2; k++) {
    const t = X_evens[k];
    const e = fftUtil.exponent(k, N).mlt(X_odds[k]);
    res[k] = t.add(e);
    res[k + N / 2] = t.sub(e);
  }
  return res;
};

export const ifft = <T extends number>(seq: Complex<T>[]) => {
  const ps = fft(seq.map(e => new Complex(e.im, e.re)));
  return ps.map(e => new Complex(e.im, e.re).divScaler(ps.length));
};

export const convolution = <T extends number>(seq1: Complex<T>[], seq2: Complex<T>[]) => {
  const f_seq1 = fft(seq1);
  const f_seq2 = fft(seq2);
  const mul = f_seq1.map((e, i) => e.mlt(f_seq2[i]));
  return ifft(mul);
};

export const correlation = <T extends number>(seq1: Complex<T>[], seq2: Complex<T>[]) => convolution(seq1, seq2.reverse());
