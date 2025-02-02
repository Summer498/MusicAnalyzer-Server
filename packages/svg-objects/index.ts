import { CurrentTimeLine } from "./src/current-time-line";
import { SvgAndParams } from "./src/svg-and-param";
import { WhiteBG_SVG } from "./src/white-bg";
import { BlackBG_SVG } from "./src/black-bg";
import { OctaveBG } from "./src/octave-bg";
import { WhiteKeySVG } from "./src/white-key";
import { BlackKeySVG } from "./src/black-key";
import { OctaveKeys } from "./src/octave-keys";
import { OctaveCount } from "@music-analyzer/view-parameters";

export const getCurrentTimeLine = () => new CurrentTimeLine();

export const getWhiteBGs = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
    [...Array(7)].map((_, white_index) => new WhiteBG_SVG(oct, white_index))
  ).flat()
);

export const getBlackBGs = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
    [...Array(5)].map((_, black_index) => new BlackBG_SVG(oct, black_index))
  ).flat()
);

export const getOctaveBGs = (white_BGs: SvgAndParams<WhiteBG_SVG>, black_BGs: SvgAndParams<BlackBG_SVG>) => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) => new OctaveBG(oct, white_BGs, black_BGs))
);

export const getWhiteKeys = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
    [...Array(7)].map((_, white_index) => new WhiteKeySVG(oct, white_index))
  ).flat()
);

export const getBlackKeys = () => new SvgAndParams(
  [...Array(OctaveCount.value)].map((_, oct) =>
    [...Array(5)].map((_, j) => new BlackKeySVG(oct, j))
  ).flat()
);

export const getOctaveKeys = (white_key: SvgAndParams<WhiteKeySVG>, black_key: SvgAndParams<BlackKeySVG>) =>
  new SvgAndParams(
    [...Array(OctaveCount.value)].map((_, oct) => new OctaveKeys(oct, white_key, black_key)),
  );


export { PianoRoll } from "./src/piano-roll";