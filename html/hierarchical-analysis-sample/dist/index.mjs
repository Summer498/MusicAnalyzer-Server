// index.ts
import { song_list } from "@music-analyzer/gttm";
var compoundPR = (tune_no) => {
  return {
    ...song_list[tune_no],
    pr: tune_no <= 100
  };
};
var songData = (tune_id) => {
  const tune_match = tune_id?.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(tune_id);
  return tune_no && compoundPR(tune_no) || void 0;
};
var appendURLItem = (mode, song_id, song_data) => {
  const anchor = document.createElement("a");
  anchor.innerHTML = `[${song_id}-${mode.toUpperCase()}]: ${song_data?.author || ""}, <strong>"${song_data?.title || ""}"</strong>`;
  anchor.href = `/MusicAnalyzer-server/html/analyze?tune=${song_id}&${mode.toLowerCase()}`;
  const item = document.createElement("li");
  item.appendChild(anchor);
  tunes.insertAdjacentElement("beforeend", item);
};
var songId2SongURL = (song_id) => {
  const song_data = songData(song_id);
  appendURLItem("TSR", song_id, song_data);
  song_data?.pr && appendURLItem("PR", song_id, song_data);
};
var handleGttmExampleIDs = (gttm_examples) => {
  const srt_gttm_examples = gttm_examples.sort((a, b) => a.localeCompare(b, [], { numeric: true }));
  srt_gttm_examples.forEach(songId2SongURL);
  console.log(srt_gttm_examples);
};
var main = () => {
  fetch("/MusicAnalyzer-server/api/gttm-example/").then((e) => e.json()).then(handleGttmExampleIDs);
};
main();
