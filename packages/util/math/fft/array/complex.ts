type R = number;

export const revVC = <V extends TypedArray>(x: [V, V]) => [
  x[0].reverse(),
  x[1].reverse(),
] as [V, V]

export const addV2R = <V extends TypedArray>(...x: [V, R]) => x[0].map(e => e + x[1]) as V
export const subV2R = <V extends TypedArray>(...x: [V, R]) => x[0].map(e => e - x[1]) as V
export const mltV2R = <V extends TypedArray>(...x: [V, R]) => x[0].map(e => e * x[1]) as V

export const addV2VR = <V extends TypedArray>(...x: [V, V]) => x[0].map((e, i) => e + x[1][i]) as V
export const subV2VR = <V extends TypedArray>(...x: [V, V]) => x[0].map((e, i) => e - x[1][i]) as V
export const mltV2VR = <V extends TypedArray>(...x: [V, V]) => x[0].map((e, i) => e * x[1][i]) as V

export const sclV2R = <V extends TypedArray>(...x: [[V, V], R]) => [mltV2R(x[0][0], x[1]), mltV2R(x[0][1], x[1])] as [V, V]

export const addV2C = <V extends TypedArray>(...x: [[V, V], [R, R]]) => [addV2R(x[0][0], x[1][0]), addV2R(x[0][1], x[1][1])] as [V, V]
export const subV2C = <V extends TypedArray>(...x: [[V, V], [R, R]]) => [subV2R(x[0][0], x[1][0]), subV2R(x[0][1], x[1][1])] as [V, V]
export const mltV2C = <V extends TypedArray>(...x: [[V, V], [R, R]]) => [
  subV2VR(mltV2R(x[0][0], x[1][0]), mltV2R(x[0][1], x[1][1])),
  addV2VR(mltV2R(x[0][1], x[1][0]), mltV2R(x[0][0], x[1][1]))
] as [V, V]

export const addV2VC = <V extends TypedArray>(...x: [[V, V], [V, V]]) => [addV2VR(x[0][0], x[1][0]), addV2VR(x[0][1], x[1][1])] as [V, V]
export const subV2VC = <V extends TypedArray>(...x: [[V, V], [V, V]]) => [subV2VR(x[0][0], x[1][0]), subV2VR(x[0][1], x[1][1])] as [V, V]
export const mltV2VC = <V extends TypedArray>(...x: [[V, V], [V, V]]) => [
  subV2VR(mltV2VR(x[0][0], x[1][0]), mltV2VR(x[0][1], x[1][1])),
  addV2VR(mltV2VR(x[0][1], x[1][0]), mltV2VR(x[0][0], x[1][1]))
] as [V, V]
