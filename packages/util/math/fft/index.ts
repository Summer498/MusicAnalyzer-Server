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

export class RootOfUnity {
  private readonly exponent_cache: Complex<number>[][];
  private readonly modulo_cache: number[][];
  constructor() {
    this.exponent_cache = [];
    this.modulo_cache = [];
  }
  exponent(k: number, N: number) {
    const x = -2 * Math.PI * (k / N);
    this.exponent_cache[N] ||= [];
    this.exponent_cache[N][k] ||= new Complex(Math.cos(x), Math.sin(x));
    return this.exponent_cache[N][k];
  }
  modulo(k: number, N: number, modulo: number) {
    const root = modulo - 1;
    this.modulo_cache[N] ||= [];
    this.modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo;
    return this.exponent_cache[N][k];

  }
};


const fft_core = <T extends number>(
  seq: Complex<number>[],
  root_of_unity: RootOfUnity,
): Complex<number>[] => {
  const N = seq.length;
  const res: Complex<number>[] = [];

  if (N == 1) { return seq; }

  const X_evens = fft_core(seq.filter((_, i) => i % 2 === 0), root_of_unity);
  const X_odds = fft_core(seq.filter((_, i) => i % 2 == 1), root_of_unity);

  for (let k = 0; k < N / 2; k++) {
    const evens = X_evens[k];
    const rotated_odds = X_odds[k].mlt(root_of_unity.exponent(k, N));
    res[k] = evens.add(rotated_odds);
    res[k + N / 2] = evens.sub(rotated_odds);
  }
  return res;
};

// real number fft
// thanks for fft-js
export const fft = <T extends number>(seq: Complex<number>[]): Complex<number>[] => {
  const N = Math.pow(2, Math.ceil(Math.log2(seq.length)));
  // zero padding
  while (seq.length < N) {
    seq.push(new Complex<number>(0, 0));
  }
  return fft_core(seq, new RootOfUnity());
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
