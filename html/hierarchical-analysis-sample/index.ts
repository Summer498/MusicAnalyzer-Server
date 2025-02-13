import { song_list } from "./view/src/songlist";

console.log("this is hierarchical analysis list");

declare const tunes: HTMLUListElement;

const songData = (tune_id: string) => {
  const tune_match = tune_id?.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(tune_id);
  if (tune_no) {
    const pr = tune_no <= 100;
    return {
      ...song_list[tune_no],
      pr
    };
  };
};

const hoge = (mode: string, song_id: string, song_data: ReturnType<typeof songData>) => {
  const anchor = document.createElement("a");
  anchor.innerHTML = `[${song_id}-${mode.toUpperCase()}]: ${song_data?.author || ""}, <strong>"${song_data?.title || ""}"</strong>`;
  anchor.href = `/MusicAnalyzer-server/html/hierarchical-analysis-sample/view?tune=${song_id}&${mode.toLowerCase()}`;
  const item = document.createElement("li");
  item.appendChild(anchor);
  tunes.insertAdjacentElement("beforeend", item);
};

(async () => {
  const gttm_examples: string[] = await (await fetch("/MusicAnalyzer-server/api/gttm-example/")).json();
  const srt_gttm_examples = gttm_examples.sort((a, b) => a.localeCompare(b, [], { numeric: true }));  //  Natural sort order

  srt_gttm_examples.forEach(song_id => {
    const song_data = songData(song_id);
    hoge("TSR", song_id, song_data);
    if (song_data?.pr) {
      hoge("PR", song_id, song_data);
    }

  });
  console.log(srt_gttm_examples);
})();