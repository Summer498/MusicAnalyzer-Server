import { song_list } from "@music-analyzer/gttm";
import { TitleInfo } from "../containers/tune-info";

export const updateTitle = (
  title: HTMLHeadingElement,
  gttm: TitleInfo,
) => {
  title.textContent = gttm.mode ? `[${gttm.mode}] ${gttm.id}` : gttm.id;
  const tune_match = gttm.id.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(gttm.id);
  if (tune_no) {
    const song_data = song_list[tune_no];
    title.innerHTML = `[${gttm.mode || "???"}] ${gttm.id}, ${song_data.author}, <i>"${song_data.title}"</i>`;
  }
};
