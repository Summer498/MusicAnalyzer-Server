import { Complex, createComplex } from "./complex";

export interface RootOfUnity {
  exponent(k: number, N: number): Complex<number>
  modulo(k: number, N: number, modulo: number): number
}

export const createRootOfUnity = (): RootOfUnity => {
  const exponent_cache: Complex<number>[][] = []
  const modulo_cache: number[][] = []
  return {
    exponent(k: number, N: number) {
      const x = -2 * Math.PI * (k / N)
      exponent_cache[N] ||= []
      exponent_cache[N][k] ||= createComplex(Math.cos(x), Math.sin(x))
      return exponent_cache[N][k]
    },
    modulo(k: number, N: number, modulo: number) {
      const root = modulo - 1
      modulo_cache[N] ||= []
      modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo
      return modulo_cache[N][k]
    },
  }
}
