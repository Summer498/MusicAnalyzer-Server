import { createGain } from "./create-gain";
import { createOscillator } from "./create-oscilllator";

const audioCtx = new AudioContext();

// 任意個の音符を鳴らす
export function play(
  hzs = [330, 440, 550],
  begin_sec: number,
  length_sec: number,
  amplitude = 1,
) {
  const ctx = audioCtx;
  const parent = audioCtx.destination;

  const peak = amplitude / hzs.length;  // amplitude
  const attack = 0.01; // [s]
  const decay = 0.4; // [s]
  const sustain = 0.7 * peak;  // amplitude
  const release = 0.05 * length_sec; // [s]

  const detune = 0;
  const detune_delta = 1;
  hzs.map((hz, i) => {
    const gain_node = createGain(ctx, parent, 0);
    const osc = createOscillator(
      ctx,
      gain_node,
      "square",
      hz,
      detune + detune_delta * i,
    );

    const start = audioCtx.currentTime + begin_sec; // 現在時刻[s]
    const delay = Math.random() * 0.1; // 0~0.1[s]の遅延ノイズ
    const audioParam = gain_node.gain;
    osc.start(start);
    audioParam.cancelScheduledValues(start);
    audioParam.linearRampToValueAtTime(0, 0.002 + start + delay); // 初期振幅を 0 にする
    audioParam.linearRampToValueAtTime(peak, start + delay + attack); // attack [s] かけて peak まで増加
    audioParam.linearRampToValueAtTime(sustain, start + delay + attack + decay); // decay[s] かけて sustain まで減少
    audioParam.linearRampToValueAtTime(sustain, start + delay + length_sec); // note_length[s] に離鍵
    audioParam.exponentialRampToValueAtTime(
      0.001,
      start + length_sec + release,
    ); // release[s] かけて 0 に減衰

    osc.stop(start + length_sec + release);
  });
}
