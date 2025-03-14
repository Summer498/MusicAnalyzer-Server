import { loadMusicAnalysis, setAudioPlayer } from "./data-loader";
import { HTMLsContainer } from "./HTMLs-container";
import { setup } from "./setup";
import { updateTitle } from "./update-title";
import { URLsContainer } from "./URLs-container";

export const setupApplication = (
  window: Window,
  html: HTMLsContainer,
  url: URLsContainer,
) => {
  updateTitle(html.title, url.tune_info.mode, url.tune_info.tune_id);
  setAudioPlayer(url.resources, url.tune_info.tune_id, url.audio_src, html.audio_player);
  loadMusicAnalysis(url.tune_info.mode, url.tune_info.tune_id)
    .then(setup(window, html, url.tune_info.mode, url.tune_info.tune_id));
}
