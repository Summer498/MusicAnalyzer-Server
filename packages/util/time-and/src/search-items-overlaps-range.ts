// 指定区間の item の探索

import { Time } from "./time";

// begin <= item.end && item.begin < end
export const search_items_overlaps_range = <U extends { time: Time }>(
  items: U[],
  time: Time,
) => {
  // Require: item は時間昇順にソート済み
  let bl = 0;
  let el = 0;
  let br = items.length;
  let er = items.length;
  const b_tgt = time.begin;
  const e_tgt = time.end;

  if (items.length === 0) { return { begin_index: 0, end_index: 0 }; }
  while (br - bl > 1 && er - el > 1) {
    const bmf = bl + Math.floor((br - bl) / 2);
    const bmc = bl + Math.ceil((br - bl) / 2);
    const bm_val = items[bmf].time.end;
    if (b_tgt < bm_val) { br = bmc; }
    else if (bm_val < b_tgt) { bl = bmf; }
    else { bl = bmf; }

    const emf = el + Math.floor((er - el) / 2);
    const emc = el + Math.ceil((er - el) / 2);
    const em_val = items[emc].time.begin;
    if (e_tgt < em_val) { er = emc; }
    else if (em_val < e_tgt) { el = emf; }
    else { er = emc; }
  }
  if (b_tgt < items[bl].time.end) { br = bl; }

  return { begin_index: br, end_index: er };
};
