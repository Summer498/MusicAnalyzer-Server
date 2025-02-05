import { rgbToString } from "@music-analyzer/color";
import { ArrowSVG } from "../arrow/arrow";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { HierarchyLevel } from "@music-analyzer/controllers";

export const chord_gravities: SVGElement[] = [];

export const getChordGravitySVG = (melody: IMelodyModel, i: number, melodies: IMelodyModel[], hierarchy_level: HierarchyLevel, layer?: number) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const chord_gravity = melody.melody_analysis.chord_gravity;
  if (chord_gravity?.resolved && chord_gravity.destination !== undefined) {
    const svg = new ArrowSVG(melody, next, chord_gravity, fill, stroke, hierarchy_level, layer);
    res.push(svg);
    chord_gravities.push(svg.svg);
  }
  return res;
};
