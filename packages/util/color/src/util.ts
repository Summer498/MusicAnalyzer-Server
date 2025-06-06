export const map2rgbByHue = (h: number, max: number, mid: number):[number,number,number] => {
  // createAssertion(0 <= h && h < 6).onFailed(() => { throw new RangeError(`Unexpected value received. It should be in 0 <= h < 6, but h is ${h}`); });

  switch (Math.floor(h)) {
    case 0: return [max, mid, 0];
    case 1: return [mid, max, 0];
    case 2: return [0, max, mid];
    case 3: return [0, mid, max];
    case 4: return [mid, 0, max];
    case 5: return [max, 0, mid];
    default: throw new Error(`Unexpected value received. It should be in 0 <= h < 6, but h is ${h}`);
  }
};
