export const bandpass = (x: number, low: number, high: number) => low <= x && x < high ? x : NaN;
