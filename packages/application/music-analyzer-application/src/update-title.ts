import { song_list } from "@music-analyzer/gttm";

export const updateTitle = (
  title: HTMLHeadingElement,
  mode: "TSR" | "PR" | "",
  tune_id: string,
) => {
  title.textContent = mode ? `[${mode}] ${tune_id}` : tune_id;
  const tune_match = tune_id.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(tune_id);
  if (tune_no) {
    const song_data = song_list[tune_no];
    title.innerHTML = `[${mode || "???"}] ${tune_id}, ${song_data.author}, <i>"${song_data.title}"</i>`;
  }
};
