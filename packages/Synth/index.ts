const audioCtx = new AudioContext();

// 正規乱数を生成
function normal_rand(m: number, s: number) {
  const r = Math.sqrt(-2 * Math.log(Math.random()));
  const t = 2 * Math.PI * Math.random();
  return [r * Math.cos(t), r * Math.sin(t)];
}

// オシレータオブジェクトを作る
function createOscillator(
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

// ゲインオブジェクトを作る
function createGain(ctx: AudioContext, parentNode: AudioNode, gain: number) {
  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;
  gainNode.connect(parentNode);
  return gainNode;
}

// 任意個の音符を鳴らす
export function play(
  hzs = [330, 440, 550],
  begin_sec: number,
  length_sec: number,
) {
  const ctx = audioCtx;
  const parent = audioCtx.destination;

  const peak = 1 / hzs.length;
  const attack = 0.02; // [s]
  const decay = 0.4; // [s]
  const sustain = 0.7 * peak;
  const release = 0.1 * length_sec; // [s]

  const detune = 0;
  const detune_delta = 1;
  hzs.map((hz, i) => {
    const gain_node = createGain(ctx, parent, 0);
    const osc = createOscillator(
      ctx,
      gain_node,
      "sawtooth",
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

export function play_note(hzs = [330, 440, 550], bpm = 60, note_value = 4) {
  play(hzs, 0, 240 / (bpm * note_value));
}
