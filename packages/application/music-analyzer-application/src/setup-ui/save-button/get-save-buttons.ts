import { PianoRoll } from "@music-analyzer/piano-roll";
import { HTMLsContainer, TitleInfo } from "../../containers";
import { getSaveButton } from "./get-save-button";
import { getRawSaveButton } from "./get-raw-save-button";

export const getSaveButtons = (
  title: TitleInfo,
  html: HTMLsContainer,
  piano_roll_view: PianoRoll,
) => {
  const tune_id = `${title.mode}-${title.id}`;
  return [
    getSaveButton(tune_id, html.title, piano_roll_view),
    getRawSaveButton(tune_id, html.title, piano_roll_view),
  ]
}