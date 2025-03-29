export const getFloatFrequencyData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Float32Array(buffer_length);
  analyser.getFloatFrequencyData(buffer);
  return buffer;
}
