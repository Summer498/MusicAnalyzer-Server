import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { RequiredByDMelodySeries } from "./required-by-d-melody-series";
import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { Part } from "../abstract/abstract-part";
import { insertMelody } from "../melody-editor/insert";
import { hsv2rgb } from "@music-analyzer/color";
import { rgbToString } from "@music-analyzer/color";
import { View } from "../abstract/abstract-view";
import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Model } from "../abstract/abstract-model";

class DMelodyView 
  extends View<"rect"> {
  constructor() {
    super("rect");
    this.svg.id = "melody-note";
    this.svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
    this.svg.style.stroke = "rgb(64, 64, 64)";
  }
  set onclick(value: () => void) { this.svg.onclick = value; };
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}

class DMelodyModel
  extends Model {
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
  constructor(e: SerializedTimeAndAnalyzedMelody) {
    super(
      e.time,
      e.head,
    )
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
  }
}

class DMelody
  extends Part<DMelodyModel, DMelodyView>
  {
  constructor(
    model: DMelodyModel,
    view: DMelodyView,
  ) {
    super(model, view);
    this.onAudioUpdate();
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(this.converter.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(isNaN(this.model.note) ? -99 : -this.converter.convertToCoordinate(this.converter.transposed(this.model.note))) }
  updateWidth() { this.view.updateWidth(this.converter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
  onTimeRangeChanged = this.onWindowResized
}

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody> {
  constructor(
    children: DMelody[],
    controllers: RequiredByDMelodySeries,
  ) {
    super("detected-melody", children);
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.d_melody.addListeners(this.onDMelodyVisibilityChanged.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this))
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

export function buildDMelody(this: IHierarchyBuilder) {
  const parts = this.d_melody.map(e => {
    const model = new DMelodyModel(e);
    const view = new DMelodyView();
    
    return new DMelody(model, view)
  })
  return new DMelodySeries(parts, this.controllers);
}
