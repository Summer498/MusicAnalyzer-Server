import { argmax } from "@music-analyzer/math/src/reduction/arg-max";
import { Complex } from "@music-analyzer/math/src/fft/complex";
import { correlation } from "@music-analyzer/math/src/fft";
import { decimal } from "@music-analyzer/math/src/basic-function/decimal";
import { getRange } from "@music-analyzer/math/src/array/range";
import { getZeros } from "@music-analyzer/math/src/array/zeros";
import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { totalSum } from "@music-analyzer/math/src/reduction/sum";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";

export type BeatInfo = {
  tempo: number,
  phase: number
}

export const calcTempo = (melodies: TimeAndAnalyzedMelody[], romans: TimeAndRomanAnalysis[]) => {
  const phase = 0;
  const melody_bpm: number[] = [];
  const bpm_range = 90;
  const onsets = getZeros(Math.ceil(melodies[melodies.length - 1].time.end * 100));
  const melody_phase: number[][] = getRange(0, 90).map(i => getZeros(90 + i));  // [bpm][phase]
  const b = Math.log2(90);  // 90 ~ 180
  melodies.forEach((e, i) => {
    if (i + 1 >= melodies.length) { return; }
    const term = melodies[i + 1].time.begin - melodies[i].time.begin + (Math.random() - 0.5) / 100;
    if (60 / term > 300 * 4) { return; }
    const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
    const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
    if (isNaN(melody_bpm[bpm])) { melody_bpm[bpm] = 0; }
    melody_bpm[bpm]++;

    // ビートを求める方法その2 (考え中)
    getRange(0, bpm_range).forEach(bpm => {
      melody_phase[bpm][Math.floor(mod(e.time.begin, bpm + 90))]++;
    });
    // ビートを求める方法その3 (採用中 & 考え中)
    onsets[Math.floor(e.time.begin * 100)] = 1;
  });
  /*
  console.log("melody_bpm");
  console.log(melody_bpm);
  */

  // ビートを求める方法その2 (考え中)
  const entropy = melody_phase.map(e => {
    const sum = totalSum(e);
    const prob = e.map(e => e / sum);
    return { phase, tempo: totalSum(prob.map(p => p === 0 ? 0 : -p * Math.log2(p))) };
  });
  /*
  console.log(melody_phase);
  console.log("bpm_entropy");
  console.log(entropy);
  */

  // ビートを求める方法その3 (採用中 & 考え中)
  onsets.forEach((e, i) => e === 0 && i !== 0 && (onsets[i] = onsets[i - 1] * 0.9));  // オンセット時に最大値, 時間経過で減衰する信号を作る
  const w = (tau: number) => {
    const tau_0 = 50;  // 0.5 * 100
    const sigma_tau = 2;
    const x = Math.log2(tau / tau_0) / sigma_tau;
    return Math.exp(-x * x / 2);
  };
  /*
  console.log("onsets");
  console.log(onsets);
  */
 const complex_onset = onsets.map(e => new Complex(e, 0));
  const tps = correlation(
    complex_onset,
    complex_onset,
  ).map((e, tau) => w(tau) * e.re);
  /*
  console.log("tempo period strength");
  console.log(tps);
  console.log(argmax(tps));
  console.log(tps.map((e, i) => [e, i]).sort((p, c) => p[0] > c[0] ? -1 : p[0] === c[0] ? 0 : 1));
  */

  // NOTE: 未使用
  const roman_bpm: number[] = [];
  romans.forEach((_, i) => {
    if (i + 1 >= romans.length) { return; }
    const term = romans[i + 1].time.begin - romans[i].time.begin;
    const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
    const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
    if (isNaN(roman_bpm[bpm])) { roman_bpm[bpm] = 0; }
    roman_bpm[bpm]++;
  });
  /*
  console.log("roman_bpm");
  console.log(roman_bpm);
  */
  return { phase, tempo: argmax(tps) } as BeatInfo;
};