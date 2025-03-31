import { RomanChord } from "./facade";
import { totalSum } from "./facade";
import { vSub } from "./facade";
import { getBasicSpace } from "./get-basic-space";

export const basicSpaceDistance = (src: RomanChord, dst: RomanChord) => {
  const src_bs = getBasicSpace(src);
  const dst_bs = getBasicSpace(dst);
  const incremented = vSub(dst_bs, src_bs).filter(e => e > 0);
  return totalSum(incremented);
  // TODO: 遠隔調の例外処理 (がそもそも必要なのか?)
};
