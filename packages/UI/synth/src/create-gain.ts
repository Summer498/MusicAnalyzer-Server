// ゲインオブジェクトを作る
export function createGain(ctx: AudioContext, parentNode: AudioNode, gain: number) {
  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;
  gainNode.connect(parentNode);
  return gainNode;
}
