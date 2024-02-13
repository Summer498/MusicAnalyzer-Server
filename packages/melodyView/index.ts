type MelodyAnalysis = {
  gravity: {
    destination: number | undefined;
    resolved: boolean;
  }[];
};

export type timeAndMelodyAnalysis = {
  time: number[];
  note: number;
  roman_name: string | undefined;
  melodyAnalysis: MelodyAnalysis;
  sound_reserved: boolean;
};

// 指定区間の melody の探索
// begin を含み, end を含まない
export const search_melody_in_range = (
  melodies: timeAndMelodyAnalysis[],
  begin: number,
  end: number,
) => {
  // Require: melodies は時間昇順にソート済み
  let bl = 0;
  let el = 0;
  let br = melodies.length;
  let er = melodies.length;
  const b_tgt = begin;
  const e_tgt = end;

  while (br - bl > 1 && er - el > 1) {
    const bmf = bl + Math.floor((br - bl) / 2);
    const emf = el + Math.floor((er - el) / 2);
    const bmc = bl + Math.ceil((br - bl) / 2);
    const emc = el + Math.ceil((er - el) / 2);
    const bm_val = melodies[bmf].time[0];
    const em_val = melodies[emc].time[0];
    if (b_tgt < bm_val) {
      br = bmc;
    } else if (bm_val < b_tgt) {
      bl = bmf;
    } // (b_tgt === melodies[bmf].time[0])
    else {
      bl = bmf;
    }

    if (e_tgt < em_val) {
      er = emc;
    } else if (em_val < e_tgt) {
      el = emf;
    } // (e_tgt === melodies[emc].time[0])
    else {
      er = emc;
    }
  }
  if (b_tgt <= melodies[bl].time[0]) {
    br = bl;
  }

  return { begin_index: br, end_index: er };
};
