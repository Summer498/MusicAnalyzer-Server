type F32V = Float32Array<ArrayBuffer>

export interface RootOfUnity {
  exponent(k: number, N: number): [number, number]
  exponentList(N: number): [F32V, F32V]
  modulo(k: number, N: number, modulo: number): number
}

export const createRootOfUnity = (): RootOfUnity => {
  const exponent_cache: [number, number][][] = []
  const modulo_cache: number[][] = []
  return {
    exponent(k: number, N: number) {
      const x = -2 * Math.PI * (k / N)
      exponent_cache[N] ||= []
      exponent_cache[N][k] ||= [Math.cos(x), Math.sin(x)]
      return exponent_cache[N][k]
    },
    exponentList(N: number) {
      return [
        new Float32Array(N).map((e, k) => Math.cos(-2 * Math.PI * (k / N))),
        new Float32Array(N).map((e, k) => Math.sin(-2 * Math.PI * (k / N))),
      ] as [F32V, F32V]
    },
    modulo(k: number, N: number, modulo: number) {
      const root = modulo - 1
      modulo_cache[N] ||= []
      modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo
      return modulo_cache[N][k]
    },
  }
}
