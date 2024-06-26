import { SVG } from "@music-analyzer/html";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { getBeatBars } from "@music-analyzer/beat-view";
import { chord_name_margin, chord_text_size, getChordKeysSVG, getChordNamesSVG, getChordNotesSVG, getChordRomansSVG } from "@music-analyzer/chord-view";
import { getArrowSVGs, getDMelodySVGs, getIRSymbolSVGs, getMelodySVGs } from "@music-analyzer/melody-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SvgAndParam, WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { 
  PianoRollWidth, 
  CurrentTimeX, 
  octave_cnt, 
  white_bgs_prm, 
  piano_roll_height, 
  octave_height, 
  white_position, 
  black_bgs_prm,
  white_key_prm,
  black_position,
  black_key_prm,
} from "@music-analyzer/view-parameters";

export class SvgAndParams<T extends { svg: SVGElement }> implements WindowReflectable {
  svg;
  onWindowResized;
  constructor(svg_and_params: T[], onWindowResized: (e: T) => void) {
    this.svg = svg_and_params;
    this.onWindowResized = () => this.svg.forEach(e => onWindowResized(e));
    WindowReflectableRegistry.instance.register(this);
  }
}

export const getCurrentTimeLine = () => new SvgAndParams(
  [{
    svg: SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" })
  }],
  e => e.svg.setAttributes({ x1: CurrentTimeX.value, x2: CurrentTimeX.value, y1: 0, y2: piano_roll_height })
);

export const getWhiteBGs = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(7)].map((_, j) => ({
      svg: SVG.rect({ name: "white-BG", fill: white_bgs_prm.fill, stroke: white_bgs_prm.stroke, }),
      oct,
      y: octave_height * oct + white_bgs_prm.height * white_position[j],
      width: white_bgs_prm.width,
      height: white_bgs_prm.height
    }))
  ).flat(),
  (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
);

export const getBlackBGs = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(5)].map((_, j) => ({
      svg: SVG.rect({ name: "black-BG", fill: black_bgs_prm.fill, stroke: black_bgs_prm.stroke, }),
      oct,
      y: octave_height * oct + black_bgs_prm.height * black_position[j],
      width: black_bgs_prm.width,
      height: black_bgs_prm.height
    }))
  ).flat(),
  (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
);

export const getOctaveBGs = (white_BGs: SvgAndParams<SvgAndParam>, black_BGs: SvgAndParams<SvgAndParam>) => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) => ({
    svg: SVG.g({ name: "octave-BG" }, undefined, [
      white_BGs.svg.filter(e => e.oct === oct).map(e => e.svg),
      black_BGs.svg.filter(e => e.oct === oct).map(e => e.svg)
    ]),
    y: octave_height * oct,
    height: octave_height,
    oct,
    width: 0
  })),
  (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
);


export const getWhiteKeys = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(7)].map((_, j) => ({
      svg: SVG.rect({ name: "white-key", fill: white_key_prm.fill, stroke: white_key_prm.stroke, }),
      oct,
      y: octave_height * oct + white_key_prm.height * [0, 1, 2, 3, 4, 5, 6][j],
      width: white_key_prm.width,
      height: white_key_prm.height
    }))
  ).flat(),
  e => e.svg.setAttributes({ x: 0, y: e.y, width: e.width, height: e.height })
);

export const getBlackKeys = () => new SvgAndParams(
  [...Array(octave_cnt)].map((_, oct) =>
    [...Array(5)].map((_, j) => ({
      svg: SVG.rect({ name: "black-key", fill: black_key_prm.fill, stroke: black_key_prm.stroke, }),
      oct,
      y: octave_height * oct + black_key_prm.height * black_position[j],
      width: black_key_prm.width,
      height: black_key_prm.height
    }))
  ).flat(),
  e => e.svg.setAttributes({ x: 0, y: e.y, width: e.width, height: e.height })
);

export const getOctaveKeys = (white_key: SvgAndParams<SvgAndParam>, black_key: SvgAndParams<SvgAndParam>) =>
  new SvgAndParams(
    [...Array(octave_cnt)].map((_, oct) => ({
      svg: SVG.g({ name: "octave-key" }, undefined, [
        white_key.svg.filter(e => e.oct === oct).map(e => e.svg),
        black_key.svg.filter(e => e.oct === oct).map(e => e.svg)
      ]),
      y: octave_height * oct,
      height: octave_height,
      oct,
      width: 0
    })),
    (e) => e.svg.setAttributes({ x: 0, y: e.y, width: PianoRollWidth.value, height: e.height })
  );

  type AnalysisData = {
    beat_info: BeatInfo
    romans: TimeAndRomanAnalysis[]
    melodies: TimeAndMelodyAnalysis[]
    d_melodies: TimeAndMelodyAnalysis[]
  }
  export const getPianoRoll = (analysis_data: AnalysisData) =>
    // svg element の作成
    new SvgAndParams(
      [{
        svg: SVG.svg({ name: "piano-roll" }, undefined, [
          // 奥側
          SVG.g({ name: "octave-BGs" }, undefined, getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg.map(e => e.svg)),
  
          [
            getBeatBars(analysis_data.beat_info, analysis_data.melodies),
            getChordNotesSVG(analysis_data.romans),
            getChordNamesSVG(analysis_data.romans),
            getChordRomansSVG(analysis_data.romans),
            getChordKeysSVG(analysis_data.romans),
            getDMelodySVGs(analysis_data.d_melodies),
            getMelodySVGs(analysis_data.melodies),
            getIRSymbolSVGs(analysis_data.melodies),
          ].map(e => e.group),
  
          SVG.g({ name: "gravities" }, undefined, (() => {
            const arrow_svgs = getArrowSVGs(analysis_data.melodies);
  
            return [
              arrow_svgs.all.map(e => e.line),
              arrow_svgs.all.map(e => e.triangle)
            ];
          })()),
  
          SVG.g({ name: "octave-keys" }, undefined, getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg.map(e => e.svg)),
          getCurrentTimeLine().svg[0].svg,
          // 手前側
        ].flat())
      }],
      (e) => { e.svg.setAttributes({ x: 0, y: 0, width: PianoRollWidth.value, height: piano_roll_height + chord_text_size * 2 + chord_name_margin }); }
    );
  