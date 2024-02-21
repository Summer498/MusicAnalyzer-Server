import { TimeAnd } from "../timeAnd";

// 指定区間の melody の探索
// begin を含み, end を含まない
export const search_items_in_range = <U extends TimeAnd>(
  time: U[],
  begin: number,
  end: number,
) => {
  // Require: melodies は時間昇順にソート済み
  let bl = 0;
  let el = 0;
  let br = time.length;
  let er = time.length;
  const b_tgt = begin;
  const e_tgt = end;

  while (br - bl > 1 && er - el > 1) {
    const bmf = bl + Math.floor((br - bl) / 2);
    const emf = el + Math.floor((er - el) / 2);
    const bmc = bl + Math.ceil((br - bl) / 2);
    const emc = el + Math.ceil((er - el) / 2);
    const bm_val = time[bmf].begin;
    const em_val = time[emc].begin;
    if (b_tgt < bm_val) { br = bmc; }
    else if (bm_val < b_tgt) { bl = bmf; }
    else { bl = bmf; }

    if (e_tgt < em_val) { er = emc; }
    else if (em_val < e_tgt) { el = emf; }
    else { er = emc; }
  }
  if (b_tgt <= time[bl].begin) { br = bl; }

  return { begin_index: br, end_index: er };
};
