export const getByteFrequencyData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Uint8Array(buffer_length);
  analyser.getByteFrequencyData(buffer);
  return buffer;
}
