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
