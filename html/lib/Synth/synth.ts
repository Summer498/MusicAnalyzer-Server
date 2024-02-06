window.AudioContext = window.AudioContext;
var audioCtx = new AudioContext();

// 正規乱数を生成
function normal_rand(m: number, s: number) {
  const r = Math.sqrt(-2 * Math.log(Math.random()))
  const t = 2 * Math.PI * Math.random()
  return [r * Math.cos(t), r * Math.sin(t)]
}

// オシレータオブジェクトを作る
function createOscillator(ctx: AudioContext, parentNode: AudioNode, type: OscillatorType, frequency: number, detune: number) {
  var osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.value = frequency
  osc.detune.value = detune
  osc.connect(parentNode)
  return osc
}

// ゲインオブジェクトを作る
function createGain(ctx: AudioContext, parentNode: AudioNode, gain: number) {
  var gainNode = ctx.createGain()
  gainNode.gain.value = gain
  gainNode.connect(parentNode)
  return gainNode
}


// 任意個の音符を鳴らす
export function play(hzs = [330, 440, 550], ms: number) {
  const ctx = audioCtx;
  const parent = audioCtx.destination

  const note_length = ms / 1000;  // [s]

  const peak = 1 / hzs.length
  const attack = 0.02;  // [s]
  const decay = 0.4;  // [s]
  const sustain = 0.7 * peak;
  const release = 0.1 * note_length;  // [s]

  const detune = 0;
  const detune_delta = 1;
  hzs.map((hz, i) => {
    const gain_node = createGain(ctx, parent, 0);
    const osc = createOscillator(ctx, gain_node, "sawtooth", hz, detune + detune_delta * i)
    osc.start = osc.start;
    osc.start();

    const currentTime = audioCtx.currentTime;  // 現在時刻[s]
    const delay = Math.random() * 0.1;  // 0~0.1[s]の遅延ノイズ
    const audioParam = gain_node.gain;
    audioParam.cancelScheduledValues(currentTime)
    audioParam.linearRampToValueAtTime(0, 0.002 + currentTime + delay);  // 初期振幅を 0 にする
    audioParam.linearRampToValueAtTime(peak, currentTime + delay + attack);  // attack [s] かけて peak まで増加
    audioParam.linearRampToValueAtTime(sustain, currentTime + delay + attack + decay);  // decay[s] かけて sustain まで減少
    audioParam.linearRampToValueAtTime(sustain, currentTime + delay + note_length - release);  // note_length[s] の release[s] 前に離鍵したことにする
    audioParam.exponentialRampToValueAtTime(0.001, currentTime + note_length);  // release[s] かけて 0 に減衰

    setTimeout(() => { osc.stop(0); }, ms);
  });
}


export function play_note(hzs = [330, 440, 550], bpm = 60, note_value = 4) {
  play(hzs, 240000 / (bpm * note_value))
}