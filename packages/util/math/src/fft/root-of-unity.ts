import { Complex } from "./complex";

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
