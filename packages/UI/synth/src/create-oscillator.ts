// オシレータオブジェクトを作る
export function createOscillator(
  ctx: AudioContext,
  parentNode: AudioNode,
  type: OscillatorType,
  frequency: number,
  detune: number,
) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = frequency;
  osc.detune.value = detune;
  osc.connect(parentNode);
  return osc;
}
