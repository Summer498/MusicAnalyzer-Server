import { analyzeMelody } from "@music-analyzer/melody-analyze";
import { TS } from "@music-analyzer/gttm/src/TSR";
import { getTimeAndMelodyFromTS } from "./TimeSpanMapping";
import { MusicXML } from "@music-analyzer/gttm/src/MusicXML";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";

export const getHierarchicalMelody = (ts: TS, musicxml:MusicXML, roman: TimeAndRomanAnalysis[]) => {
  // 全階層分の IR 分析
  const hierarchical_time_and_melodies = [...Array(ts.getDepthCount())].map((_, i) => ts.getArrayOfLayer(i)!.map(e => {
    return {
      ...getTimeAndMelodyFromTS(e, musicxml),
      head: { begin: e.getHeadElement().leftend, end: e.getHeadElement().rightend }
    };
  }));
  //TODO: begin, end を適切な位置 (開始位置＋長さ) に変換する
  hierarchical_time_and_melodies.forEach(e => e.forEach(e => {
    const w = 3.5 / 8;  // NOTE: 1 measure = 3.5
    const b = 0;
    e.begin = e.begin * w + b;
    e.end = e.end * w + b;
    e.head.begin = e.head.begin * w + b;
    e.head.end = e.head.end * w + b;
    e.note;
  }));
  return hierarchical_time_and_melodies.map(time_and_melody => analyzeMelody(time_and_melody, roman).map(e => ({ IR: e.melody_analysis.implication_realization.symbol, ...e })));
};
