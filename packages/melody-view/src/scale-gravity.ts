import { rgbToString } from "@music-analyzer/color";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { ArrowSVG } from "./arrow";

// TODO: chord gravities と key gravities を別オブジェクトとして得られるようにする
export const key_gravities: SVGElement[] = [];

export const getScaleGravitySVG = (melody: IMelodyModel, i: number, melodies: IMelodyModel[], hierarchy_level: HierarchyLevel, layer?: number) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const scale_gravity = melody.melody_analysis.scale_gravity;
  if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, scale_gravity, fill, stroke, hierarchy_level, layer);
    res.push(svg);
    key_gravities.push(svg.svg);
  }
  return res;
};

