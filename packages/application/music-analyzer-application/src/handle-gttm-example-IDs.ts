import { song_list } from "@music-analyzer/gttm";

declare const tunes: HTMLUListElement;

const compoundPR = (tune_no: number) => {
  return {
    ...song_list[tune_no],
    pr: tune_no <= 100
  };
};

const songData = (tune_id: string) => {
  const tune_match = tune_id?.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(tune_id);
  return tune_no && compoundPR(tune_no) || undefined;
};

const appendURLItem = (mode: string, song_id: string, song_data: ReturnType<typeof songData>) => {
  const anchor = document.createElement("a");
  anchor.innerHTML = `[${song_id}-${mode.toUpperCase()}]: ${song_data?.author || ""}, <strong>"${song_data?.title || ""}"</strong>`;
  anchor.href = `/MusicAnalyzer-server/html/analyze?tune=${song_id}&${mode.toLowerCase()}`;
  const item = document.createElement("li");
  item.appendChild(anchor);
  tunes.insertAdjacentElement("beforeend", item);
};

const songId2SongURL = (song_id: string) => {
  const song_data = songData(song_id);
  appendURLItem("TSR", song_id, song_data);
  song_data?.pr && appendURLItem("PR", song_id, song_data);
};

export const handleGttmExampleIDs = (gttm_examples: string[]) => {
  const srt_gttm_examples = gttm_examples.sort((a, b) => a.localeCompare(b, [], { numeric: true }));  //  Natural sort order
  srt_gttm_examples.forEach(songId2SongURL);
  console.log(srt_gttm_examples);
};
