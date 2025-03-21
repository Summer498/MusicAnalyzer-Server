export const bandpass = (x: number, low: number, high: number) => low <= x && x < high ? x : NaN;
export const freq2midi = (freq: number) => 12 * (Math.log2(freq) - Math.log2(440)) + 69;
export const midi2freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
export const roundOnMIDI = (freq: number) => midi2freq(Math.round(freq2midi(freq)));
