import { song_list } from "./view/src/songlist";

console.log("this is hierarchical analysis list");

declare const tunes: HTMLUListElement;

const songData = (tune_id: string) => {
  const tune_match = tune_id?.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(tune_id);
  if (tune_no) {
    return song_list[tune_no];
  };
};

(async () => {
  const gttm_examples: string[] = await (await fetch("/MusicAnalyzer-server/api/gttm-example/")).json();
  const srt_gttm_examples = gttm_examples.sort((a, b) => a.localeCompare(b, [], { numeric: true }));  //  Natural sort order

  srt_gttm_examples.forEach(gttm_example => {
    const anchor = document.createElement("a");
    const song_data = songData(gttm_example);
    anchor.innerHTML = `[${gttm_example}]: ${song_data?.author || ""}, <strong>"${song_data?.title || ""}"</strong>`;
    anchor.href = `/MusicAnalyzer-server/html/hierarchical-analysis-sample/view?tune=${gttm_example}`;
    const item = document.createElement("li");
    item.appendChild(anchor);
    tunes.insertAdjacentElement("beforeend", item);
  });
  console.log(srt_gttm_examples);
})();