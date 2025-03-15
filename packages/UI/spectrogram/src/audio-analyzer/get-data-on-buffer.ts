export const getByteTimeDomainData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Uint8Array(buffer_length);
  analyser.getByteTimeDomainData(buffer);
  return buffer;
}

export const getByteFrequencyData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Uint8Array(buffer_length);
  analyser.getByteFrequencyData(buffer);
  return buffer;
}

export const getFloatTimeDomainData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Float32Array(buffer_length);
  analyser.getFloatTimeDomainData(buffer);
  return buffer;
}

export const getFloatFrequencyData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Float32Array(buffer_length);
  analyser.getFloatFrequencyData(buffer);
  return buffer;
}
