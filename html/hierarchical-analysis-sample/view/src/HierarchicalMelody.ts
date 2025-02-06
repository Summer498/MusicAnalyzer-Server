import { analyzeMelody } from "@music-analyzer/melody-analyze";
import { TS } from "@music-analyzer/gttm";
import { getTimeAndMelodyFromTS } from "./TimeSpanMapping";
import { MusicXML } from "@music-analyzer/gttm";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { ReductionElement } from "@music-analyzer/gttm";

export const getHierarchicalMelody = (reduction: ReductionElement, matrix:TS[][], musicxml:MusicXML, roman: TimeAndRomanAnalysis[]) => {
  // 全階層分の IR 分析
  const hierarchical_time_and_melodies = [...Array(reduction.getDepthCount())].map((_, i) => reduction.getArrayOfLayer(i)!.map(element => {
    return {
      ...getTimeAndMelodyFromTS(element, matrix, musicxml),
      head: {
        begin: matrix[element.measure][element.note].leftend,
        end: matrix[element.measure][element.note].rightend
      }
    };
  }));
  //TODO: begin, end を適切な位置 (開始位置＋長さ) に変換する
  hierarchical_time_and_melodies.forEach(layer => layer.forEach(ts_element => {
    const w = 3.5 / 8;  // NOTE: 1 measure = 3.5
    const b = 0;
    ts_element.begin = ts_element.begin * w + b;
    ts_element.end = ts_element.end * w + b;
    ts_element.head.begin = ts_element.head.begin * w + b;
    ts_element.head.end = ts_element.head.end * w + b;
    ts_element.note;
  }));
  return hierarchical_time_and_melodies.map(time_and_melody => analyzeMelody(time_and_melody, roman).map(e => ({ IR: e.melody_analysis.implication_realization.symbol, ...e })));
};
