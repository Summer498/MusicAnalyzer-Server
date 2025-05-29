import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, PianoRollTranslateX } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, MelodyColorController, TimeRangeController } from "@music-analyzer/controllers";

import { DMelodySeries } from "./src/d-melody-series";
import { ReductionHierarchy } from "./src/reduction-hierarchy";
import { GravityHierarchy } from "./src/gravity-hierarchy";
import { IRPlotSVG } from "./src/ir-plot-svg";
import { IRSymbolHierarchy } from "./src/ir-symbol-hierarchy";
import { MelodyHierarchy } from "./src/melody-hierarchy";
import { IRGravityHierarchy } from "./src/ir-gravity-hierarchy";
import { buildDMelody } from "./src/d-melody-series";
import { buildIRPlot } from "./src/ir-plot-svg";
import { buildIRSymbol } from "./src/ir-symbol-hierarchy";
import { buildMelody } from "./src/melody-hierarchy";
import { buildReduction } from "./src/reduction-hierarchy";
import { buildGravity } from "./src/gravity-hierarchy";
import { buildIRGravity } from "./src/ir-gravity-hierarchy";

export interface RequiredByMelodyElements {
  readonly gravity: GravityController
  readonly audio: AudioReflectableRegistry,
  readonly d_melody: DMelodyController,
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController

  readonly melody_beep: MelodyBeepController
  readonly melody_color: MelodyColorController
  readonly hierarchy: HierarchyLevelController,
}

const setControllers = (
  d_melodies: DMelodySeries,
  melody: MelodyHierarchy,
  ir_symbol: IRSymbolHierarchy,
  ir_plot: IRPlotSVG,
  ir_gravity: IRGravityHierarchy,
  chord_gravity: GravityHierarchy,
  scale_gravity: GravityHierarchy,
  reduction: ReductionHierarchy,
) => (
  controllers: RequiredByMelodyElements,
) => {
    const onAudioUpdate = (svg: SVGGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }

    const audioListeners = [
      ...[melody, ir_symbol, ir_gravity, reduction, scale_gravity, chord_gravity, ...ir_plot.children, d_melodies]
        .flatMap(e => e.children.map(e => e))
        .map(e => () => e.onAudioUpdate()),
    ]
    const beepMelody = () => melody.show.forEach(e => e.beep())
    controllers.audio.addListeners(...audioListeners, beepMelody);
    audioListeners.forEach(f => f())

    const windowListeners = [...[melody, ir_symbol, ir_gravity, reduction, scale_gravity, chord_gravity, ...ir_plot.children]
      .flatMap(e => e.children.map(e => e)), d_melodies]
      .flatMap(e => e.children.map(e => e))
      .map(e => e.onWindowResized.bind(e))
    controllers.window.addListeners(...windowListeners);

    const hierarchyListeners = [melody, ir_symbol, ir_gravity, reduction, chord_gravity, scale_gravity, ...ir_plot.children,]
      .map(e => e.onChangedLayer.bind(e))
    controllers.hierarchy.addListeners(...hierarchyListeners);

    const timeRangeListeners = [...[melody, ir_symbol, ir_gravity, reduction, chord_gravity, scale_gravity]
      .flatMap(e => e.children.map(e => e)), d_melodies]
      .flatMap(e => e.children.map(e => e))
      .map(e => e.onTimeRangeChanged.bind(e))
    controllers.time_range.addListeners(...timeRangeListeners);

    const melodyColorListeners = [
      ...melody.children,
      ...ir_symbol.children,
      ...ir_gravity.children,
      ...reduction.children,
      ...ir_plot.children.flatMap(e => e.children),
    ]
      .flatMap(e => e.children.flatMap(e => e))
      .map(e => e.setColor.bind(e))
    controllers.melody_color.addListeners(...melodyColorListeners);

    controllers.d_melody.addListeners(d_melodies.onDMelodyVisibilityChanged.bind(d_melodies));
    const melodyBeepCheckBoxListeners = melody.children.flatMap(e => e.children)
      .flatMap(e => e.onMelodyBeepCheckChanged.bind(e))
    controllers.melody_beep.checkbox.addListeners(...melodyBeepCheckBoxListeners);

    const melodyBeepVolumeListeners = melody.children.flatMap(e => e.children)
      .flatMap(e => e.onMelodyVolumeBarChanged.bind(e))
    controllers.melody_beep.volume.addListeners(...melodyBeepVolumeListeners)

    controllers.gravity.chord_checkbox.addListeners(chord_gravity.onUpdateGravityVisibility.bind(chord_gravity));
    controllers.gravity.scale_checkbox.addListeners(scale_gravity.onUpdateGravityVisibility.bind(scale_gravity));
  }

interface IHierarchyBuilder {
  readonly d_melody: SerializedTimeAndAnalyzedMelody[],
  readonly h_melodies: SerializedTimeAndAnalyzedMelody[][],
  readonly controllers: RequiredByMelodyElements,
}

export class MelodyElements {
  readonly children: SVGGElement[];
  readonly d_melody_collection: SVGGElement;
  readonly melody_hierarchy: SVGGElement;
  readonly ir_hierarchy: SVGGElement;
  readonly ir_plot_svg: SVGSVGElement;
  readonly ir_gravity: SVGGElement;
  readonly chord_gravities: SVGGElement;
  readonly scale_gravities: SVGGElement;
  readonly time_span_tree: SVGGElement;
  constructor(
    hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
    d_melodies: SerializedTimeAndAnalyzedMelody[],
    controllers: RequiredByMelodyElements
  ) {
    const d_melody_collection = buildDMelody(d_melodies);
    const melody_hierarchy = buildMelody(hierarchical_melody);
    const ir_hierarchy = buildIRSymbol(hierarchical_melody);
    const ir_plot_svg = buildIRPlot(hierarchical_melody);
    const ir_gravity = buildIRGravity(hierarchical_melody);
    const chord_gravities = buildGravity("chord_gravity", hierarchical_melody);
    const scale_gravities = buildGravity("scale_gravity", hierarchical_melody);
    const time_span_tree = buildReduction(hierarchical_melody);

    this.d_melody_collection = d_melody_collection.svg
    this.melody_hierarchy = melody_hierarchy.svg
    this.ir_hierarchy = ir_hierarchy.svg
    this.ir_plot_svg = ir_plot_svg.svg
    this.ir_gravity = ir_gravity.svg
    this.chord_gravities = chord_gravities.svg
    this.scale_gravities = scale_gravities.svg
    this.time_span_tree = time_span_tree.svg

    setControllers(
      d_melody_collection,
      melody_hierarchy,
      ir_hierarchy,
      ir_plot_svg,
      ir_gravity,
      chord_gravities,
      scale_gravities,
      time_span_tree,
    )(controllers);

    this.children = [
      this.d_melody_collection,
      this.melody_hierarchy,
      this.ir_hierarchy,
      this.ir_plot_svg,
      this.chord_gravities,
      this.scale_gravities,
      this.time_span_tree,
    ];
  }
}
