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
  type Mode = "TSR" | "PR" | "";
  const tune_id = url.urlParams.get("tune") || "";
  const mode: Mode = url.urlParams.has("pr") ? "PR" : url.urlParams.has("tsr") ? "TSR" : "";

  updateTitle(html.title, mode, tune_id);
  setAudioPlayer(url.resources, tune_id, url.audio_src, html.audio_player);
  loadMusicAnalysis(mode, tune_id)
    .then(setup(window, html, mode, tune_id));
}
