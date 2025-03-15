type F32V = Float32Array<ArrayBuffer>

export class RootOfUnity {
  private readonly exponent_cache: [number, number][][];
  private readonly modulo_cache: number[][];
  constructor() {
    this.exponent_cache = [];
    this.modulo_cache = [];
  }
  exponent(k: number, N: number) {
    const x = -2 * Math.PI * (k / N);
    this.exponent_cache[N] ||= [];
    this.exponent_cache[N][k] ||= [Math.cos(x), Math.sin(x)];
    return this.exponent_cache[N][k];
  }
  exponentList(N: number) {
    return [
      new Float32Array(N).map((e, k) => Math.cos(-2 * Math.PI * (k / N))),
      new Float32Array(N).map((e, k) => Math.sin(-2 * Math.PI * (k / N))),
    ] as [F32V, F32V];
  }
  modulo(k: number, N: number, modulo: number) {
    const root = modulo - 1;
    this.modulo_cache[N] ||= [];
    this.modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo;
    return this.modulo_cache[N][k];

  }
};
