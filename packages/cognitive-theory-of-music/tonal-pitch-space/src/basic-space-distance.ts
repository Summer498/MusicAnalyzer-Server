import { RomanChord } from "@music-analyzer/roman-chord/src/roman-chord";
import { totalSum } from "@music-analyzer/math/src/reduction/sum";
import { vSub } from "@music-analyzer/math/src/vector/sub";
import { getBasicSpace } from "./get-basic-space";

export const basicSpaceDistance = (src: RomanChord, dst: RomanChord) => {
  const src_bs = getBasicSpace(src);
  const dst_bs = getBasicSpace(dst);
  const incremented = vSub(dst_bs, src_bs).filter(e => e > 0);
  return totalSum(incremented);
  // TODO: 遠隔調の例外処理 (がそもそも必要なのか?)
};
