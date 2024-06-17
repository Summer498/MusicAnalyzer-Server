export type Path = "./" | "./.." | "./../.." | "./../../.." | "./../../../.." | "./../../../../.."
export type BeatPos = `P${number}` | `P${number}-I${number}` | `P${number}-${number}-${number}`
export type SingleOrArray<T> = T | T[]
